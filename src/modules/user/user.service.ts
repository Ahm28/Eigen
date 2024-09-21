import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.logger = new Logger(UserService.name);
  }

  async findByEmail(email: string) {
    this.logger.log(`Find user by email: ${email}`);
    return this.userModel.findOne({ email });
  }

  async createUser(data: object) {
    this.logger.log(`Create user: ${data['email']}`);
    data['code'] = `M${Math.floor(100000 + Math.random() * 900000)}`;
    const createUser = await this.userModel.create(data);
    return createUser;
  }

  async findByCode(code: string) {
    this.logger.log(`Find user by code: ${code}`);
    return this.userModel.findOne({ code });
  }

  async findbyIdandUpdate(id: string, data: object) {
    this.logger.log(`Find user by id: ${id}`);
    const objectId = new Types.ObjectId(id);
    return this.userModel.findByIdAndUpdate(objectId, data, { new: true });
  }

  async findbyId(id: string) {
    this.logger.log(`Find user by id: ${id}`);
    const objectId = new Types.ObjectId(id);
    return this.userModel.findById(objectId);
  }

  async findbystatus(status: string) {
    this.logger.log(`Find user by status: ${status}`);
    return this.userModel.find({ status });
  }
}
