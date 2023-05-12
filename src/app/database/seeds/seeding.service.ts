import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '@/models/users/user.entity';
import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { HashService } from '@/hash/hash.service';

@Injectable()
export class SeedingService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly hashService: HashService,
    ) {
        this.logger = new Logger(SeedingService.name);
    }

    public async seed(): Promise<void> {
        const isModerator = await this.hasModerator();
        if (!isModerator) {
            const hashedPassword = await this.hashService.convertToHashPassword(
                'admin422I03Pfewq_3',
            );
            const moderator: CreateUserDto = {
                name: 'Moderator',
                surname: 'Adminovich',
                email: 'tzirw@example.com',
                password: hashedPassword,
            };
            await this.entityManager.save(UserEntity, {
                ...moderator,
                role: RoleTypes.MODERATOR,
            });
            this.logger.debug('Moderator successfuly seeded...');
        }
    }

    private async hasModerator(): Promise<boolean> {
        const user = await this.entityManager.findOneBy(UserEntity, {
            id: 1,
        });
        return user !== null;
    }
}
