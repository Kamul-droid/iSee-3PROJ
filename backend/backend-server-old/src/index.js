import authController from './auth/auth.controller.js';
import express from 'express';
import initDb from './initDb.js';
import userController from './users/user.controller.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authController);

app.use('/users', userController);

const port = process.env.BACKEND_PORT || '8080'

app.listen(port, () => {
  initDb((err) => {
    if (err) {
      console.log('Db initialization error');
      console.log(err);
      process.exit(1);
    }
  })
  console.log(`Server listening on ${port}, ready to handle requests`);
})

app.get('/', (req, res) => {
  res.send('this is a root');
})

app.get('/test', (req, res) => {
  res.send('this is a test');
})

app.all('*', (req, res) => {
  res.status(404).send('Endpoint not found');
})

export default app;