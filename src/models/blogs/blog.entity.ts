import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Relation,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract/abstract.entity';
import { UserEntity } from '../users/user.entity';
import { PostEntity } from '../posts/post.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends AbstractEntity {
    @ApiProperty({ example: 'Sport meal', description: 'Name of blog' })
    @Column({ type: 'varchar', length: 300, unique: true, nullable: false })
    readonly name: string;

    @ApiProperty({ example: 'bla-bla-bla', description: 'Blog details' })
    @Column({ type: 'text', nullable: false })
    readonly description: string;

    @ManyToOne(() => UserEntity, ({ blogs }): BlogEntity[] => blogs)
    @JoinColumn({ name: 'author_id' })
    readonly author: Relation<UserEntity>;

    @OneToMany(() => PostEntity, ({ blog }): BlogEntity => blog, {
        eager: true,
        cascade: true,
    })
    readonly posts: Relation<PostEntity[]>;

    constructor(partialData: Partial<BlogEntity>) {
        super();
        Object.assign(this, partialData);
    }
}
