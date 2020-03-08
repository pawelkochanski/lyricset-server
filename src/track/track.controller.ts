import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TrackService } from './track.service';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { Track } from './models/track.model';
import { TracklistTrackVm } from './models/viev-models/tracklist-track-vm';
import { TracklistVm } from './models/viev-models/tracklist-vm';
import { Observable } from 'rxjs';

@ApiBearerAuth()
@ApiTags(Track.modelName)
@Controller('track')
export class TrackController {
  constructor(private readonly _trackService: TrackService) {
  }

  @Get('search')
  @ApiOkResponse({type : TracklistVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'Search'))
  searchTrack(@Query('track') track: string) : Observable<TracklistVm>{
    return this._trackService.apiSearchByTitle(track);
  }

}
