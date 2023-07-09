import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '@/common/outputs/pagination.output';
import { BlogModel } from '@/models/blogs/blog.model';

@ObjectType()
export class PaginatedBlogResponseOutput extends PaginationResponse<BlogModel>(
    BlogModel,
) {}
