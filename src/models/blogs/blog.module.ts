import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModel } from './blog.model';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { UserModule } from '../users/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([BlogModel]), UserModule],
    providers: [BlogService, BlogResolver],
    exports: [BlogService],
})
export class BlogModule {}
