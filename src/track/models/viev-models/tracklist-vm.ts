import { TracklistTrackVm } from './tracklist-track-vm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class TracklistVm{
  @ApiModelProperty()
  track_list: TracklistTrackVm[]
}
