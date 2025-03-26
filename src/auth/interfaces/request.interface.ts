import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  user?: JwtPayload;
  headers: {
    'x-api-key'?: string;
  };
} 