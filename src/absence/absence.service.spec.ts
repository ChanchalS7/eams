import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbsenceService } from './absence.service';
import { AbsenceRequest, AbsenceStatus } from './absence.entity';
import { User, Role } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('AbsenceService', () => {
  let service: AbsenceService;
  let absenceRepository: Repository<AbsenceRequest>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbsenceService,
        {
          provide: getRepositoryToken(AbsenceRequest),
          useClass: Repository, // Mock the repository
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock the repository
        },
      ],
    }).compile();

    service = module.get<AbsenceService>(AbsenceService);
    absenceRepository = module.get<Repository<AbsenceRequest>>(getRepositoryToken(AbsenceRequest));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of absence requests', async () => {
      const mockAbsenceRequests: AbsenceRequest[] = [
        { id: 'abs-1', startDate: new Date(), endDate: new Date(), reason: 'Sick', status: AbsenceStatus.PENDING, createdAt: new Date(), employeeId: 'user-1', employee: {} as User },
        { id: 'abs-2', startDate: new Date(), endDate: new Date(), reason: 'Vacation', status: AbsenceStatus.APPROVED, createdAt: new Date(), employeeId: 'user-2', employee: {} as User },
      ];
      jest.spyOn(absenceRepository, 'findAndCount').mockResolvedValue([mockAbsenceRequests, 2]);

      const result = await service.findAll(1, 10);

      expect(absenceRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['employee'],
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: mockAbsenceRequests,
        total: 2,
        page: 1,
        lastPage: 1,
      });
    });

    it('should handle different pagination parameters', async () => {
      const mockAbsenceRequests: AbsenceRequest[] = [
        { id: 'abs-1', startDate: new Date(), endDate: new Date(), reason: 'Sick', status: AbsenceStatus.PENDING, createdAt: new Date(), employeeId: 'user-1', employee: {} as User },
      ];
      jest.spyOn(absenceRepository, 'findAndCount').mockResolvedValue([mockAbsenceRequests, 1]);

      const result = await service.findAll(2, 5);

      expect(absenceRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['employee'],
        skip: 5,
        take: 5,
      });
      expect(result).toEqual({
        data: mockAbsenceRequests,
        total: 1,
        page: 2,
        lastPage: 1,
      });
    });
  });

  describe('create', () => {
    it('should create a new absence request', async () => {
      const userId = 'user-1';
      const createAbsenceDto = {
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Doctor appointment',
      };
      const mockEmployee = { id: userId, name: 'Test Employee', email: 'emp@example.com', role: Role.EMPLOYEE } as User;
      const savedAbsence = { id: 'abs-3', ...createAbsenceDto, employee: mockEmployee, employeeId: userId, status: AbsenceStatus.PENDING, createdAt: new Date() } as AbsenceRequest;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockEmployee);
      jest.spyOn(absenceRepository, 'create').mockReturnValue(savedAbsence);
      jest.spyOn(absenceRepository, 'save').mockResolvedValue(savedAbsence);

      const result = await service.create(userId, createAbsenceDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(absenceRepository.create).toHaveBeenCalledWith({ ...createAbsenceDto, employee: mockEmployee });
      expect(absenceRepository.save).toHaveBeenCalledWith(savedAbsence);
      expect(result).toEqual(savedAbsence);
    });

    it('should throw NotFoundException if employee not found during creation', async () => {
      const userId = 'nonexistent-user';
      const createAbsenceDto = {
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Holiday',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(userId, createAbsenceDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(userId, createAbsenceDto)).rejects.toThrow('Employee not found');
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an absence request to APPROVED', async () => {
      const absenceId = 'abs-1';
      const mockAbsence = { id: absenceId, startDate: new Date(), endDate: new Date(), reason: 'Sick', status: AbsenceStatus.PENDING, createdAt: new Date(), employeeId: 'user-1', employee: {} as User } as AbsenceRequest;
      const updatedAbsence = { ...mockAbsence, status: AbsenceStatus.APPROVED } as AbsenceRequest;

      jest.spyOn(absenceRepository, 'findOne').mockResolvedValue(mockAbsence);
      jest.spyOn(absenceRepository, 'save').mockResolvedValue(updatedAbsence);

      const result = await service.updateStatus(absenceId, AbsenceStatus.APPROVED);

      expect(absenceRepository.findOne).toHaveBeenCalledWith({ where: { id: absenceId }, relations: ['employee'] });
      expect(absenceRepository.save).toHaveBeenCalledWith(updatedAbsence);
      expect(result).toEqual(updatedAbsence);
    });

    it('should update the status of an absence request to REJECTED', async () => {
      const absenceId = 'abs-2';
      const mockAbsence = { id: absenceId, startDate: new Date(), endDate: new Date(), reason: 'Vacation', status: AbsenceStatus.PENDING, createdAt: new Date(), employeeId: 'user-2', employee: {} as User } as AbsenceRequest;
      const updatedAbsence = { ...mockAbsence, status: AbsenceStatus.REJECTED } as AbsenceRequest;

      jest.spyOn(absenceRepository, 'findOne').mockResolvedValue(mockAbsence);
      jest.spyOn(absenceRepository, 'save').mockResolvedValue(updatedAbsence);

      const result = await service.updateStatus(absenceId, AbsenceStatus.REJECTED);

      expect(absenceRepository.findOne).toHaveBeenCalledWith({ where: { id: absenceId }, relations: ['employee'] });
      expect(absenceRepository.save).toHaveBeenCalledWith(updatedAbsence);
      expect(result).toEqual(updatedAbsence);
    });

    it('should throw NotFoundException if absence request not found during status update', async () => {
      const absenceId = 'nonexistent-abs';

      jest.spyOn(absenceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatus(absenceId, AbsenceStatus.APPROVED)).rejects.toThrow(NotFoundException);
      await expect(service.updateStatus(absenceId, AbsenceStatus.APPROVED)).rejects.toThrow('Absence request not found');
    });
  });
});