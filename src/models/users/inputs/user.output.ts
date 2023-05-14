import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../user.model';

@ObjectType()
export class UserOutput {
    @Field(() => Int, { nullable: false, description: 'Primary key' })
    readonly id: number;

    @Field({ nullable: false, description: 'User name' })
    readonly name: string;

    @Field({ nullable: false, description: 'User surname' })
    readonly surname: string;

    @Field({ nullable: false, description: 'User email' })
    readonly email: string;

    @Field({ nullable: true, description: 'Created at' })
    readonly createdAt: Date;

    @Field({ nullable: true, description: 'Updated at' })
    readonly updatedAt: Date;

    constructor(entity: UserModel) {
        this.id = entity.id;
        this.name = entity.name;
        this.surname = entity.surname;
        this.email = entity.email;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
