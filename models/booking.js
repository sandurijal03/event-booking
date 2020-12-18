const { model, Schema } = require('mongoose');

const {
  Types: { ObjectId },
} = Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: ObjectId,
      ref: 'Event',
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = model('Booking', bookingSchema);
