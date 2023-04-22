import connectMongo from '../../../lib/connectMongo';
import { Mood } from '../../../models/mood.model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getMoods(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
  await connectMongo();
  console.log("Connected")
  try {
    if (req.method === 'POST') {
      const newMood = new Mood({
        value: req.body.value,
        note: req.body.note,
        user_id: req.body.user_id
      });
      try {
        const mood = await newMood.save();
        res.status(200).send(mood);
      } catch (err) {
        res.status(500).send(err)
        console.log(err);
      }
    }
    else {
      const moodsList = await Mood.find({user_id: req.query.user_id})
      if (moodsList){
        res.status(200).json(JSON.parse(JSON.stringify(moodsList)))
      }
      return;
    }

  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}



