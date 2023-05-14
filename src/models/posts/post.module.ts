import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './post.model';
import { PostService } from './post.service';
import { BlogModule } from '../blogs/blog.module';
import { PostResolver } from './post.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([PostModel]), BlogModule],
    providers: [PostService, PostResolver],
    exports: [PostService],
})
export class PostModule {}
