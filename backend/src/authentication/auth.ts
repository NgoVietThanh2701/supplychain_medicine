import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatusCode from '../HttpResponse/HttpStatusCode';
import { DataResponse, MessageResponse } from '../HttpResponse/DataResponse';

export default function checkToken(req: any, res: Response, next: NextFunction) {
   if (req.url.toLowerCase().trim() === '/api/v1/auth/login' || req.url.toLowerCase().trim() === '/api/v1/auth/register' ||
      req.url.toLowerCase().trim() === '/api/v1/auth/verify-otp' || req.url.toLowerCase().trim() === '/api/v1/auth/refresh-token' || req.url.toLowerCase().trim().includes('/api/v1/auth/get-info-user/')) {
      next();
      return;
   }
   // other request -> validate token
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) return res.status(HttpStatusCode.UNAUTHORIZED).json(DataResponse(true, MessageResponse.NO_TOKEN));
   jwt.verify(token, process.env.SECRET_KEY || '', (err: any, user: any) => {
      if (err) return res.status(HttpStatusCode.UNAUTHORIZED).json(DataResponse(true, MessageResponse.UNAUTHORIZED));
      req.user = user;
      next();
   });
}

