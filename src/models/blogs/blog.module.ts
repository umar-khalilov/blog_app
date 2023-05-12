import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { UserModule } from '../users/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntity]), UserModule],
    controllers: [BlogController],
    providers: [BlogService],
    exports: [BlogService],
})
export class BlogModule {}
