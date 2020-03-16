import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TrackInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(response => {
        if (response.track_list) {
          response.track_list = response.track_list.map(track_element => {
              return {
                track: {
                  track_id: track_element.track.track_id,
                  track_name: track_element.track.track_name,
                  artist_name: track_element.track.artist_name,
                  artist_id: track_element.track.artist_id,
                },
              };
            },
          );
        }
        else if (response.track) {
          response.track = {
              track_id: response.track.track_id,
              track_name: response.track.track_name,
              artist_name: response.track.artist_name,
              artist_id: response.track.artist_id,
          };

        }
        else if (response.lyrics){
          response.lyrics = {
            lyrics_body: response.lyrics.lyrics_body
          }
        }
      return response;
      },
    ));
  }
}
