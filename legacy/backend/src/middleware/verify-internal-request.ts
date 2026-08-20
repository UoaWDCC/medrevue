import type { NextFunction, Request, Response } from 'express';

export function verifyInternalRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const headerSecret = req.headers['x-internal-secret'];
  if (headerSecret !== process.env.INTERNAL_SECRET) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  next();
}
