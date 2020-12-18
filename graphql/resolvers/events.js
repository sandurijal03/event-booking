const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
  events: async (args) => {
    try {
      const events = await Event.find().populate('creator');
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('UnAuthenticated');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('Users not exists');
      }
      creator.createdEvents.push(event);
      creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
