import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogModel } from './blog.model';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './inputs/create-blog.input';
import { UpdateBlogInput } from './inputs/update-blog.input';
import { BlogParamArgs } from './inputs/blog-param.args';
import { UserParamArgs } from '../users/inputs/user-param.args';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PaginatedBlogResponseOutput } from '@/models/blogs/inputs/paginated-blog-response.output';

@Resolver(() => BlogModel)
export class BlogResolver {
    public constructor(private readonly blogService: BlogService) {}

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Create a blog' })
    public async createBlogByUserId(
        @Args()
        { userId }: UserParamArgs,
        @Args('data') data: CreateBlogInput,
    ): Promise<BlogModel | void> {
        return this.blogService.createOne(userId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @UseGuards(JwtAuthGuard)
    @Query(() => PaginatedBlogResponseOutput, { description: 'Paginated data' })
    public async findAllBlogs(
        @Args() data: PageOptionsArgs,
    ): Promise<PaginatedBlogResponseOutput> {
        return this.blogService.findAll(data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Query(() => BlogModel, { description: 'Find a blog' })
    public async findBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
    ): Promise<BlogModel> {
        return this.blogService.findOneById(userId, blogId);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Update a blog' })
    public async updateBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
        @Args('data') data: UpdateBlogInput,
    ): Promise<BlogModel> {
        return this.blogService.updateById(userId, blogId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => BlogModel, { description: 'Remove blog' })
    public async removeBlogByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
    ): Promise<BlogModel> {
        return this.blogService.removeById(userId, blogId);
    }
}
