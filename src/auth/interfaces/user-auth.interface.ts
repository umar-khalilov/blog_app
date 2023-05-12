import { UserEntity } from '@/models/users/user.entity';

export interface IUserAuth {
    readonly user: Partial<UserEntity>;
    readonly tokens: {
        readonly access: string;
        readonly refresh?: string;
    };
}
