import { Field, ObjectType } from '@nestjs/graphql';
import { TokensOutput } from './tokens.output';
import { UserOutput } from '@/models/users/inputs/user.output';

@ObjectType()
export class UserAuthOutput {
    @Field(() => UserOutput, {
        description: 'User fields',
    })
    readonly user: UserOutput;

    @Field(() => TokensOutput, { description: 'Generated tokens' })
    readonly tokens: TokensOutput;
}
