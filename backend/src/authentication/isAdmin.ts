import { NextFunction, Response } from "express";
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import { roles } from "../utils/data";

export default function isAdmin(req: any, res: Response, next: NextFunction) {
   const { role } = req.user;
   if (role !== roles[roles.admin]) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.NOT_ADMIN));
   }
   next();
}