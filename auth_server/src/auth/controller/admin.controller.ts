import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../user/role/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../role.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('ADMIN')
  checkAdmin() {
    return '운영자 확인';
  }
}
