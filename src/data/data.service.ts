import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { join } from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class DataService implements OnApplicationBootstrap {
  private data: any[];
  async onApplicationBootstrap(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    const filePath = join(__dirname, '../../db/drivers.json');
    const fileContents = await fsPromises.readFile(filePath, 'utf8');

    this.data = JSON.parse(fileContents);
  }

  getData() {
    return this.data;
  }
}
