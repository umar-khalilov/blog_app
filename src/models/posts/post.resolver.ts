import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogModel } from '../blogs/blog.model';
import { PostModel } from './post.model';
import { PostService } from './post.service';
import { CreatePostInput } from './inputs/create-post.input';
import { UpdatePostInput } from './inputs/update-post.dto';
import { PostParamArgs } from './inputs/post-param.dto';
import { BlogParamArgs } from '../blogs/inputs/blog-param.args';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Resolver(() => PostModel)
export class PostResolver {
    constructor(private readonly postService: PostService) {}

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => PostModel, { description: 'Create a post' })
    async createPostByIds(
        @Args()
        { userId, blogId }: BlogParamArgs,
        @Args('data') data: CreatePostInput,
    ): Promise<PostModel | void> {
        return this.postService.createOne(userId, blogId, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Query(() => BlogModel, { description: 'Find all posts by blog id' })
    async findAllPostsByBlogId(
        @Args()
        { userId, blogId }: BlogParamArgs,
    ): Promise<BlogModel> {
        return this.postService.findAllPostsByBlogId(userId, blogId);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Query(() => PostModel, { description: 'Find a post' })
    async findPostByIds(
        @Args()
        ids: PostParamArgs,
    ): Promise<PostModel> {
        return this.postService.findOneByIds(ids);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => PostModel, { description: 'Update a post' })
    async updatePostByIds(
        @Args()
        ids: PostParamArgs,
        @Args('data') data: UpdatePostInput,
    ): Promise<PostModel> {
        return this.postService.updateByIds(ids, data);
    }

    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @UseGuards(JwtAuthGuard)
    @Mutation(() => PostModel, { description: 'Remove a post' })
    async removePostByIds(
        @Args()
        ids: PostParamArgs,
    ): Promise<PostModel> {
        return this.postService.removeByIds(ids);
    }
}
