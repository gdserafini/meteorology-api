import { Response } from 'express';
import mongoose from 'mongoose';
import { CustomValidation } from '../model/user';
import logger from '@src/util/logger';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    err: mongoose.Error.ValidationError | Error
  ): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const duplicatedErrors = Object.values(err.errors).filter((err) => {
        if (
          err instanceof mongoose.Error.ValidatorError ||
          err instanceof mongoose.Error.CastError
        ) {
          return err.kind === CustomValidation.DUPLICATED;
        } else {
          return null;
        }
      });

      if (duplicatedErrors.length) {
        res.status(409).send({
          code: 409,
          error: err.message,
        });
      } else {
        res.status(422).send({
          code: 422,
          error: err.message,
        });
      }
    } else {
      logger.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
}
