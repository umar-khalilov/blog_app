import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogModel } from './blog.model';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UpdateBlogInput } from './inputs/update-blog.dto';
import { BlogParamArgs } from './inputs/blog-param.args';
import { UserParamArgs } from '../users/inputs/user-param.args';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { PaginationOutput } from '@/common/outputs/pagination.output';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Resolver(() => BlogModel)
export class BlogResolver {
    constructor(private readonly blogService: BlogService) {}

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Create a blog' })
    async createBlogByUserId(
        @Args()
        { userId }: UserParamArgs,
        @Args('data') data: CreateBlogInput,
    ): Promise<BlogModel | void> {
        return this.blogService.createOne(userId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Query(() => PaginationOutput<BlogModel>, { description: 'Paginated data' })
    async findAllBlogs(
        @Args() data: PageOptionsArgs,
    ): Promise<PaginationOutput<BlogModel>> {
        return this.blogService.findAll(data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Query(() => BlogModel, { description: 'Find a blog' })
    async findBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
    ): Promise<BlogModel> {
        return this.blogService.findOneById(userId, blogId);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Update a blog' })
    async updateBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
        @Args('data') data: UpdateBlogInput,
    ): Promise<BlogModel> {
        return this.blogService.updateById(userId, blogId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Remove blog' })
    async removeBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
    ): Promise<BlogModel> {
        return this.blogService.removeById(userId, blogId);
    }
}
