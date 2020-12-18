const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformingBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args) => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformingBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5fdbd6200f5d98a3e0d8cd33',
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformingBooking(result);
  },

  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
