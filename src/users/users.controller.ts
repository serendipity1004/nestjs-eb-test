import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsOwnUserGuard } from './guard/is-own-user.guard';
import { IsAdminGuard } from 'src/auth/guard/is-admin.guard';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(IsAdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(IsOwnUserGuard)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(IsOwnUserGuard)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsOwnUserGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }
}
