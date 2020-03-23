import { prop } from 'typegoose';

export class WallPost{
  @prop()
  subject: string;

  @prop()
  content: string;

  @prop()
  comments: string;
}
