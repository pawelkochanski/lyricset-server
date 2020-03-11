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
import { TracklistVm } from './models/viev-models/tracklist-vm';
import { Observable } from 'rxjs';

@ApiBearerAuth()
@ApiTags(Track.modelName)
@Controller('track')
export class TrackController {
  constructor(private readonly _trackService: TrackService) {
  }

  @Get('search/title')
  @ApiOkResponse({type : TracklistVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'Search'))
  searchTrackByTitle(
    @Query('track') track: string,
    @Query('page_size') page_size: string,
    @Query('page') page: string) : Observable<TracklistVm>{
    return this._trackService.apiSearchByTitle(track, page_size, page);
  }

  @Get('search/artist')
  @ApiOkResponse({type : TracklistVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'Search'))
  searchTrackByArtist(
    @Query('track') track: string,
    @Query('page_size') page_size: string,
    @Query('page') page: string) : Observable<TracklistVm>{
    return this._trackService.apiSearchByArtist(track, page_size, page);
  }

}
