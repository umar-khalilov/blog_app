import { PageOptionsDto } from '../dto/page-options.dto';

export interface IPageMetaParams {
    readonly pageOptionsDto: PageOptionsDto;
    readonly itemCount: number;
}
