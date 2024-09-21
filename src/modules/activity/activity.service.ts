import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from 'src/schema/history.model';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';
import { Cron } from '@nestjs/schedule';

const moment = require('moment');

@Injectable()
export class ActivityService {

  private readonly logger = new Logger(ActivityService.name);
  constructor(
    @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
    private readonly userService: UserService,
    private readonly bookService: BookService
  ) {}

  async borrowBook(data: object) {
    let result = {
      success: false,
      message: null,
      data: null
    };

    try {
      const [findUserByCode, findBookByCode] = await Promise.all([
        this.userService.findByCode(data['code_user']),
        this.bookService.findByCode(data['code_book']),
      ]);

      if (!findUserByCode) {
        throw new Error(
          `User dengan kode user ${data['code_user']} tidak ditemukan`,
        );
      }

      if (!findBookByCode) {
        throw new Error(
          `Buku dengan kode book ${data['code_book']} tidak ditemukan`,
        );
      }

      if (findUserByCode.status === 'penalty') {
        throw new Error(
          `User dengan code user ${data['code_user']} sedang dalam masa penalty`,
        );
      }

      if (findBookByCode.stok === 0 || !findBookByCode.stok) {
        throw new Error(
          `Buku dengan kode book ${data['code_book']} sedang habis`,
        );
      }

      const findHistory = await this.historyModel.find({
        user_id: findUserByCode._id,
        status: 'active',
      });

      if (findHistory.length > 2) {
        throw new Error(
          `User dengan code user ${data['code_user']} hanya bisa meminjam 2 buku`,
        );
      }

      const payload = {
        user_id: findUserByCode._id,
        book_id: findBookByCode._id,
        date_borrow: moment(),
        due_date: moment().add(1, 'minute'),
      };

      await Promise.all([
        this.bookService.findByIdandUpdate(findBookByCode._id.toString(), {
          stok: findBookByCode.stok - 1
        }),
        this.historyModel.create(payload)
      ]);

      result = {
        success: true,
        message: 'Sukses meminjam buku',
        data: payload, // Return the payload instead of createHistory
      };

      this.logger.log(result.message);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  async returnBook(data: object) {
    let result = {
      success: false,
      message: null,
    }

    try {
      const [findUserByCode, findBookByCode] = await Promise.all([
        this.userService.findByCode(data['code_user']),
        this.bookService.findByCode(data['code_book']),
      ]);

      if (!findUserByCode) {
        throw new Error(
          `User dengan kode user ${data['code_user']} tidak ditemukan`,
        );
      }

      if (!findBookByCode) {
        throw new Error(
          `Buku dengan kode book ${data['code_book']} tidak ditemukan`,
        )
      }

      const findHistory = await this.historyModel.findOne({
        user_id: findUserByCode._id,
        book_id: findBookByCode._id
      });

      if (!findHistory) {
        throw new Error(
          `Peminjaman buku dengan kode user ${data['code_user']} dan kode book ${data['code_book']} tidak ditemukan`,
        )
      }

      if (findHistory.status === 'returned') {
        throw new Error(
          `Buku dengan kode user ${data['code_user']} dan kode book ${data['code_book']} sudah dikembalikan`,
        )
      }

      if (moment().isAfter(findHistory.due_date)) {
        await this.userService.findbyIdandUpdate(
          findUserByCode._id.toString(),
          {
            status: 'penalty',
            due_at: moment().add(3, 'day'),
          },
        );
      }

      await Promise.all([
        this.historyModel.updateOne({
            _id: findHistory._id,
          },
          {
            $set: {
              date_return: moment(),
              updated_at: moment(),
              status: 'returned',
            },
          },
        ),
        this.bookService.findByIdandUpdate(findBookByCode._id.toString(), {
          stok: findBookByCode.stok + 1
        })
      ])

      result['success'] = true;
      result['message'] = 'Sukses mengembalikan buku';
      return result
    } catch (error) {
      this.logger.error(error.message);
      result = {
        success: false,
        message: error.message,
      }

      return result
    }
  }

  @Cron('20 * * * * *')
  async handleActiveBorrowedBooks() { 
    const activeBorrowedBooks = await this.historyModel.find({
      status: 'active'
    });
    this.logger.log('Active Borrowed Books');

    if (activeBorrowedBooks.length > 0) {
      this.logger.log(`Borrow book have ${activeBorrowedBooks.length} books`);
      activeBorrowedBooks.map(async (borrowedBook) => {
        if (moment().isAfter(borrowedBook.due_date)) {
          const user = await this.userService.findbyId(
            borrowedBook.user_id.toString(),
          );

          if (user.status === 'active') {
            await this.userService.findbyIdandUpdate(
              borrowedBook.user_id.toString(),
              {
                status: 'penalty',
                due_at: moment().add(3, 'day'),
              },
            );

            this.logger.log(
              `Success change status user with id ${user._id} to penalty`,
            );
          }
        }
      });
    }
  }

  @Cron('20 * * * * *')
  async handleUserStatusPenalty() {
    this.logger.log('handleUserStatusPenalty')
    const dataUser = await this.userService.findbystatus('penalty')
    this.logger.log('User Status Penalty');

    if (dataUser.length > 0) {
      dataUser.map(async (data) => {
        if (moment().isAfter(data.due_at)) {
          const user = await this.userService.findbyIdandUpdate(
            data._id.toString(),
            {
              status: 'active',
            },
          );

          this.logger.log(
            `Success change status user with id ${user._id} to active`,
          );
        }
      })
    }
  }
}