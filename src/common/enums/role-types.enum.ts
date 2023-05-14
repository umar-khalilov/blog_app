import { registerEnumType } from '@nestjs/graphql';

export enum RoleTypes {
    WRITER = 'writer',
    MODERATOR = 'moderator',
}

registerEnumType(RoleTypes, {
    name: 'RoleTypes',
    description: 'Supported roles',
});
