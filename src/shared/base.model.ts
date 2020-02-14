import {  SchemaOptions } from 'mongoose';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { prop, Typegoose, pre } from 'typegoose';

export class BaseModel<T> extends Typegoose {
  @prop({ default: Date.now() })
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @prop({default: Date.now()})
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt? :Date;

  id?: string;
}

export class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @ApiModelPropertyOptional() id?: string;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};
