import { array, InferType, number, object, string } from 'yup';

export const DriverInputSchema = array(
  object({
    id: number().min(0).required(),
    code: string().min(3).max(3).required(),
    firstname: string().required(),
    lastname: string().required(),
    country: string().min(2).max(2).required(),
    team: string().required(),
  }),
);

export type DriverInput = InferType<typeof DriverInputSchema>;

export const DriverOutputSchema = array(
  object({
    id: number().min(0).required(),
    code: string().min(3).max(3).required(),
    firstname: string().required(),
    lastname: string().required(),
    country: string().min(2).max(2).required(),
    team: string().required(),
    imgUrl: string().required(),
    place: number().min(1).required(),
  }),
);

export type DriverResponse = InferType<typeof DriverOutputSchema>;
