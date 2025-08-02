@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException();
    return { access_token: this.jwtService.sign({ sub: user.id, role: user.role }) };
  }
}
