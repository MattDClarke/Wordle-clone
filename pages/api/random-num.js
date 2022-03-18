// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../lib/dbConnect';
import NumOfTheDay from '../../models/DailyRandomNum';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    const result = await NumOfTheDay.findOne({ date: req.query.date });
    res.status(200).json({ randomNum: result.number });
  } else {
    res.status(405).json('error - not allowed');
  }
}
