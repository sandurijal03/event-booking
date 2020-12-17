const { Schema, model } = require('mongoose');

const {
  Types: { ObjectId },
} = Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdEvents: [
      {
        type: ObjectId,
        ref: 'Event',
      },
    ],
  },
  { timestamps: true },
);

module.exports = model('User', userSchema);
