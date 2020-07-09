import express from 'express';
import { UserAPI } from '../API';

const router = express.Router();

router.post(UserAPI.signOut, (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signOutRouter };
