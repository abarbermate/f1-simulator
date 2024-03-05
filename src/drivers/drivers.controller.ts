import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from '../data/data.service';
import * as _ from 'lodash';

@Controller('api/drivers')
export class DriversController {
  constructor(private readonly dataService: DataService) {}
  @Get()
  getDrivers(@Query('sorted') sorted: string) {
    const drivers = this.dataService.getData();
    if (sorted === 'true') {
      return _.sortBy(drivers, 'place');
    }
    return drivers;
  }
}
