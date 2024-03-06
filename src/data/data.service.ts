import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import * as _ from 'lodash';
import { join } from 'path';
import { ValidationError } from 'yup';
import { promises as fsPromises } from 'fs';

import {
  Driver,
  DriverInput,
  DriversInput,
  DriversInputSchema,
  DriversOutputSchema,
  DriversResponse,
} from '../schemas';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class DataService implements OnApplicationBootstrap {
  constructor(private driverService: DriversService) {}
  async onApplicationBootstrap(): Promise<void> {
    const data: DriversInput = await this.loadFile();

    try {
      const strippedData: DriversInput = await DriversInputSchema.validate(
        data,
        {
          stripUnknown: true,
        },
      );

      const transformedData: DriversResponse =
        await this.transformData(strippedData);

      this.driverService.setDrivers(transformedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error.errors);
        process.exit(1);
      }
    }
  }

  private async loadFile(): Promise<DriversInput> {
    const filePath: string = join(__dirname, '../../db/drivers.json');
    const fileContents: string = await fsPromises.readFile(filePath, 'utf8');

    return JSON.parse(fileContents);
  }

  private async transformData(data: DriversInput): Promise<DriversResponse> {
    const shuffledPlaces: number[] = this.generatePlace(data.length);
    const mappedData: DriversResponse = data.map(
      (driver: DriverInput, index: number): Driver => {
        const imgCode: string = driver.code.toLowerCase();
        return {
          ...driver,
          imgUrl: `/static/${imgCode}.png`,
          place: shuffledPlaces[index],
        };
      },
    );

    return DriversOutputSchema.validate(mappedData, {
      stripUnknown: true,
    });
  }

  private generatePlace(length: number): number[] {
    const places: number[] = Array.from({ length }, (_, index) => index + 1);
    return _.shuffle(places);
  }
}
