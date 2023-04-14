import nextConnect from 'next-connect';
import dbConnection from '../../../middleware/database';

const handler = nextConnect();

handler.use(dbConnection);

handler.get(async (req, res) => {
    console.log(`🔴🔴🔴🔴🔴`)
    let doc = await req.db.collection('users').findOne()
    console.log(doc);
    res.json(doc);
});

export default handler;