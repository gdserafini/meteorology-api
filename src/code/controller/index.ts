import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    err: mongoose.Error.ValidationError | Error
  ): void {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(422).send({
        code: 422,
        error: err.message,
      });
    } else res.status(500).send({ error: 'Internal server error' });
  }
}
