import { BaseModel, schemaOptions } from './../../shared/base.model';
import { prop, ModelType } from 'typegoose';
import { Track } from '../../track/models/track.model';
export class Lyricset extends BaseModel<Lyricset>{
    @prop({required: [true, 'Name is required']})
    name: string;
    @prop({default: 'description'})
    description: string;
    @prop({default: ''})
    imageId: string;
    @prop({default: []})
    tracklist: Track[];
    @prop({default: false})
    isPrivate: boolean;
    @prop({default: 0})
    rating: number;
    @prop({default: 0})
    totalRating: number;
    @prop()
    ownerId: string;

    static get model(): ModelType<Lyricset>{
        return new Lyricset().getModelForClass(Lyricset, {schemaOptions});
    }

    static get modelName() : string{
        return this.model.modelName;
    }
}
