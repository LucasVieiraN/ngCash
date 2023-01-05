import { HttpException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
}

export function EnsureAuthenticateMiddleware(
  req: Request,
  res: Response,
  next: () => NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new HttpException('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(
      token,
      'dd7340f1084f87b04ba710207e2cdbd0a274c42285632ed9a6343e7a8a7ebc66',
    ) as unknown as TokenPayload;

    req.user_id = sub;

    next();
  } catch {
    throw new HttpException('Invalid token', 400);
  }
}
