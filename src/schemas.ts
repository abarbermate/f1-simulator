import { array, InferType, number, object, string } from 'yup';

export const DriverInputSchema = object({
  id: number().min(0).required(),
  code: string().min(3).max(3).required(),
  firstname: string().required(),
  lastname: string().required(),
  country: string().min(2).max(2).required(),
  team: string().required(),
});

export type DriverInput = InferType<typeof DriverInputSchema>;

export const DriversInputSchema = array(DriverInputSchema);

export type DriversInput = InferType<typeof DriversInputSchema>;

export const DriverSchema = object({
  id: number().min(0).required(),
  code: string().min(3).max(3).required(),
  firstname: string().required(),
  lastname: string().required(),
  country: string().min(2).max(2).required(),
  team: string().required(),
  imgUrl: string().required(),
  place: number().min(1).required(),
});

export type Driver = InferType<typeof DriverSchema>;

export const DriversOutputSchema = array(DriverSchema);

export type DriversResponse = InferType<typeof DriversOutputSchema>;

export type OverTakeResponse = {
  driverIndex: number;
  driverPlace: number;
  prevDriverIndex: number;
  prevDriverPlace: number;
};
