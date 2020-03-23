
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsArray, IsBoolean, IsBooleanString, IsInstance, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Track } from '../../../track/models/track.model';


export class LyricsetUpdateVm {
  @ApiModelProperty()
  @IsString()
  name: string;
  @ApiModelProperty()
  @IsString()
  description: string;
  @ApiModelProperty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Track)
  tracklist: Track[];
  @IsString()
  isPrivate: string;
}
