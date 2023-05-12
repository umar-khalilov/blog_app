import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { HashService } from '@/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';
import { UserDto } from './dto/user.dto';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { ChangeRoleDto } from './dto/change-role.dto';
import { typeReturn } from '@/common/utils/helpers.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly hashService: HashService,
    ) {}

    async createOne(data: CreateUserDto): Promise<UserEntity> {
        return typeReturn<UserEntity>(
            this.userRepository
                .createQueryBuilder()
                .insert()
                .into(UserEntity)
                .values({
                    ...data,
                    role: RoleTypes.WRITER,
                })
                .returning('*')
                .execute(),
        );
    }

    async findAll(
        pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<UserDto>> {
        const { take, skip, order } = pageOptionsDto;

        const [users, itemCount] = await this.userRepository
            .createQueryBuilder('user')
            .orderBy('user.id', order)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found users in database');
        }
        const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
        return new PaginationDto<UserDto>(users, pageMetaDto);
    }

    async findOneById(id: number): Promise<UserDto> {
        const foundUser = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();

        if (!foundUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
        return new UserDto(foundUser);
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect(['user.password'])
            .where('user.email = :email', { email })
            .getOneOrFail();
    }

    async updateById(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<UserDto> {
        if (updateUserDto.password) {
            updateUserDto.password =
                await this.hashService.convertToHashPassword(
                    updateUserDto.password,
                );
        }

        const updatedUser = await typeReturn<UserEntity>(
            this.userRepository
                .createQueryBuilder()
                .update(UserEntity)
                .set(updateUserDto)
                .where('id = :id', { id })
                .returning('*')
                .execute(),
        );
        if (!updatedUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
        return new UserDto(updatedUser);
    }

    async removeById(id: number): Promise<void> {
        const removedUser = await typeReturn<UserEntity>(
            this.userRepository
                .createQueryBuilder()
                .delete()
                .from(UserEntity)
                .where('id = :id', { id })
                .returning('id')
                .execute(),
        );
        if (!removedUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
    }

    async changeUserRole({ userId, role }: ChangeRoleDto): Promise<string> {
        const user = await this.findOneById(userId);
        if (user) {
            await typeReturn<UserEntity>(
                this.userRepository
                    .createQueryBuilder()
                    .update(UserEntity)
                    .set({ role })
                    .where('id = :userId', { userId })
                    .execute(),
            );
            return `Role: ${role} to user with that id: ${userId} successfully changed`;
        }
        throw new NotFoundException(`User with that id: ${userId} not found`);
    }
}
