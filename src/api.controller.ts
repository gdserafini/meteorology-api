import { ChildControllers, Controller } from '@overnightjs/core';
import { ForcastController } from '@src/code/controller/forcast.controller';
import { BeachesController } from '@src/code/controller/beaches';

@Controller('v1')
@ChildControllers([
    new ForcastController(),
    new BeachesController()
])
export class ApiController{}