import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

const moment = require('moment');

@Schema()
export class History {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  user_id: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'Book', index: true })
  book_id: Types.ObjectId;

  @Prop({ default: 'active', index: true }) // Status value = active, returned, overdue
  status: string;

  @Prop({ default: null })
  date_borrow: Date;

  @Prop({ default: null })
  date_return: Date;
  
  @Prop({ default: null })
  due_date: Date;

  @Prop({ default: moment() })
  created_at: Date;

  @Prop({ default: moment() })
  updated_at: Date;
}

export type HistoryDocument = History & Document

export const HistorySchema = SchemaFactory.createForClass(History)