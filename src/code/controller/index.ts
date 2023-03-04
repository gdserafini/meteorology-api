import { Response } from 'express';
import mongoose from 'mongoose';
import { CustomValidation } from '../model/user';
import logger from '@src/util/logger';
import ApiError, { APIError } from '@src/util/errors/api-error';

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
        res.status(409).send(
          ApiError.format({
            code: 409,
            message: err.message,
          })
        );
      } else {
        res.status(400).send(
          ApiError.format({
            code: 400,
            message: err.message,
          })
        );
      }
    } else {
      logger.error(err);
      res.status(500).send(
        ApiError.format({
          code: 500,
          message: 'Internal server error',
        })
      );
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
