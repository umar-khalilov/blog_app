import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '@/common/outputs/pagination.output';
import { UserModel } from '@/models/users/user.model';

@ObjectType()
export class PaginatedUserResponseOutput extends PaginationResponse<UserModel>(
    UserModel,
) {}
