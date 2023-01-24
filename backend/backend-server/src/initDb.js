import mongoose from 'mongoose';

const mongoPort = process.env.MONGO_PORT || 27017;
const mongoHost = process.env.MONGO_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'isee-db';
const fullUri = `mongodb://${mongoHost}:${mongoPort}/${dbName}`;

export default (callback) => {
  mongoose.set('strictQuery', false);
  mongoose.connect(fullUri);

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.log('failed to connect: ' + err)
    callback(err);
  });

  db.once('open', async () => {
    console.log('DB connection successful');
    callback(null);
  });
}