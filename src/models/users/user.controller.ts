import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiAcceptedResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPaginatedResponse } from '@/common/decorators/paginate-response.decorator';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserParamDto } from './dto/user-param.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Find all users' })
    @ApiPaginatedResponse(UserDto)
    @ApiNotFoundResponse({ description: 'Not found users in database' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @Get('/')
    async findAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PaginationDto<UserDto>> {
        return this.userService.findAll(pageOptionsDto);
    }

    @ApiOperation({ summary: 'Change role to user' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @UseGuards(RolesGuard(RoleTypes.MODERATOR))
    @Patch('/change-role')
    async addRole(@Body() dto: ChangeRoleDto): Promise<string> {
        return this.userService.changeUserRole(dto);
    }

    @ApiOperation({ summary: 'Get a user' })
    @ApiOkResponse({ type: UserDto })
    @ApiNotFoundResponse({ description: 'User with that id not found' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @UseGuards(JwtAuthGuard)
    @Get('/:userId')
    async findOne(
        @Param()
        { userId }: UserParamDto,
    ): Promise<UserDto | undefined> {
        return this.userService.findOneById(userId);
    }

    @ApiOperation({ summary: 'Update a user' })
    @ApiAcceptedResponse({ type: UserDto })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @ApiNotFoundResponse({ description: 'User with that id not found' })
    @HttpCode(HttpStatus.ACCEPTED)
    @UseGuards(JwtAuthGuard)
    @Patch('/:userId')
    async update(
        @Param()
        { userId }: UserParamDto,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserDto> {
        return this.userService.updateById(userId, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiNoContentResponse({
        description: 'Only status code',
    })
    @ApiNotFoundResponse({ description: 'User with that id not found' })
    @ApiForbiddenResponse({ description: 'Forbidden resource' })
    @ApiUnauthorizedResponse({ description: 'User is not authorized' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard(RoleTypes.MODERATOR, RoleTypes.WRITER))
    @Delete('/:userId')
    async removeOne(
        @Param()
        { userId }: UserParamDto,
    ): Promise<void> {
        await this.userService.removeById(userId);
    }
}
