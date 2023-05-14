import { Field, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Relation,
} from 'typeorm';
import { AbstractModel } from '../abstract/abstract.model';
import { UserModel } from '../users/user.model';
import { PostModel } from '../posts/post.model';

@ObjectType({ description: 'Blog model' })
@Entity({ name: 'blogs' })
export class BlogModel extends AbstractModel {
    @Field({ nullable: false, description: 'Blog name' })
    @Column({ type: 'varchar', length: 300, unique: true, nullable: false })
    readonly name: string;

    @Field({ nullable: false, description: 'Blog details' })
    @Column({ type: 'text', nullable: false })
    readonly description: string;

    @Field(() => UserModel, { nullable: true })
    @ManyToOne(() => UserModel, ({ blogs }): BlogModel[] => blogs)
    @JoinColumn({ name: 'author_id' })
    readonly author: Relation<UserModel>;

    @Field(() => [PostModel], { nullable: true })
    @OneToMany(() => PostModel, ({ blog }): BlogModel => blog, {
        eager: true,
        cascade: true,
    })
    readonly posts: Relation<PostModel[]>;

    constructor(partialData: Partial<BlogModel>) {
        super();
        Object.assign(this, partialData);
    }
}
