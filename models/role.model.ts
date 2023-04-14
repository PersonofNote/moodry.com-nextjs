import { Schema, model, models } from 'mongoose';

export const Role = models.Role || model(
  "Role",
  new Schema({
    name: String
  })
);

