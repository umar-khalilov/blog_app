import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
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
import { BlogEntity } from './blog.entity';
import { ApiPaginatedResponse } from '@/common/decorators/paginate-response.decorator';
import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { BlogParamsDto } from './dto/blog-params.dto';

@ApiTags('Blogs')
@ApiBearerAuth()
@Controller('/users/:userId/blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @ApiOperation({ summary: 'Create a blog' })
    @ApiNotFoundResponse({ description: 'User with that id not found' })
    @ApiConflictResponse({ description: 'Blog with that name already exist' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Post('/')
    async createOne(
        @Param(
            'userId',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        userId: number,
        @Body() data: CreateBlogDto,
    ): Promise<BlogEntity | void> {
        return this.blogService.createOne(userId, data);
    }

    @ApiOperation({ summary: 'Find all blogs' })
    @ApiPaginatedResponse(BlogEntity)
    @ApiNotFoundResponse({ description: 'Not found blogs in database' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @Get('/')
    async findAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<BlogEntity>> {
        return this.blogService.findAll(pageOptionsDto);
    }

    @ApiOperation({ summary: 'Get a blog' })
    @ApiOkResponse({ type: BlogEntity })
    @ApiNotFoundResponse({ description: 'Blog or user with that id not found' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Get('/:blogId')
    async findOne(
        @Param()
        { userId, blogId }: BlogParamsDto,
    ): Promise<BlogEntity> {
        return this.blogService.findOneById(userId, blogId);
    }

    @ApiOperation({ summary: 'Update a blog' })
    @ApiAcceptedResponse({ type: BlogEntity })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @ApiNotFoundResponse({ description: 'Blog or user with that id not found' })
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Patch('/:blogId')
    async updateOne(
        @Param()
        { userId, blogId }: BlogParamsDto,
        @Body() updateBlogDto: UpdateBlogDto,
    ): Promise<BlogEntity> {
        return this.blogService.updateById(userId, blogId, updateBlogDto);
    }

    @ApiOperation({ summary: 'Delete a blog' })
    @ApiNoContentResponse({
        description: 'Only status code',
    })
    @ApiNotFoundResponse({ description: 'User or blog with that id not found' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Delete('/:blogId')
    async removeOne(
        @Param()
        { userId, blogId }: BlogParamsDto,
    ): Promise<void> {
        await this.blogService.removeById(userId, blogId);
    }
}
