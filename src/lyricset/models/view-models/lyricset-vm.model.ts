import { BaseModelVm } from "../../../shared/base.model";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Track } from '../../../track/models/track.model';


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
    isPrivate: boolean;
    @ApiModelProperty()
    rating: number;
    @ApiModelProperty()
    ownerId: string;

}
