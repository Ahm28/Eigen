import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const moment = require('moment');

@Schema()
export class Book {
  @Prop()
  code: string;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  stok: number;

  @Prop({ default: moment() })
  created_at: Date;

  @Prop({ default: moment() })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;
}

export type BookDocument = Book & Document

export const BookSchema = SchemaFactory.createForClass(Book)
