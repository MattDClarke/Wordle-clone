// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../utils/dbConnect';
import NumOfTheDay from '../../models/DailyRandomNum';
import catchErrors from '../../utils/errorHandler';

export default catchErrors(async (req, res) => {
  if (req.method === 'GET') {
    const { date } = req.query;
    // basic check for correct input
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return res.status(500).json({
        message: 'Input error',
      });
    }
    await dbConnect();
    const result = await NumOfTheDay.findOne({ date });
    if (!result) {
      res.status(500).json({
        message: 'Database error',
      });
    } else {
      res.status(200).json({ randomNum: result.number });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    });
  }
});
