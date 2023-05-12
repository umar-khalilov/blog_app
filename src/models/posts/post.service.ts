import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogService } from '../blogs/blog.service';
import { PostgresErrorCode } from '@/app/database/constraints/errors.constraint';
import { typeReturn } from '@/common/utils/helpers.util';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostParamsDto } from './dto/post-params.dto';
import { BlogEntity } from '../blogs/blog.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        private readonly blogService: BlogService,
    ) {}

    async createOne(
        userId: number,
        blogId: number,
        data: CreatePostDto,
    ): Promise<PostEntity | void> {
        const blog = await this.blogService.findOneById(userId, blogId);
        return typeReturn<PostEntity>(
            this.postRepository
                .createQueryBuilder()
                .insert()
                .into(PostEntity)
                .values({ ...data, blog })
                .returning('*')
                .execute(),
        ).catch(error => {
            if ((error.code = PostgresErrorCode.UniqueViolation)) {
                throw new ConflictException(
                    `Post with that title: ${data.title} already exist`,
                );
            }
        });
    }

    async findAllPostsByBlogId(
        userId: number,
        blogId: number,
    ): Promise<BlogEntity> {
        return this.blogService.findAllPostsByBlogId(userId, blogId);
    }

    async findOneById(ids: PostParamsDto): Promise<PostEntity> {
        const { userId, blogId, postId } = ids;
        await this.blogService.findOneById(userId, blogId);
        const foundPost = await this.postRepository
            .createQueryBuilder()
            .where('id = :postId', { postId })
            .getOne();

        if (!foundPost) {
            throw new NotFoundException(
                `Post with that id: ${postId} not found`,
            );
        }
        return foundPost;
    }

    async updateById(
        ids: PostParamsDto,
        data: UpdatePostDto,
    ): Promise<PostEntity> {
        const { userId, blogId, postId } = ids;
        const blog = await this.blogService.findOneById(userId, blogId);
        const updatedPost = await typeReturn<PostEntity>(
            this.postRepository
                .createQueryBuilder()
                .update(PostEntity)
                .set(data)
                .where('id = :postId AND blog_id = :blogId', {
                    postId,
                    blogId: blog.id,
                })
                .returning('*')
                .execute(),
        );
        if (!updatedPost) {
            throw new NotFoundException(
                `Post with that id: ${postId} not found`,
            );
        }
        return updatedPost;
    }

    async removeById(ids: PostParamsDto): Promise<void> {
        const { userId, blogId, postId } = ids;
        const blog = await this.blogService.findOneById(userId, blogId);
        const removedPost = await typeReturn<PostEntity>(
            this.postRepository
                .createQueryBuilder()
                .delete()
                .from(PostEntity)
                .where('id = :postId AND blog_id = :blogId', {
                    postId,
                    blogId: blog.id,
                })
                .returning('id')
                .execute(),
        );
        if (!removedPost) {
            throw new NotFoundException(
                `Post with that id: ${postId} not found`,
            );
        }
    }
}
