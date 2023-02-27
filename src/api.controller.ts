import { ChildControllers, Controller } from '@overnightjs/core';
import { ForcastController } from '@src/code/controller/forcast.controller';
import { BeachesController } from '@src/code/controller/beaches.controller';
import { UserController } from '@src/code/controller/users.controller';

@Controller('v1')
@ChildControllers([
  new ForcastController(),
  new BeachesController(),
  new UserController(),
])
export class ApiController {}
