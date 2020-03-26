import 'automapper-ts/dist/automapper';
import { Injectable } from '@nestjs/common';
import { UserResponseVm } from '../../user/models/view-models/user-response-vm';
import { User } from '../../user/models/user.model';

@Injectable()
export class MapperService {

  mapper: AutoMapperJs.AutoMapper;

  constructor() {
    this.mapper = automapper;
    this.innitializeMapper();
  }

  private innitializeMapper(): void {
    this.mapper.initialize(MapperService.configure);
  }

  private static configure(config: AutoMapperJs.IConfiguration): void {
    config.createMap('User', 'UserVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('password', opts => opts.ignore())
      .forSourceMember('setlist', opts => opts.ignore());
    config.createMap('User', 'UserResponseVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('password', opts => opts.ignore())
      .forSourceMember('setlist', opts => opts.ignore())
      .forSourceMember('username', opts => opts.ignore())
      .forSourceMember('__v', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore())
      .forSourceMember('email', opts => opts.ignore());

    config.createMap('User[]', 'UserResponseVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('password', opts => opts.ignore())
      .forSourceMember('setlist', opts => opts.ignore())
      .forSourceMember('username', opts => opts.ignore())
      .forSourceMember('__v', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore())
      .forSourceMember('email', opts => opts.ignore());

    config.createMap('User[]', 'UserVm[]')
      .forSourceMember('password', opts => opts.ignore());


    config.createMap('Lyricset', 'LyricsetVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('__v', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('totalRating', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore());

    config.createMap('Band', 'BandVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('__v', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('messages', opts => opts.ignore())
      .forSourceMember('setlist', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore());

    config.createMap('Band', 'FullBandVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('__v', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('messages', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore());
  }

}
