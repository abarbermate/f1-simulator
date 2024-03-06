import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversResponse, OverTakeResponse } from '../schemas';

@Controller('api/drivers')
export class DriversController {
  constructor(private readonly driverService: DriversService) {}
  @Get()
  getDrivers(@Query('sorted') sorted: string): DriversResponse {
    return this.driverService.getDrivers(sorted === 'true');
  }

  @Post(':driverId/overtake')
  overtake(@Param('driverId') driverId: string): string {
    const {
      driverIndex,
      driverPlace,
      prevDriverIndex,
      prevDriverPlace,
    }: OverTakeResponse = this.driverService.prepareOvertake(driverId);

    this.driverService.patchDrivers(driverIndex, { place: prevDriverPlace });
    this.driverService.patchDrivers(prevDriverIndex, { place: driverPlace });

    return `Driver #${driverId} overtook.`;
  }
}
