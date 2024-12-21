import { Request, Response } from "express";
import User from "../models/userModel";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import Exception from "../HttpResponse/Exception";
import Statistical from "../models/statisticalModel";

export const createStatistical = async (req: Request, res: Response) => {
   const { code, revenue, spend, dateOfWeek } = req.body;
   try {
      const user: any = await User.findOne({ where: { code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      await Statistical.create({
         idUser: user.id,
         revenue: revenue,
         spend: spend,
         dateOfWeek: dateOfWeek
      });
      return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, MessageResponse.SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const getAllByUser = async (req: Request, res: Response) => {
   const { code } = req.user;
   try {
      const user: any = await User.findOne({ where: { code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      const response = await Statistical.findAll({ where: { idUser: user.id } });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}
