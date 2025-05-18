import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@user/service/user.service';
import { UserDto } from '@user/dto/user.dto';
import { AuthService } from '@auth/service/auth.service';
import { Roles } from '../role/roles.decorator';

@Controller('maple/auth/users') // 'users' 경로로 시작하는 엔드포인트 처리
//@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 새 사용자 생성 (회원가입)
  @Post()
  async createUser(@Body() userDto: UserDto) {
    try {
      return await this.usersService.create(userDto);
    } catch (error) {
      throw new HttpException('사용자 생성 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 특정 사용자 조회
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // 모든 사용자 조회
  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  // 사용자 정보 수정
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    try {
      return await this.usersService.update(id, userDto);
    } catch (error) {
      throw new HttpException('사용자 정보 수정 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 사용자 삭제
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersService.delete(id);
    } catch (error) {
      throw new HttpException('사용자 삭제 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 로그인
  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    return this.authService.login(email, password);
  }

  // @Get()
  // @Roles('ADMIN')
  // checkAdmin() {
  //   return '운영자 확인';
  // }
}
