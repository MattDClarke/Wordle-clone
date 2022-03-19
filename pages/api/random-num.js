// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../utils/dbConnect';
import NumOfTheDay from '../../models/DailyRandomNum';
import catchErrors from '../../utils/errorHandler';

export default catchErrors(async (req, res) => {
  if (req.method === 'GET') {
    await dbConnect();
    const result = await NumOfTheDay.findOne({ date: req.query.date });
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
