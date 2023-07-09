import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserAuthOutput } from './inputs/user-auth.output';
import { SignInInput } from './inputs/sign-in.input';
import { CreateUserInput } from '@/models/users/inputs/create-user.input';

@Resolver(() => UserAuthOutput)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => UserAuthOutput, { description: 'Get user with tokens' })
    public async signUp(
        @Args('data') data: CreateUserInput,
    ): Promise<UserAuthOutput> {
        return this.authService.signUp(data);
    }

    @Query(() => UserAuthOutput, { description: 'Get user with tokens' })
    public async signIn(
        @Args('data') data: SignInInput,
    ): Promise<UserAuthOutput> {
        return this.authService.signIn(data);
    }
}
