import {HttpService, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Track } from './models/track.model';
import { Configuration } from '../shared/configuration/configuration/configuration.enum';


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
      });
  }

  top10(count: string){
    return this.httpService.get(Configuration.API_URL + 'chart.tracks.get',
      {
        params: {
          apikey: Configuration.API_KEY,
          chart_name: 'mxmweekly',
          country: 'XW',
          page_size: count,
          f_has_lyrics: '1'
        },
      });
  }

  apiSearchByArtist(artist: string, page_size: string, page: string) {
    return this.httpService.get(Configuration.API_URL + 'track.search',
      {
        params: {
          apikey: Configuration.API_KEY,
          s_track_rating: 'desc',
          q_artist: artist,
          f_has_lyrics: true,
          page_size: page_size,
          page: page,
        },
      });
  }

  apiSearchByQuery(query: string, page_size: string, page: string){

  }

  getTrackLyrics(track_id: string){
    return this.httpService.get(Configuration.API_URL + 'track.lyrics.get',
      {
        params: {
          apikey: Configuration.API_KEY,
          track_id: track_id
        }
      });
  }

  getTrack(track_id: string){
    return this.httpService.get(Configuration.API_URL + 'track.get',
      {
        params: {
          apikey: Configuration.API_KEY,
          track_id: track_id
        }
      });
  }


}
