import express, { Request, Response } from 'express';
import { UserAPI } from '../API';
import { currentUser } from '../middlewares/currentUser';

const router = express.Router();

router.get(UserAPI.currentUser, currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
