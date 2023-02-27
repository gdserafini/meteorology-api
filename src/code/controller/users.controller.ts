import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/code/model/user';
import { BaseController } from '.';
import mongoose from 'mongoose';
import AuthService from '../service/auth';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(
        res,
        error instanceof Error
          ? (error as Error)
          : (error as mongoose.Error.ValidationError)
      );
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        code: 401,
        error: 'User not found',
      });
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return res.status(401).send({
        code: 401,
        error: 'Invalid data passed',
      });
    }
    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({
      token: token,
    });
  }
}
