require('dotenv').config({ path: `${__dirname}/../.env.local` });

const mongoose = require('mongoose');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.MONGODB_URI);

// import models
const DailyRandomNum = require('../models/DailyRandomNum');
const UsedNum = require('../models/UsedNum');

// create initial data
const UTCDateLow = new Date();
// mid date - UTC 0 -> or close to it
const UTCDateMid = new Date();
const UTCDateHigh = new Date();
UTCDateLow.setDate(UTCDateLow.getDate() - 1);
UTCDateHigh.setDate(UTCDateHigh.getDate() + 1);

const lowDateObj = {
  date: UTCDateLow.toLocaleDateString('en-GB'),
  number: 1,
};
const midDateObj = {
  date: UTCDateMid.toLocaleDateString('en-GB'),
  number: 2,
};
const highDateObj = {
  date: UTCDateHigh.toLocaleDateString('en-GB'),
  number: 3,
};
const initialDailyRandomNums = [lowDateObj, midDateObj, highDateObj];
const initialUsedNums = { usedNumbers: [1, 2, 3] };
async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await DailyRandomNum.deleteMany({});
  await UsedNum.deleteMany({});

  console.log(
    'User Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'
  );
  process.exit();
}

async function loadData() {
  try {
    await DailyRandomNum.insertMany(initialDailyRandomNums);
    await UsedNum.insertMany(initialUsedNums);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch (e) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
    );
    console.log(e);
    process.exit();
  }
}

// see package.json scripts
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
