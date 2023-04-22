import connectMongo from '../../../../lib/connectMongo';
import { Mood } from '../../../../models/mood.model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getMoods(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
  await connectMongo();
  try {
    if (req.method === 'PATCH') {
        console.log(req.body)
        try {
            await Mood.updateOne(
              { _id : req.body._id},
              { $set: { "note" : req.body.note } }
           );
           res.status(200).send({message: "Updated"})
         } catch (e) {
            print(e);
            res.status(500).send({message: "Something went wrong"})
         }
    }else if (req.method === 'POST') {
        console.log("Deleting")
        try {
          await Mood.deleteOne(
            {_id: req.body._id},
        )
        res.status(200).send({})
        } catch (err) {
          res.status(500).send(err)
          console.log(err)
        }
      }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}