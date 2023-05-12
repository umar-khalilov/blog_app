import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { UserService } from '../users/user.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PostgresErrorCode } from '@/app/database/constraints/errors.constraint';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { typeReturn } from '@/common/utils/helpers.util';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogRepository: Repository<BlogEntity>,
        private readonly userService: UserService,
    ) {}

    async createOne(
        userId: number,
        data: CreateBlogDto,
    ): Promise<BlogEntity | void> {
        const author = await this.userService.findOneById(userId);
        return typeReturn<BlogEntity>(
            this.blogRepository
                .createQueryBuilder()
                .insert()
                .into(BlogEntity)
                .values({ ...data, author })
                .returning('*')
                .execute(),
        ).catch(error => {
            if ((error.code = PostgresErrorCode.UniqueViolation)) {
                throw new ConflictException(
                    `Blog with that name: ${data.name} already exist`,
                );
            }
        });
    }

    async findOneById(userId: number, blogId: number): Promise<BlogEntity> {
        await this.userService.findOneById(userId);
        const foundBlog = await this.blogRepository
            .createQueryBuilder()
            .where('id = :blogId', { blogId })
            .getOne();

        if (!foundBlog) {
            throw new NotFoundException(
                `Blog with that id: ${blogId} not found`,
            );
        }
        return foundBlog;
    }

    async findAllPostsByBlogId(
        userId: number,
        blogId: number,
    ): Promise<BlogEntity> {
        await this.userService.findOneById(userId);
        const foundBlog = await this.blogRepository
            .createQueryBuilder('blog')
            .leftJoinAndSelect('blog.posts', 'posts')
            .where('blog.id = :blogId', { blogId })
            .getOne();

        if (!foundBlog) {
            throw new NotFoundException(
                `Blog with that id: ${blogId} not found`,
            );
        }
        return foundBlog;
    }

    async findAll(
        pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<BlogEntity>> {
        const { take, skip, order } = pageOptionsDto;

        const [blogs, itemCount] = await this.blogRepository
            .createQueryBuilder('blog')
            .orderBy('blog.id', order)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found blogs in database');
        }
        const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
        return new PaginationDto<BlogEntity>(blogs, pageMetaDto);
    }

    async updateById(
        userId: number,
        blogId: number,
        data: UpdateBlogDto,
    ): Promise<BlogEntity> {
        const { id: authorId } = await this.userService.findOneById(userId);
        const updatedBlog = await typeReturn<BlogEntity>(
            this.blogRepository
                .createQueryBuilder()
                .update(BlogEntity)
                .set(data)
                .where('id = :blogId AND author_id = :authorId', {
                    blogId,
                    authorId,
                })
                .returning('*')
                .execute(),
        );
        if (!updatedBlog) {
            throw new NotFoundException(
                `Blog with that id: ${blogId} not found`,
            );
        }
        return updatedBlog;
    }

    async removeById(userId: number, blogId: number): Promise<void> {
        const { id: authorId } = await this.userService.findOneById(userId);
        const removedBlog = await typeReturn<BlogEntity>(
            this.blogRepository
                .createQueryBuilder()
                .delete()
                .from(BlogEntity)
                .where('id = :blogId AND author_id = :authorId', {
                    blogId,
                    authorId,
                })
                .returning('id')
                .execute(),
        );
        if (!removedBlog) {
            throw new NotFoundException(
                `Blog with that id: ${blogId} not found`,
            );
        }
    }
}
