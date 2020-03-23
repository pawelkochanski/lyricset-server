import { BaseModelVm } from '../../../shared/base.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Member } from '../member.model';
import { WallPost } from '../wall-post.model';
import { prop } from 'typegoose';
import { Track } from '../../../track/models/track.model';

export class BandVm extends BaseModelVm{
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  imageId: string;

  @ApiModelProperty()
  tracklist: Track[];

  @ApiModelProperty()
  members: Member[];
}
