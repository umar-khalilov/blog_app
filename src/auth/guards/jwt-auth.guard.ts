import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        try {
            const [bearer, token] = ctx.req.headers.authorization.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException('User is not authorized');
            }
            ctx.req.user = await this.jwtService.verifyAsync(token);
            return true;
        } catch (error) {
            throw new UnauthorizedException('User is not authorized');
        }
    }
}
