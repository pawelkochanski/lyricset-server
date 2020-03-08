import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class TracklistTrackVm{
  @ApiModelProperty()
  artist_name: string;
  @ApiModelProperty()
  track_name: string;
  @ApiModelProperty()
  track_id: string;

}
