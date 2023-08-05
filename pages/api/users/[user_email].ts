import connectMongo from '../../../lib/connectMongo';
import { User } from '../../../models/user.model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
 export default async function getUserByEmail(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
    console.log("QUERY")
    console.log(req.query)
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    console.log('Finding User');
    const user = await User.findOne({email: req.query.user_email});
    res.json(JSON.parse(JSON.stringify(user)));
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}