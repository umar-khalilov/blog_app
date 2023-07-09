import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleTypes } from '@/common/enums/role-types.enum';

export const RolesGuard = (...roles: RoleTypes[]): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        public canActivate(context: ExecutionContext): boolean {
            const gqlCtx = GqlExecutionContext.create(context);
            const ctx = gqlCtx.getContext();
            const user = ctx.req?.user;
            return roles.includes(user.role);
        }
    }
    return mixin(RoleGuardMixin);
};
