import { Response, Request } from 'express';

export interface CustomRequest extends Request {
  user?: any;
  ips: string[];
}

export interface CustomResponse extends Response {
  status(code: number): this;
  json(data: any): this;
} 