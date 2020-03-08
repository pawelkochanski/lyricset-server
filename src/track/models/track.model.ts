import { BaseModel, schemaOptions } from '../../shared/base.model';
import { prop, ModelType } from 'typegoose';
export class Track extends BaseModel<Track>{
  @prop()
  title: string;
  @prop()
  artist: string;
  @prop()
  lyrics: string;

  static get model(): ModelType<Track>{
    return new Track().getModelForClass(Track, {schemaOptions});
  }

  static get modelName() : string{
    return this.model.modelName;
  }
}
