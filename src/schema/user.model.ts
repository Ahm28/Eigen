import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

const moment = require('moment');

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ index: true })
  code: string;

  @Prop({ default: 'active', index: true }) // status value = active, inactive, penalty
  status: string;

  @Prop({ default: null })
  due_at: Date;

  @Prop({ default: moment() })
  created_at: Date;

  @Prop({ default: moment() })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
