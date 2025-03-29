import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {
  CreateUserSchema,
  createRoomSchema,
  SignInSchema,
} from '@repo/common/types';

const app = express();

app.post('/room', middleware, (req: Request, res: Response) => {
  const data = createRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({
      message: 'Incorrect inputs',
    });
    return;
  }
  //db call
  res.json({
    message: 'room Id',
  });
});

app.post('/signup', (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: 'Incorrect Inputs' });
    return;
  }
  res.json({ userId: '123' });
});

app.post('/signin', (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: 'Incorrect Inputs' });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
});

app.listen(3001, () => {
  console.log('listening on port 3001');
});
