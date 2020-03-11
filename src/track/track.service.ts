import { HttpService, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Track } from './models/track.model';
import { Configuration } from '../shared/configuration/configuration/configuration.enum';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Injectable()
export class TrackService extends BaseService<Track> {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  apiSearchByTitle(track: string, page_size: string, page: string) {
    return this.httpService.get(Configuration.API_URL + 'track.search',
      {
        params: {
          apikey: Configuration.API_KEY,
          s_track_rating: 'desc',
          q_track: track,
          f_has_lyrics: 1,
          page_size: page_size,
          page: page,
        },
      })
      .pipe(
        map(response => response.data.message.body),
      );
  }

  apiSearchByArtist(artist: string, page_size: string, page: string) {
    return this.httpService.get(Configuration.API_URL + 'track.search',
      {
        params: {
          apikey: Configuration.API_KEY,
          s_track_rating: 'desc',
          q_artist: artist,
          f_has_lyrics: 1,
          page_size: page_size,
          page: page,
        },
      })
      .pipe(
        map(response => response.data.message.body),
      );
  }




}
