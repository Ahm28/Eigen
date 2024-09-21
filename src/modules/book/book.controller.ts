import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { responseError, responseSuccess } from 'src/utils/response';
import { addedBookDto } from './dto';
import { BookService } from './book.service';

const moment = require('moment');

@ApiTags('Book')
@Controller()
export class BookController {

  private readonly logger = new Logger('BookController');
  constructor(private readonly bookService: BookService) {}

  // @ApiBearerAuth()
  @Post('add-book')
  @UsePipes(ValidationPipe)
  async addBook(@Body() data: addedBookDto, @Response() res) {
    let statusCode = 500,
      message = '',
      response = responseError(statusCode, 'Internal Server Error!');

    const beforeTime = moment();
    const checkCode = await this.bookService.findByCode(data.code);

    const afterTime = moment();
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();
    this.logger.log(`Book finded in ${totalTime} minutes`);

    if (checkCode) {
      statusCode = 400;
      message = 'Code sudah digunakan!';
      response = responseError(statusCode, message);
      this.logger.error(message);
      return res.status(statusCode).json(response);
    }

    const beforeTimeCreate = moment()
    const create = await this.bookService.addedBook(data);

    const afterTimeCreate = moment()
    const totalTimeCreate = moment
      .duration(afterTimeCreate.diff(beforeTimeCreate))
      .asMinutes();
    this.logger.log(`Book created in ${totalTimeCreate} minutes`);

    if (create.success) {
      statusCode = 200;
      message = create.message;
      response = responseSuccess(statusCode, message, null);
      this.logger.error(message);
    } else {
      response = responseError(statusCode, create);
      this.logger.log('Success create book');
    }

    return res.status(statusCode).json(response);
  }

  @Get('book')
  @UsePipes(ValidationPipe)
  async getBook(@Response() res) {
    let statusCode = 500,
      message = '',
      response = responseError(statusCode, 'Internal Server Error!');

    const beforeTime = moment();
    const getAll = await this.bookService.getBook();

    const afterTime = moment();
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();
    this.logger.log(`Get all book in ${totalTime} minutes`);

    if (getAll.success) {
      statusCode = 200;
      message = getAll.message;
      response = responseSuccess(statusCode, message, getAll.data);
      this.logger.error(message);
    } else {
      response = responseError(statusCode, getAll.message);
      this.logger.log('Success get all book');
    }

    return res.status(200).json(response);
  }

  @Get('book/:code')
  @UsePipes(ValidationPipe)
  async getBookByCode(@Response() res, @Param('code') code: string) {
    let statusCode = 500,
      message = '',
      response = responseError(statusCode, 'Internal Server Error!');

    const beforeTime = moment();
    const getByCode = await this.bookService.findBookByCode(code);

    const afterTime = moment();
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();
    this.logger.log(`Get book by code ${code} in ${totalTime} minutes`);

    if (getByCode.success) {
      statusCode = 200;
      message = getByCode.message;
      response = responseSuccess(statusCode, message, getByCode.data);
      this.logger.error(message);
    } else {
      response = responseError(statusCode, getByCode);
      this.logger.log('Success get book by code');
    }

    return res.status(200).json(response);
  }
}