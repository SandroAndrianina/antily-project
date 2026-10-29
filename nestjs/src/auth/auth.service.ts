// logic
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email déjà utilisé');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save(this.users.create({ email: dto.email, passwordHash }));
    return this.token(user);
  }

  async login(dto: AuthDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.token(user);
  }

  async currentLogged(id: string) {
    const user = await this.users.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException('Identifiants non-trouve');
    }
    return {id: user.id, email: user.email };
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.users.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException('Identifiants non-trouve');
    }
    if (!(await bcrypt.compare(dto.oldPassword, user.passwordHash))) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }
    
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordHash = newPasswordHash;

    await this.users.save(user);
    return { message : "Mot de passe modifie" };

  }

  private token(user: User) {
    return { access_token: this.jwt.sign({ sub: user.id, email: user.email }) };
  }
}