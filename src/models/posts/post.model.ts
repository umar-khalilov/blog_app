import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { AbstractModel } from '../abstract/abstract.model';
import { BlogModel } from '../blogs/blog.model';

@ObjectType({ description: 'Post model' })
@Entity({ name: 'posts' })
export class PostModel extends AbstractModel {
    @Field({ nullable: false, description: 'Post title' })
    @Column({
        type: 'varchar',
        length: 450,
        unique: true,
        nullable: false,
    })
    readonly title: string;

    @Field({ nullable: false, description: 'Content' })
    @Column({ type: 'text', nullable: false })
    readonly content: string;

    @Field({ nullable: false, description: 'Archived or not' })
    @Column({ type: 'boolean', nullable: false })
    readonly isArchived: boolean;

    @Field(() => BlogModel, { nullable: true })
    @ManyToOne(() => BlogModel, ({ posts }): PostModel[] => posts)
    @JoinColumn({ name: 'blog_id' })
    readonly blog: Relation<BlogModel>;

    constructor(partialData: Partial<PostModel>) {
        super();
        Object.assign(this, partialData);
    }
}
