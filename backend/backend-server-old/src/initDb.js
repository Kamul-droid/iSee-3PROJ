import mongoose from 'mongoose';

const mongoPort = process.env.MONGO_PORT || 27017;
const mongoHost = process.env.MONGO_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'isee-db';
const mongoUser = process.env.MONGO_USER || 'root';
const mongoPassword = process.env.MONGO_PASSWORD || 'pwd';
const authSource = 'authSource=admin';
const auth = `${mongoUser}:${mongoPassword}@`;
const fullUri = `mongodb://${auth}${mongoHost}:${mongoPort}/${dbName}?${authSource}`;

console.log(fullUri)

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