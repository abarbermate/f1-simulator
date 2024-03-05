import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import * as _ from 'lodash';
import { join } from 'path';
import { ValidationError } from 'yup';
import { promises as fsPromises } from 'fs';

import {
  DriverInput,
  DriverInputSchema,
  DriverOutputSchema,
  DriverResponse,
} from '../schemas';

@Injectable()
export class DataService implements OnApplicationBootstrap {
  private data: DriverResponse;
  async onApplicationBootstrap(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    const filePath = join(__dirname, '../../db/drivers.json');
    const fileContents = await fsPromises.readFile(filePath, 'utf8');

    const data = JSON.parse(fileContents);

    try {
      const strippedData: DriverInput = await DriverInputSchema.validate(data, {
        stripUnknown: true,
      });

      this.data = await this.transformData(strippedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error.errors);
        process.exit(1);
      }
    }
  }

  private async transformData(data: DriverInput): Promise<DriverResponse> {
    const shuffledPlaces = this.generatePlace(data.length);
    const mappedData = data.map((driver, index) => {
      const imgCode = driver.code.toLowerCase();
      return {
        ...driver,
        imgUrl: `/static/${imgCode}.png`,
        place: shuffledPlaces[index],
      };
    });

    return DriverOutputSchema.validate(mappedData, {
      stripUnknown: true,
    });
  }

  private generatePlace(length: number): number[] {
    const places = Array.from({ length }, (_, index) => index + 1);
    return _.shuffle(places);
  }

  getData(): DriverResponse {
    return this.data;
  }

  patchData(index: number, data: Record<string, number | string>): void {
    this.data[index] = { ...this.data[index], ...data };
  }
}
