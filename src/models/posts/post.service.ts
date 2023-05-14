import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './post.model';
import { BlogModel } from '../blogs/blog.model';
import { BlogService } from '../blogs/blog.service';
import { CreatePostInput } from './inputs/create-post.input';
import { PostgresErrorCode } from '@/app/database/constraints/errors.constraint';
import { typeReturn } from '@/common/utils/helpers.util';
import { UpdatePostInput } from './inputs/update-post.dto';
import { PostParamArgs } from './inputs/post-param.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
        private readonly blogService: BlogService,
    ) {}

    async createOne(
        userId: number,
        blogId: number,
        data: CreatePostInput,
    ): Promise<PostModel | void> {
        const blog = await this.blogService.findOneById(userId, blogId);
        return typeReturn<PostModel>(
            this.postRepository
                .createQueryBuilder()
                .insert()
                .into(PostModel)
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
    ): Promise<BlogModel> {
        return this.blogService.findAllPostsByBlogId(userId, blogId);
    }

    async findOneByIds(ids: PostParamArgs): Promise<PostModel> {
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

    async updateByIds(
        ids: PostParamArgs,
        data: UpdatePostInput,
    ): Promise<PostModel> {
        const { userId, blogId, postId } = ids;
        const blog = await this.blogService.findOneById(userId, blogId);
        const updatedPost = await typeReturn<PostModel>(
            this.postRepository
                .createQueryBuilder()
                .update(PostModel)
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

    async removeByIds(ids: PostParamArgs): Promise<PostModel> {
        const { userId, blogId, postId } = ids;
        const blog = await this.blogService.findOneById(userId, blogId);
        const removedPost = await typeReturn<PostModel>(
            this.postRepository
                .createQueryBuilder()
                .delete()
                .from(PostModel)
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
        return removedPost;
    }
}
