import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Lyricset } from './models/lyricset.model';
import { BaseService } from 'src/shared/base.service';
import { ModelType } from 'typegoose';
import { InjectModel } from '@nestjs/mongoose';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { LyricSetParams } from './models/view-models/lyricset.params.model';

@Injectable()
export class LyricsetService extends BaseService<Lyricset> {
    constructor(@InjectModel(Lyricset.modelName) private readonly _todoModel: ModelType<Lyricset>,
     private readonly _mapperService: MapperService
    ){
        super();
        this._model = _todoModel;
        this._mapper = _mapperService.mapper;
    }

    async createLyricset(params: LyricSetParams): Promise<Lyricset>{
        const{name} = params;

        const newLyricset = new this._model();
        newLyricset.name = name;

        try {
            const result = await this.create(newLyricset)
            return result.toJSON() as Lyricset;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
