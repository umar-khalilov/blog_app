import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './user.model';
import { HashService } from '@/hash/hash.service';
import { UpdateUserInput } from './inputs/update-user.input';
import { typeReturn } from '@/common/utils/helpers.util';
import { CreateUserInput } from './inputs/create-user.input';
import { ChangeRoleInput } from './inputs/change-role.input';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';
import { PageMetaOutput } from '@/common/outputs/page-meta.output';
import { PaginationOutput } from '@/common/outputs/pagination.output';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository: Repository<UserModel>,
        private readonly hashService: HashService,
    ) {}

    async createOne(data: CreateUserInput): Promise<UserModel> {
        return typeReturn<UserModel>(
            this.userRepository
                .createQueryBuilder()
                .insert()
                .into(UserModel)
                .values({
                    ...data,
                    role: RoleTypes.WRITER,
                })
                .returning('*')
                .execute(),
        );
    }

    async findAll(
        pageOptionsArgs: PageOptionsArgs,
    ): Promise<PaginationOutput<UserModel>> {
        const { take, skip, order } = pageOptionsArgs;

        const [users, itemCount] = await this.userRepository
            .createQueryBuilder('user')
            .orderBy('user.id', order)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found users in database');
        }
        const pageMetaOptions = new PageMetaOutput({
            pageOptionsArgs,
            itemCount,
        });
        return new PaginationOutput<UserModel>(users, pageMetaOptions);
    }

    async findAllWithoutPagination(): Promise<UserModel[]> {
        const [users, itemCount] = await this.userRepository
            .createQueryBuilder()
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found users in database');
        }
        return users;
    }

    async findOneById(id: number): Promise<UserModel> {
        const foundUser = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();

        if (!foundUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
        return foundUser;
    }

    async findUserByEmail(email: string): Promise<UserModel> {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect(['user.password'])
            .where('user.email = :email', { email })
            .getOneOrFail();
    }

    async updateById(
        id: number,
        updateUserDto: UpdateUserInput,
    ): Promise<UserModel> {
        if (updateUserDto.password) {
            updateUserDto.password =
                await this.hashService.convertToHashPassword(
                    updateUserDto.password,
                );
        }

        const updatedUser = await typeReturn<UserModel>(
            this.userRepository
                .createQueryBuilder()
                .update(UserModel)
                .set(updateUserDto)
                .where('id = :id', { id })
                .returning('*')
                .execute(),
        );
        if (!updatedUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
        return updatedUser;
    }

    async removeById(id: number): Promise<UserModel> {
        const removedUser = await typeReturn<UserModel>(
            this.userRepository
                .createQueryBuilder()
                .delete()
                .from(UserModel)
                .where('id = :id', { id })
                .returning('id')
                .execute(),
        );
        if (!removedUser) {
            throw new NotFoundException(`User with that id: ${id} not found`);
        }
        return removedUser;
    }

    async changeUserRole({
        userId,
        role,
    }: ChangeRoleInput): Promise<UserModel> {
        // const user = await this.findOneById(userId);

        const user = await typeReturn<UserModel>(
            this.userRepository
                .createQueryBuilder()
                .update(UserModel)
                .set({ role })
                .where('id = :userId', { userId })
                .returning('*')
                .execute(),
        );
        if (!user) {
            throw new NotFoundException(
                `User with that id: ${userId} not found`,
            );
        }
        return user;
    }
}
