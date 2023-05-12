import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashModule } from '@/hash/hash.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), HashModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
