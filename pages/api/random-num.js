// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../utils/dbConnect';
import NumOfTheDay from '../../models/DailyRandomNum';
import catchErrors from '../../utils/errorHandler';

export default catchErrors(async (req, res) => {
  if (req.method === 'GET') {
    const { date } = req.query;
    // basic test for correct input
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
      return res.status(500).json('error - input error');
    }
    await dbConnect();
    const result = await NumOfTheDay.findOne({ date });
    // console.log(result);
    if (!result) {
      res.status(500).json('error - database error');
    } else {
      res.status(200).json({ randomNum: result.number });
    }
  } else {
    res.status(405).json('error - not allowed');
  }
});
