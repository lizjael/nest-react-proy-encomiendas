import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password, role }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
      role, // si no se manda, el default de la entidad aplica (user)
    });

    return { name, email };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email no es correcto');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password no es correcto');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { token, email };
  }

  async profile(user: UserActiveInterface) {
    return await this.usersService.findMyProfile(user);
  }
}
