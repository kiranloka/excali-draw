import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import bcrypt from 'bcrypt';
import { middleware } from './middleware';
import {
  CreateUserSchema,
  createRoomSchema,
  SignInSchema,
} from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

const app = express();
interface AuthenticatedRequest extends Request {
  userId?: string;
}

app.post(
  '/room',
  middleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedData = createRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({
        message: 'Incorrect inputs',
      });
      return;
    }
    const userId = req.userId;
    try {
      const room = await prismaClient.room.create({
        data: {
          slug: parsedData.data.name,
          adminId: userId,
        },
      });
      res.status(200).json({
        message: 'Room created',
        roomId: room.id,
      });
    } catch (e) {
      res.status(411).json({
        message: 'Room already exists with this name!',
      });
    }
  }
);

app.post('/signup', async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: 'Incorrect inputs',
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.userId,
    });
  } catch (e) {
    res.status(411).json({
      message: 'User already exists with this username',
    });
  }
});

app.post('/signin', async (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: 'Incorrect inputs',
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: data.data.username,
      password: data.data.password,
    },
  });
  if (!user) {
    res.json({
      message: 'Not authorized!',
    });
    return;
  }
  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({ token });
});

app.listen(3001, () => {
  console.log('listening on port 3001');
});
