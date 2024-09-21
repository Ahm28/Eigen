import { Body, Controller, Logger, Post, Response, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { Validate } from 'class-validator';
import { BorrowBookDto, ReturnBookDto } from './dto';
import { responseError, responseSuccess } from 'src/utils/response';

const moment = require('moment');

@ApiTags('Activity')
@Controller()
export class ActivityController {

  private readonly logger = new Logger('ActivityController');
  constructor(private readonly activityService: ActivityService) {}

  @Post('activity/borrow')
  @Validate(ValidationPipe)
  async borrowBook(@Body() body: BorrowBookDto, @Response() res) {
    let statusCode = 500,
      message = 'Internal Server Error!',
      response = responseError(statusCode, message);

    const beforeTime = moment()

    const borrowBook = await this.activityService.borrowBook(body);

    const afterTime = moment()
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();

    this.logger.log(
      `User with code ${body.code_user} borrow book with code ${body.code_book} in ${totalTime} minutes`,
    );

    if (borrowBook.success) {
      statusCode = 200;
      message = borrowBook.message;
      response = responseSuccess(statusCode, message, borrowBook.data);
    } else {
      response = responseError(statusCode, borrowBook);
    }

    return res.status(statusCode).json(response);
  }

  @Post('activity/return')
  @Validate(ValidationPipe)
  async returnBook(@Body() body: ReturnBookDto, @Response() res) {
    let statusCode = 500,
      message = 'Internal Server Error!',
      response = responseError(statusCode, message);  

    const beforeTime = moment()

    const returnBook = await this.activityService.returnBook(body);

    const afterTime = moment()
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();

    this.logger.log(
      `User with code ${body.code_user} return book with code ${body.code_book} in ${totalTime} minutes`,
    );

    if (returnBook.success) {
      statusCode = 200;
      message = returnBook.message;
      response = responseSuccess(statusCode, message, null);
    } else {
      response = responseError(statusCode, returnBook);
    }

    return res.status(statusCode).json(response);
  }

}