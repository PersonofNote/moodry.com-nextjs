import connectMongo from '../../../lib/connectMongo';
import { User } from '../../../models/user.model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getUsers(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    console.log('Finding User');
    const users = await User.find();
    console.log('CREATED DOCUMENT');

    res.json(JSON.parse(JSON.stringify(users)));
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}