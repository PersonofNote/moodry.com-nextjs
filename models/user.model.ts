import { Schema, model, models } from 'mongoose';

export const User = models.User || model(
  "User",
  new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    premium: Boolean,
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
  })
);
