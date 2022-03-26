require('dotenv').config({ path: `${__dirname}/../.env.local` });

const mongoose = require('mongoose');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.MONGODB_URI);

// import models
const DailyRandomNum = require('../models/DailyRandomNum');
const UsedNum = require('../models/UsedNum');

// low: UTC -12
// mid: UTC +0
// high: UTC +14
// highest: UTC +14 + 1 day
//   if UTC +14 requests new num at midnight - 2 API calls occur:
//    1. GH action for to add new random num each day
//    2. API call from UTC +14 user
//   GH action may be delayed and takes longer than API call from user
//     best to have random num for thatr day already set
//      set next days random number (highest) instead

const UTCDate = new Date();
// mid date - UTC 0 -> or close to it
const dateMid = UTCDate.toLocaleDateString('en-GB');
UTCDate.setDate(UTCDate.getDate() - 1);
const dateLow = UTCDate.toLocaleDateString('en-GB');
UTCDate.setDate(UTCDate.getDate() + 2);
const dateHigh = UTCDate.toLocaleDateString('en-GB');
UTCDate.setDate(UTCDate.getDate() + 1);
const dateHighest = UTCDate.toLocaleDateString('en-GB');

const lowDateObj = {
  date: dateLow,
  number: 1,
};

const midDateObj = {
  date: dateMid,
  number: 2,
};

const highDateObj = {
  date: dateHigh,
  number: 3,
};

const highestDateObj = {
  date: dateHighest,
  number: 4,
};

const initialDailyRandomNums = [
  lowDateObj,
  midDateObj,
  highDateObj,
  highestDateObj,
];

const initialUsedNums = {
  name: 'Used random numbers',
  usedNumbers: [1, 2, 3, 4],
};
async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  const DailyRandomNumDeletePromise = DailyRandomNum.deleteMany({});
  const UsedNumDeletePromise = UsedNum.deleteMany({});
  await Promise.all([DailyRandomNumDeletePromise, UsedNumDeletePromise]);

  console.log(
    'User Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'
  );
  process.exit();
}

async function loadData() {
  try {
    const DailyRandomNumInsertPromise = DailyRandomNum.insertMany(
      initialDailyRandomNums
    );
    const UsedNumInsertPromise = UsedNum.insertMany(initialUsedNums);
    await Promise.all([DailyRandomNumInsertPromise, UsedNumInsertPromise]);
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
