import argon2 from 'argon2';
import express, { type Request, type Response } from 'express';
import type { HydratedDocument } from 'mongoose';
import { type IUser, type IUserLogin, User } from '../../models/User';

const router = express.Router();

router.post(
  '/register',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const userBody = _req.body as IUser;

      //check if user exists
      const emailExists: HydratedDocument<IUser> | null = await User.findOne({
        email: userBody.email,
      });

      if (emailExists) {
        res
          .status(409)
          .send(`Email ${userBody.email} has already been registered`);
        return;
      }

      //generate hashed password before storing
      const hashedPassword = await argon2.hash(userBody.password);

      const user = await User.create({
        username: userBody.username,
        email: userBody.email,
        password: hashedPassword,
      });

      res.status(201).json({ id: user._id });
    } catch (error) {
      //NOTE: you may alternatively catch the mongoose server error for duplicate keys

      // if (error instanceof mongoose.mongo.MongoServerError) {
      //   res
      //     .status(409)
      //     .send(
      //       `${Object.keys(error.keyValue)[0]} ${Object.values(error.keyValue)[0]} already exists.`,
      //     );
      //   return;
      // }

      res.sendStatus(500);
    }
  },
);

router.post('/login', async (_req: Request, res: Response): Promise<void> => {
  try {
    const userBody = _req.body as IUserLogin;

    const emailExists: HydratedDocument<IUser> | null = await User.findOne({
      email: userBody.email,
    });

    if (!emailExists) {
      res.status(404).send(`Email ${userBody.email} was not found.`);
      return;
    }

    const comparePasswords = await argon2.verify(
      emailExists.password,
      userBody.password,
    );

    if (!comparePasswords) {
      res.status(400).send('Passwords do not match.');
      return;
    }

    res.status(200).json({ id: emailExists._id });
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
