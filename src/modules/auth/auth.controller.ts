import { Body, Controller, Logger, Post, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegistrationDto } from './dto';
import { responseError, responseSuccess } from 'src/utils/response';

const moment = require('moment');

@ApiTags('Authentication')
@Controller()
export class AuthController {
  private readonly logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async create(@Body() data: RegistrationDto, @Response() res) {
    let statusCode = 500,
      message = '',
      response = responseError(statusCode, 'Internal Server Error!');

    const beforeTime = moment();
    const createUser = await this.authService.createUser(data);

    const afterTime = moment();
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();
    this.logger.log(
      `User with email ${data.email} created in ${totalTime} minutes`,
    );

    if (createUser.success) {
      statusCode = 200;
      message = createUser.message;
      response = responseSuccess(statusCode, message, null);
    } else {
      response = responseError(statusCode, createUser.message);
    }

    return res.status(statusCode).json(response);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() data: LoginDto, @Response() res) {
    let statusCode = 500,
      message = '',
      response = responseError(statusCode, 'Internal Server Error!');

    const beforeTime = moment();
    const loginUser = await this.authService.loginUser(data);

    const afterTime = moment();
    const totalTime = moment.duration(afterTime.diff(beforeTime)).asMinutes();
    this.logger.log(
      `User with email ${data.email} login in ${totalTime} minutes`,
    );

    if (loginUser.success) {
      statusCode = 200;
      message = loginUser.message;
      response = responseSuccess(statusCode, message, loginUser.data);
    } else {
      response = responseError(statusCode, loginUser.message);
    }

    return res.status(statusCode).json(response);
  }
}