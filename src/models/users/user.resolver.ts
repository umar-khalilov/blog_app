import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { UpdateUserInput } from './inputs/update-user.input';
import { ChangeRoleInput } from './inputs/change-role.input';
import { UserParamArgs } from './inputs/user-param.args';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PaginationOutput } from '@/common/outputs/pagination.output';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';

@Resolver(() => UserModel)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Query(() => PaginationOutput<UserModel>, { description: 'Paginated data' })
    async findAllUsers(
        @Args() data: PageOptionsArgs,
    ): Promise<PaginationOutput<UserModel>> {
        return this.userService.findAll(data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Query(() => [UserModel], { description: 'Users' })
    async findAllUsersWithoutPagination(): Promise<UserModel[]> {
        return this.userService.findAllWithoutPagination();
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Change user role' })
    async changeRole(@Args('data') data: ChangeRoleInput): Promise<UserModel> {
        return this.userService.changeUserRole(data);
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => UserModel, { description: 'Get a user' })
    async findUser(
        @Args()
        { userId }: UserParamArgs,
    ): Promise<UserModel> {
        return this.userService.findOneById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Update a user' })
    async updateUserById(
        @Args() { userId }: UserParamArgs,
        @Args('data') data: UpdateUserInput,
    ): Promise<UserModel> {
        return this.userService.updateById(userId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Remove user' })
    async removeUserById(
        @Args()
        { userId }: UserParamArgs,
    ): Promise<UserModel> {
        return this.userService.removeById(userId);
    }
}
