import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class DriversService {
  constructor(private dataService: DataService) {}
  overtake(driverId: string): void {
    const drivers = this.dataService.getData();
    const driverIndex = drivers.findIndex(
      (driver) => driver.id === parseInt(driverId),
    );

    if (driverIndex === -1) {
      throw new NotFoundException(`Driver #${driverId} not found.`);
    }

    const driverPlace = drivers[driverIndex].place;

    if (!driverPlace || driverPlace === 1) {
      throw new BadRequestException(`Driver #${driverId} can't overtake.`);
    }

    const prevDriverIndex = drivers.findIndex(
      (driver) => driver.place === driverPlace - 1,
    );

    if (prevDriverIndex === -1) {
      console.error('Previous driver not found.');
      throw new InternalServerErrorException();
    }

    const prevDriverPlace = drivers[prevDriverIndex].place;

    this.dataService.patchData(driverIndex, { place: prevDriverPlace });
    this.dataService.patchData(prevDriverIndex, { place: driverPlace });
  }
}
