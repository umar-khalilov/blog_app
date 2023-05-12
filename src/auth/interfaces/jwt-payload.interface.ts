import { RoleTypes } from '@/common/enums/role-types.enum';

export interface IJwtPayload {
    readonly sub: number;
    readonly email: string;
    readonly role: RoleTypes;
}
