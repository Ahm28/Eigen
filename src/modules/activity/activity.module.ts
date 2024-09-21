import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from 'src/schema/history.model';
import { User, UserSchema } from 'src/schema/user.model';
import { Book, BookSchema } from 'src/schema/book.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, UserService, BookService],
  exports: [],
})

export class ActivityModule {}