import connectMongo from '../../../lib/connectMongo';
import { Mood } from '../../../models/mood.model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getMoods(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    console.log('Finding User');
    const moodsList = await Mood.find({user_id: req.query.user_id})
    if (moodsList){
      res.status(200).json(JSON.parse(JSON.stringify(moodsList)))
    }
    return;

  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
