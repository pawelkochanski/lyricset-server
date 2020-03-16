import { BaseModel, schemaOptions } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';
import { IsNumber, IsString } from 'class-validator';
export class Track extends BaseModel<Track>{
  @IsString()
  @prop()
  track_name: string;
  @prop()
  @IsString()
  artist_name: string;
  @prop()
  @IsNumber()
  track_id: number;
  @prop()
  @IsNumber()
  artist_id: number;

  static get model(): ModelType<Track>{
    return new Track().getModelForClass(Track, {schemaOptions});
  }

  static get modelName() : string{
    return this.model.modelName;
  }
}
