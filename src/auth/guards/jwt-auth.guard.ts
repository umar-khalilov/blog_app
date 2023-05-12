import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const [bearer, token] = request.headers.authorization.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException('User is not authorized');
            }
            const user = await this.jwtService.verifyAsync(token);
            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('User is not authorized');
        }
    }
}
