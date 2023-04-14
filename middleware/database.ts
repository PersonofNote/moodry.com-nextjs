import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';


const client = new MongoClient(`mongodb+srv://weatherwax:aOFxkXpkCTnfAi99@moodryserverless.g0nqi.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req: any, res: any, next:any) {
  req.dbClient = client;
  req.db = client.db('MoodryServerless');
  return next();
}

const dbConnection = nextConnect();

dbConnection.use(database);

export default dbConnection;