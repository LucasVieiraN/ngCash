import { sign } from 'jsonwebtoken';

export function generateToken(subject: string) {
  const token = sign(
    {},
    'dd7340f1084f87b04ba710207e2cdbd0a274c42285632ed9a6343e7a8a7ebc66',
    { subject: subject, expiresIn: '1d' },
  );

  return token;
}
