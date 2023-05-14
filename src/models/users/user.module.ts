import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { HashModule } from '@/hash/hash.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserModel]), HashModule],
    providers: [UserService, UserResolver],
    exports: [UserService],
})
export class UserModule {}
