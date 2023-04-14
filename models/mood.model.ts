import { Schema, model, models } from 'mongoose';

export const Mood = models.Mood || model(
  "Mood",
  new Schema({
    value: {
        type: String,
        required: [true, 'Value is required']
    },
    note: {
        type: String
    },
    user_id: {
        type: String,
        required: [true, '']
    },
  },
  { timestamps: true })
);