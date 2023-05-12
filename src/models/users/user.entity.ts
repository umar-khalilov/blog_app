import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { AbstractEntity } from '../abstract/abstract.entity';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { BlogEntity } from '../blogs/blog.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 450, nullable: false })
    readonly name: string;

    @Column({ type: 'varchar', length: 450, nullable: false })
    readonly surname: string;

    @Column({ type: 'varchar', unique: true, length: 350, nullable: false })
    readonly email: string;

    @Column({
        type: 'enum',
        enum: RoleTypes,
        nullable: false,
    })
    readonly role: RoleTypes;

    @Column({
        type: 'text',
        name: 'password_hash',
        select: false,
        nullable: false,
    })
    readonly password: string;

    @OneToMany(() => BlogEntity, ({ author }): UserEntity => author, {
        eager: true,
        cascade: true,
    })
    readonly blogs: Relation<BlogEntity[]>;

    constructor(partialData: Partial<UserEntity>) {
        super();
        Object.assign(this, partialData);
    }
}
