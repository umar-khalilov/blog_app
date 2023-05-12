import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortOrder } from '../enums/sort-order.enum';

export class PageOptionsDto {
    @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
    @IsEnum(SortOrder)
    @IsOptional()
    readonly order?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    readonly page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Max(50)
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    readonly take: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
