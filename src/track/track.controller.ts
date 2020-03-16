import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
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
import { Observable } from 'rxjs';
import { ApiInterceptor } from '../shared/interceptors/api.interceptor';
import { TrackInterceptor } from '../shared/interceptors/track.interceptor';

@ApiBearerAuth()
@ApiTags(Track.modelName)
@Controller('track')
export class TrackController {
  constructor(private readonly _trackService: TrackService) {
  }
  @UseInterceptors(new TrackInterceptor(),new ApiInterceptor())
  @Get('search/title')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'SearchByTitle'))
  searchTrackByTitle(
    @Query('track') track: string,
    @Query('page_size') page_size: string,
    @Query('page') page: string) : Observable<any>{
    return this._trackService.apiSearchByTitle(track, page_size, page);
  }

  @UseInterceptors(new TrackInterceptor(),new ApiInterceptor())
  @Get('search/artist')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'SearchByArtist'))
  searchTrackByArtist(
    @Query('track') track: string,
    @Query('page_size') page_size: string,
    @Query('page') page: string) : Observable<any>{
    return this._trackService.apiSearchByArtist(track, page_size, page);
  }

  @UseInterceptors(new TrackInterceptor(),new ApiInterceptor())
  @Get('/lyrics/:track_id')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'GetLyrics'))
  getTrackById(@Param('track_id') track_id: string,) : Observable<any>{
    return this._trackService.getTrackLyrics(track_id);
  }

  @UseInterceptors(new TrackInterceptor(),new ApiInterceptor())
  @Get('/:track_id')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Track.modelName, 'Get'))
  getTrack(@Param('track_id') track_id: string,) : Observable<any>{
    return this._trackService.getTrack(track_id);
  }
}
