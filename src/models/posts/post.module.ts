import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { BlogModule } from '../blogs/blog.module';
import { PostController } from './post.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), BlogModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
