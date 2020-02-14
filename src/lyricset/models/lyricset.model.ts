import { BaseModel, schemaOptions } from './../../shared/base.model';
import { prop, ModelType } from 'typegoose';
export class Lyricset extends BaseModel<Lyricset>{
    @prop({required: [true, 'Name is required']})
    name: string;
    @prop({default: 'description'})
    description: string;
    @prop({default: ''})
    imageUrl: string;
    @prop({default: []})
    tracklist: string[];

    static get model(): ModelType<Lyricset>{
        return new Lyricset().getModelForClass(Lyricset, {schemaOptions});
    }

    static get modelName() : string{
        return this.model.modelName;
    }
}