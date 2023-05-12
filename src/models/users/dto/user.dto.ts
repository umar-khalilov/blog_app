import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class UserDto {
    @ApiProperty({
        example: 1,
        description: 'Primary key',
        type: 'integer',
        format: 'int64',
        readOnly: true,
    })
    readonly id: number;

    @ApiProperty({
        example: 'Arnold',
        description: 'The name of user',
        required: true,
    })
    readonly name: string;

    @ApiProperty({
        example: 'Schwarzenegger',
        description: 'The surname of user',
        required: true,
    })
    readonly surname: string;

    @ApiProperty({
        example: 'arnold@gmail.com',
        description: 'The email of user',
        format: 'email',
        required: true,
    })
    readonly email: string;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Created at',
    })
    readonly createdAt: Date;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Updated at',
    })
    readonly updatedAt: Date;

    constructor(entity: UserEntity) {
        this.id = entity.id;
        this.name = entity.name;
        this.surname = entity.surname;
        this.email = entity.email;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
