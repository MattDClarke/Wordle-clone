const mongoose = require('mongoose');

/* NumOfTheDaySchema will correspond to a collection in your MongoDB database. */
const NumOfTheDaySchema = new mongoose.Schema({
  date: {
    type: String,
  },
  number: {
    type: Number,
  },
});

module.exports =
  mongoose.models.NumOfTheDay ||
  mongoose.model('NumOfTheDay', NumOfTheDaySchema);
