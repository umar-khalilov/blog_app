import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensOutput {
    @Field({ nullable: false, description: 'Access token' })
    readonly access: string;

    @Field({ nullable: true, description: 'Refresh token' })
    readonly refresh?: string;
}
