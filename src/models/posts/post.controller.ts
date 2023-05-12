import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiAcceptedResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostParamsDto } from './dto/post-params.dto';
import { BlogParamsDto } from '../blogs/dto/blog-params.dto';
import { BlogEntity } from '../blogs/blog.entity';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('/users/:userId/blogs/:blogId/posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @ApiOperation({ summary: 'Create a post' })
    @ApiNotFoundResponse({ description: 'User or blog with that id not found' })
    @ApiConflictResponse({ description: 'Post with that name already exist' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Post('/')
    async createOne(
        @Param()
        { userId, blogId }: BlogParamsDto,
        @Body() data: CreatePostDto,
    ): Promise<PostEntity | void> {
        return this.postService.createOne(userId, blogId, data);
    }

    @ApiOperation({ summary: 'Get all posts by blog id' })
    @ApiNotFoundResponse({ description: 'User or blog with that id not found' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Get('/')
    async findAllPostsByBlogId(
        @Param()
        { userId, blogId }: BlogParamsDto,
    ): Promise<BlogEntity> {
        return this.postService.findAllPostsByBlogId(userId, blogId);
    }

    @ApiOperation({ summary: 'Get a post' })
    @ApiOkResponse({ type: PostEntity })
    @ApiNotFoundResponse({
        description: 'User, blog or post with that id not found',
    })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Get('/:postId')
    async findOne(
        @Param()
        ids: PostParamsDto,
    ): Promise<PostEntity> {
        return this.postService.findOneById(ids);
    }

    @ApiOperation({ summary: 'Update a post' })
    @ApiAcceptedResponse({ type: PostEntity })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @ApiNotFoundResponse({
        description: 'User, blog or post with that id not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Patch('/:postId')
    async updateOne(
        @Param()
        ids: PostParamsDto,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postService.updateById(ids, updatePostDto);
    }

    @ApiOperation({ summary: 'Delete a post' })
    @ApiNoContentResponse({
        description: 'Only status code',
    })
    @ApiNotFoundResponse({
        description: 'User, blog or post with that id not found',
    })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Delete('/:postId')
    async removeOne(
        @Param()
        ids: PostParamsDto,
    ): Promise<void> {
        await this.postService.removeById(ids);
    }
}
