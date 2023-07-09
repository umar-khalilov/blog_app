import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogModel } from './blog.model';
import { UserService } from '../users/user.service';
import { CreateBlogInput } from './inputs/create-blog.input';
import { PostgresErrorCode } from '@/app/database/constraints/errors.constraint';
import { UpdateBlogInput } from './inputs/update-blog.input';
import { PageOptionsArgs } from '@/common/outputs/page-options.args';
import { PageMetaOutput } from '@/common/outputs/page-meta.output';
import { typeReturn } from '@/common/utils/helpers.util';
import { PaginatedBlogResponseOutput } from '@/models/blogs/inputs/paginated-blog-response.output';

@Injectable()
export class BlogService {
    public constructor(
        @InjectRepository(BlogModel)
        private readonly blogRepository: Repository<BlogModel>,
        private readonly userService: UserService,
    ) {}

    public async createOne(
        userId: number,
        data: CreateBlogInput,
    ): Promise<BlogModel | void> {
        const author = await this.userService.findOneById(userId);
        return typeReturn<BlogModel>(
            this.blogRepository
                .createQueryBuilder()
                .insert()
                .into(BlogModel)
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

    public async findOneById(
        userId: number,
        blogId: number,
    ): Promise<BlogModel> {
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

    public async findAllPostsByBlogId(
        userId: number,
        blogId: number,
    ): Promise<BlogModel> {
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

    public async findAll(
        pageOptionsArgs: PageOptionsArgs,
    ): Promise<PaginatedBlogResponseOutput> {
        const { take, skip, order } = pageOptionsArgs;

        const [blogs, itemCount] = await this.blogRepository
            .createQueryBuilder('blog')
            .orderBy('blog.id', order)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        if (itemCount === 0) {
            throw new NotFoundException('Not found blogs in database');
        }
        const pageMetaOptions = new PageMetaOutput({
            pageOptionsArgs,
            itemCount,
        });
        return new PaginatedBlogResponseOutput(blogs, pageMetaOptions);
    }

    public async updateById(
        userId: number,
        blogId: number,
        data: UpdateBlogInput,
    ): Promise<BlogModel> {
        const { id: authorId } = await this.userService.findOneById(userId);
        const updatedBlog = await typeReturn<BlogModel>(
            this.blogRepository
                .createQueryBuilder()
                .update(BlogModel)
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

    public async removeById(
        userId: number,
        blogId: number,
    ): Promise<BlogModel> {
        const { id: authorId } = await this.userService.findOneById(userId);
        const removedBlog = await typeReturn<BlogModel>(
            this.blogRepository
                .createQueryBuilder()
                .delete()
                .from(BlogModel)
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
        return removedBlog;
    }
}
