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
    try {
      const data: DriversInput = await this.loadFile();

      const strippedData: DriversInput = await DriversInputSchema.validate(
        data,
        {
          stripUnknown: true,
        },
      );

      const shuffledPlaces: number[] = this.generatePlace(data.length);

      const transformedData: DriversResponse = await this.transformData(
        strippedData,
        shuffledPlaces,
      );

      this.driverService.setDrivers(transformedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error.errors);
      }
      console.error(error);
      process.exit(0);
    }
  }

  private async loadFile(): Promise<DriversInput> {
    const filePath: string = join(__dirname, '../../db/drivers.json');
    const fileContents: string = await fsPromises.readFile(filePath, 'utf8');

    return JSON.parse(fileContents);
  }

  private async transformData(
    data: DriversInput,
    shuffledPlaces: number[],
  ): Promise<DriversResponse> {
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
