import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { AbstractModel } from '../abstract/abstract.model';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { BlogModel } from '../blogs/blog.model';

@ObjectType({ description: 'User model' })
@Entity({ name: 'users' })
export class UserModel extends AbstractModel {
    @Field({ nullable: false, description: 'User name' })
    @Column({ type: 'varchar', length: 450, nullable: false })
    readonly name: string;

    @Field({ nullable: false, description: 'User surname' })
    @Column({ type: 'varchar', length: 450, nullable: false })
    readonly surname: string;

    @Field({ nullable: false, description: 'User email' })
    @Column({ type: 'varchar', unique: true, length: 350, nullable: false })
    readonly email: string;

    @Field(() => RoleTypes, { nullable: false, description: 'User role' })
    @Column({
        type: 'enum',
        enum: RoleTypes,
        nullable: false,
    })
    readonly role: RoleTypes;

    @Field({ nullable: false, description: 'User password' })
    @Column({
        type: 'text',
        name: 'password_hash',
        select: false,
        nullable: false,
    })
    readonly password: string;

    @Field(() => [BlogModel], { nullable: true, description: 'User blogs' })
    @OneToMany(() => BlogModel, ({ author }): UserModel => author, {
        eager: true,
        cascade: true,
    })
    readonly blogs: Relation<BlogModel[]>;

    constructor(partialData: Partial<UserModel>) {
        super();
        Object.assign(this, partialData);
    }
}
