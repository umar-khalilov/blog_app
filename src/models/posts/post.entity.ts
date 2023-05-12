import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract/abstract.entity';
import { BlogEntity } from '../blogs/blog.entity';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
    @ApiProperty({ example: 'Java vs JavaScript', description: 'Title' })
    @Column({
        type: 'varchar',
        length: 450,
        unique: true,
        nullable: false,
    })
    readonly title: string;

    @ApiProperty({ example: 'bla-bla-bla', description: 'Content' })
    @Column({ type: 'text', nullable: false })
    readonly content: string;

    @ApiProperty({
        example: false,
        description: 'Archived or not',
    })
    @Column({ type: 'boolean', nullable: false })
    readonly isArchived: boolean;

    @ManyToOne(() => BlogEntity, ({ posts }): PostEntity[] => posts)
    @JoinColumn({ name: 'blog_id' })
    readonly blog: Relation<BlogEntity>;

    constructor(partialData: Partial<PostEntity>) {
        super();
        Object.assign(this, partialData);
    }
}
