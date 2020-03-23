import { BaseModelVm } from "src/shared/base.model";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Track } from '../../../track/models/track.model';
import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LyricsetVm extends BaseModelVm{
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
    @ApiModelProperty()
    imageId: string;
    @ApiModelProperty()
    tracklist: Track[];
    @ApiModelProperty()
    isPrivate: boolean
}
