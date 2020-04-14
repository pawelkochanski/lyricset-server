import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Lyricset } from './models/lyricset.model';
import { BaseService } from '../shared/base.service'
import { ModelType } from 'typegoose';
import { InjectModel } from '@nestjs/mongoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { LyricSetParams } from './models/view-models/lyricset.params.model';
import { User } from '../user/models/user.model';

@Injectable()
export class LyricsetService extends BaseService<Lyricset> {
  constructor(@InjectModel(Lyricset.modelName) private readonly _todoModel: ModelType<Lyricset>,
              private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _todoModel;
    this._mapper = _mapperService.mapper;
  }

  async createLyricset(params: LyricSetParams, user: User): Promise<Lyricset> {
    const { name, isPrivate } = params;

    const newLyricset = new this._model();
    newLyricset.name = name;
    newLyricset.isPrivate = isPrivate !== '';
    newLyricset.rating = 0;
    newLyricset.ownerId = user.id;

    try {
      const result = await this.create(newLyricset);
      return result.toJSON() as Lyricset;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async setImageSet(imageId: string, setId: string): Promise<void> {
    let exists: Lyricset;
    try {
      exists = await this.fidnById(setId);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!exists) {
      throw new HttpException('set doesnt exist.', HttpStatus.BAD_REQUEST);
    }

    exists.imageId = imageId;

    try {
      await this.update(setId, exists);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
