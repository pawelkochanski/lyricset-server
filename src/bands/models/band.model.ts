import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop } from 'typegoose';
import { Member } from './member.model';
import { WallPost } from './wall-post.model';
import { Track } from '../../track/models/track.model';
import { SendMessage } from '../../chat/models/message.model';

export class Band extends BaseModel<Band> {
  @prop({required: true, unique: true})
  name: string;

  @prop({default: []})
  tracklist: Track[];

  @prop()
  members: Member[];

  @prop({default: null})
  imageId: string;

  @prop( {default: []})
  messages: SendMessage[];

  static get model(): ModelType<Band>{
    return new Band().getModelForClass(Band, {schemaOptions});
  }

  static get modelName() : string{
    return this.model.modelName;
  }
}
