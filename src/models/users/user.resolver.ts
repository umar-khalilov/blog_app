import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { UpdateUserInput } from './inputs/update-user.input';
import { ChangeRoleInput } from './inputs/change-role.input';
import { UserParamArgs } from './inputs/user-param.args';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';
import { PaginatedUserResponseOutput } from '@/models/users/inputs/paginated-user-response.output';

@Resolver(() => UserModel)
export class UserResolver {
    public constructor(private readonly userService: UserService) {}

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Query(() => PaginatedUserResponseOutput, { description: 'Paginated data' })
    public async findAllUsers(
        @Args() data: PageOptionsArgs,
    ): Promise<PaginatedUserResponseOutput> {
        return this.userService.findAll(data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Change user role' })
    public async changeRole(
        @Args('data') data: ChangeRoleInput,
    ): Promise<UserModel> {
        return this.userService.changeUserRole(data);
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => UserModel, { description: 'Get a user' })
    public async findUser(
        @Args()
        { userId }: UserParamArgs,
    ): Promise<UserModel> {
        return this.userService.findOneById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Update a user' })
    public async updateUserById(
        @Args() { userId }: UserParamArgs,
        @Args('data') data: UpdateUserInput,
    ): Promise<UserModel> {
        return this.userService.updateById(userId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => UserModel, { description: 'Remove user' })
    public async removeUserById(
        @Args()
        { userId }: UserParamArgs,
    ): Promise<UserModel> {
        return this.userService.removeById(userId);
    }
}
