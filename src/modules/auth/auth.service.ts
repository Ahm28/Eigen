import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
  ) {}


  async createUser(data: object) {
    let result = {
      success: false,
      message: null,
    }

    try {
      const validateEmail = await this.userService.findByEmail(data['email']);

      if (validateEmail) {
        this.logger.error('Email already exists');
        result['success'] = false;
        result['message'] = 'Email already exists';
      } else {
        data['password'] = await bcrypt.hash(data['password'], 10);

        const createUser = await this.userService.createUser(data);
        this.logger.log('User created successfully');

        if (createUser) {
          this.logger.log('User created successfully');
          result['success'] = true;
          result['message'] = 'User created successfully';
        }
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

  async loginUser(data: object) {
    let result = {
      success: false,
      message: null,
      data: null
    }

    try {
      const validateUser = await this.userService.findByEmail(data['email']);
      const match = await this.comparePassword(
        data['password'],
        validateUser.password,
      )
      this.logger.log('Compare Password success');

      if (validateUser && match) {
        const user = {
          email: validateUser.email,
          name: validateUser.name,
        }

        const token = await this.jwtService.signAsync(user)
        result = {
          success: true,
          message: 'Login success',
          data: {
            token: token
          }
        }
        this.logger.log('Login success');
      } else {
        this.logger.error('Email dan Kata Sandi tidak sesuai');
        result['message'] = 'Email dan Kata Sandi tidak sesuai'
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

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword)
    return match
  }
}
