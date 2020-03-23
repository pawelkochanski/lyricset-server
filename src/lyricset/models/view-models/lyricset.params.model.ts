import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { IsBoolean, IsBooleanString, IsString } from 'class-validator';

export class LyricSetParams{
    @IsString()
    @ApiModelProperty()
    name:string;
    @IsBooleanString()
    @ApiModelProperty()
    isPrivate: string;
}
