import dbConnect from '../../utils/dbConnect';
import NumOfTheDay from '../../models/DailyRandomNum';
import UsedNum from '../../models/UsedNum';

const wordListLen = 12950;

// gets random num between 0 and (maxVal - 1) that is not in the usedNumsArr
function getUnUsedRandomNum(usedNumsArr, maxVal) {
  const usedNumsArrLen = usedNumsArr.length;
  const hash = {};
  for (let i = 0; i < usedNumsArrLen; i += 1) {
    hash[usedNumsArr[i]] = 1;
  }

  let gotRandomNum = false;
  let randomNum;

  while (!gotRandomNum) {
    // loop until you get an unused random number
    randomNum = Math.floor(Math.random() * maxVal);

    if (!hash[randomNum]) {
      gotRandomNum = true;
    }
  }

  return randomNum;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;
      if (authorization === `Bearer ${process.env.ACTION_FETCH_RANDOM_NUM}`) {
        await dbConnect();

        // get array of used random nums
        let usedRandomNums = await UsedNum.findOne({
          name: 'Used random numbers',
        });
        let usedRandomNumsArr = usedRandomNums.usedNumbers;
        const usedRandomNumsArrLen = usedRandomNumsArr.length;

        // reset random nums used every ~year
        if (usedRandomNumsArrLen > 365) {
          const lastUsedRandomNumsRaw = await NumOfTheDay.find();

          const lastUsedRandomNums = lastUsedRandomNumsRaw.map(
            (el) => el.number
          );

          usedRandomNums = await UsedNum.findOneAndUpdate(
            { name: 'Used random numbers' },
            { usedNumbers: lastUsedRandomNums },
            // return the modified document rather than the original
            { new: true }
          );
        }

        usedRandomNumsArr = usedRandomNums.usedNumbers;

        const unUsedRandomNum = getUnUsedRandomNum(
          usedRandomNumsArr,
          wordListLen
        );

        // get date for new day UTC +14 (api called by GitHub action at 10am UTC / midnight UTC +14)
        // set next day (UTC+14 + 1 day)
        const UTCDate = new Date();

        UTCDate.setDate(UTCDate.getDate() + 2);
        // get format: yyyy/mm/dd
        const dateHighest = UTCDate.toLocaleDateString('en-GB');
        UTCDate.setDate(UTCDate.getDate() - 4);
        const dateLow = UTCDate.toLocaleDateString('en-GB');

        const highestDateObj = {
          date: dateHighest,
          number: unUsedRandomNum,
        };

        // add new random num
        const newNumOfTheDayAddPromise = await new NumOfTheDay(
          highestDateObj
        ).save();

        // add new random num to UsedNum collection - replace prev array
        usedRandomNumsArr.push(unUsedRandomNum);

        const addNewRandomNumPromise = await UsedNum.findOneAndUpdate(
          { name: 'Used random numbers' },
          { usedNumbers: usedRandomNumsArr }
        );

        // delete oldest random num
        const oldNumOfTheDayDeletePromise = await NumOfTheDay.findOneAndDelete({
          date: dateLow,
        });

        await Promise.all([
          newNumOfTheDayAddPromise,
          addNewRandomNumPromise,
          oldNumOfTheDayDeletePromise,
        ]);

        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Error setting new daily random numbers',
      });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    });
  }
}
