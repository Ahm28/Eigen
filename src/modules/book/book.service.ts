import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Book, BookDocument } from "src/schema/book.model";

@Injectable()
export class BookService {

  private readonly logger = new Logger(BookService.name);
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async getBook() {
    let result = {
      success: false,
      message: null,
      data: null
    }

    try {

      const limit = 5,
        skip = 0;

      const data = await this.bookModel
        .find()
        .where({ stok: { $gt: 0 } })
        .limit(limit)
        .skip(skip);

      const count = await this.bookModel.countDocuments({})
      const page_total = Math.floor((count - 1) / limit) + 1;

      result['success'] = true;
      result['message'] = 'Get book successfully';
      result['data'] = {
        data,
        page: skip + 1,
        page_total,
      };
      this.logger.log('Get book successfully');
    } catch (error) {
      this.logger.error(error.message);
      result = {
        success: false,
        message: error.message,
        data: null
      };
    } finally {
      return result
    }
  }

  async addedBook(data: object) {
    let result = {
      success: false,
      message: null,
    }
    try {
      const create = await this.bookModel.create(data);

      if (create) {
        result['success'] = true;
        result['message'] = 'Book added successfully';
        this.logger.log('Book added successfully');
      }
    } catch (error) {
      this.logger.error(error.message);
      result = {
        success: false,
        message: error.message,
      };
    } finally {
      return result
    }
  }

  async findByCode(code: string) {
    this.logger.log(`Find book by code ${code}`);
    return await this.bookModel.findOne({ code });
  }

  async findByIdandUpdate(id: string, data: object) {
    const objectId = new Types.ObjectId(id);
    this.logger.log(`Find book by id ${id}`);
    return await this.bookModel.findByIdAndUpdate(objectId, data, {
      new: true,
    });
  }

  async findBookByCode(code: string) {
    let result = {
      success: false,
      message: null,
      data: null
    }

    try {
      const book = await this.bookModel.findOne({ code });

      if (book) {
        result['success'] = true;
        result['message'] = 'Get book successfully';
        result['data'] = book;
        this.logger.log('Get book successfully');
      } 
    } catch (error) {
      this.logger.error(error.message);
      result = {
        success: false,
        message: error.message,
        data: null
      };
    } finally {
      return result
    }
  }
}