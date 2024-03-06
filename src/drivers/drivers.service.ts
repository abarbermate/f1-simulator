import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Driver, DriversResponse, OverTakeResponse } from '../schemas';
import * as _ from 'lodash';

@Injectable()
export class DriversService {
  private drivers: DriversResponse;

  setDrivers(drivers: DriversResponse): void {
    this.drivers = drivers;
  }

  getDrivers(sorted: boolean = false): DriversResponse {
    if (sorted) {
      return _.sortBy(this.drivers, 'place');
    }
    return this.drivers;
  }

  patchDrivers(index: number, data: Record<string, number | string>): void {
    this.drivers[index] = { ...this.drivers[index], ...data };
  }

  prepareOvertake(driverId: string): OverTakeResponse {
    const driverIndex: number = this.drivers.findIndex(
      (driver: Driver): boolean => driver.id === parseInt(driverId),
    );

    if (driverIndex === -1) {
      throw new NotFoundException(`Driver #${driverId} not found.`);
    }

    const driverPlace: number = this.drivers[driverIndex].place;

    if (!driverPlace || driverPlace === 1) {
      throw new BadRequestException(`Driver #${driverId} can't overtake.`);
    }

    const prevDriverIndex: number = this.drivers.findIndex(
      (driver: Driver): boolean => driver.place === driverPlace - 1,
    );

    if (prevDriverIndex === -1) {
      console.error('Previous driver not found.');
      throw new InternalServerErrorException();
    }

    const prevDriverPlace: number = this.drivers[prevDriverIndex].place;

    return {
      driverIndex,
      driverPlace,
      prevDriverIndex,
      prevDriverPlace,
    };
  }
}
