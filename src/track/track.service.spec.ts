import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { HttpModule, HttpService } from '@nestjs/common';

describe('TrackService', () => {
  let service: TrackService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],

      providers: [
        TrackService,
      ],
    }).compile();

    httpService = module.get(HttpService);
    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apiSearchByTitle', () => {
    it('should call httpService get', () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValue(null);
      service.apiSearchByTitle('q','1','1');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('apiSearchByArtist', () => {
    it('should call httpService get', () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValue(null);
      service.apiSearchByArtist('q','1','1');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('top10', () => {
    it('should call httpService get', () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValue(null);
      service.top10('3');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getTrackLyrics', () => {
    it('should call httpService get', () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValue(null);
      service.getTrackLyrics('3');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getTrack', () => {
    it('should call httpService get', () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValue(null);
      service.getTrack('3');
      expect(spy).toHaveBeenCalled();
    });
  });
});
