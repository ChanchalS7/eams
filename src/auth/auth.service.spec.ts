import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // Assuming bcrypt is used for password hashing

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock the repository for in-memory testing
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockedJwtToken'), // Mock JwtService sign method
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'EMPLOYEE',
      };
      const savedUser = { id: 'uuid-123', ...createUserDto };

      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as User);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword'); // Mock bcrypt hash

      const result = await service.register(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
      expect(result.password).toBe('hashedPassword'); // Verify password was hashed (mocked)
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const existingUser = {
        id: 'uuid-123',
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10), // Hash a mock password
        role: 'EMPLOYEE',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Mock bcrypt compare

      const result = await service.login(loginDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, existingUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: existingUser.id, role: existingUser.role });
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
    });

    it('should throw UnauthorizedException for invalid credentials (user not found)', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for invalid credentials (incorrect password)', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const existingUser = {
        id: 'uuid-123',
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'EMPLOYEE',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Mock incorrect password

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateUser', () => {
    it('should return a user if found', async () => {
      const userId = 'uuid-123';
      const existingUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'EMPLOYEE',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser as User);

      const result = await service.validateUser(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(existingUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'nonexistent-uuid';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.validateUser(userId)).rejects.toThrow(UnauthorizedException);
      await expect(service.validateUser(userId)).rejects.toThrow('User not found');
    });
  });
});