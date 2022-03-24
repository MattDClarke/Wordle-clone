const mongoose = require('mongoose');

/* UsedNumSchema will correspond to a collection in your MongoDB database. */
const UsedNumSchema = new mongoose.Schema({
  usedNumbers: {
    name: String,
    type: [Number],
  },
});

module.exports =
  mongoose.models.UsedNum || mongoose.model('UsedNum', UsedNumSchema);
