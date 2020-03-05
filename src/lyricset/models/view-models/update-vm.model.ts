import { BaseModelVm } from "src/shared/base.model";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class LyricsetUpdateVm{
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
    @ApiModelProperty()
    tracklist: string[];
}