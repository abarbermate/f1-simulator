import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { DriversService } from './drivers.service';
import * as _ from 'lodash';

@Controller('api/drivers')
export class DriversController {
  constructor(
    private readonly dataService: DataService,
    private readonly driverService: DriversService,
  ) {}
  @Get()
  getDrivers(@Query('sorted') sorted: string) {
    const drivers = this.dataService.getData();
    if (sorted === 'true') {
      return _.sortBy(drivers, 'place');
    }
    return drivers;
  }

  @Post(':driverId/overtake')
  overtake(@Param('driverId') driverId: string) {
    this.driverService.overtake(driverId);
    return `Driver #${driverId} overtook.`;
  }
}
