import express, { type Request, type Response } from 'express';
const router = express.Router();

// Test API route
router.get('/hello', (_req: Request, res: Response): void => {
  res.json({
    message: 'Hello, World!',
    data: {
      greeting: 'Welcome to the Auckland Med Revue API',
      info: 'This endpoint provides basic information about the Auckland Med Revue.',
    },
  });
});

router.get('/test-session', (req: Request, res: Response) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.json({ views: req.session.views });
});

export default router;
