import { HttpService, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Track } from './models/track.model';
import { Configuration } from '../shared/configuration/configuration/configuration.enum';
import { map } from 'rxjs/operators';

@Injectable()
export class TrackService extends BaseService<Track>{
  constructor(private readonly httpService: HttpService) {
    super();
  }

  apiSearchByTitle(track: string) {
    return this.httpService.get(Configuration.API_URL + 'track.search',
      {params:{
          apikey: Configuration.API_KEY,
          // eslint-disable-next-line @typescript-eslint/camelcase
          s_track_rating: 'desc',
          // eslint-disable-next-line @typescript-eslint/camelcase
          q_track: track
        }})
      .pipe(
          map(response => response.data.message.body)
    )
  }


}
