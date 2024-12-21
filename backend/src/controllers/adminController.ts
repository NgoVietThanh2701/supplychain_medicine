import { Request, Response } from "express";
import User from "../models/userModel";
import { roles } from "../utils/data";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import Exception from "../HttpResponse/Exception";
import { Op } from "sequelize";
import sendMail from "../services/sendMail";

export const listUser = async (req: Request, res: Response) => {
   try {
      const response = await User.findAll({
         attributes: { exclude: ['password', 'updatedAt', 'otp', 'verifyOTP'] },
         where: { [Op.and]: { verifyOTP: true, active: true, role: { [Op.ne]: roles[roles.admin] } } }
      });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}

export const singleUser = async (req: Request, res: Response) => {
   const code = req.params.code;
   try {
      const user: any = await User.findOne({ where: { code: code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      const response = await User.findOne({
         attributes: { exclude: ['password', 'updatedAt', 'otp', 'verifyOTP'] },
         where: { id: user.id }
      });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}

export const requestUsers = async (req: Request, res: Response) => {
   try {
      const response = await User.findAll({
         attributes: { exclude: ['password', 'updatedAt', 'otp', 'verifyOTP'] },
         where: { [Op.and]: { verifyOTP: true, active: false, role: { [Op.ne]: roles[roles.admin] } } }
      });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}

export const addUser = async (req: Request, res: Response) => {
   const code = req.params.code;
   try {
      const user: any = await User.findOne({ where: { code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      await User.update({ active: true }, { where: { id: user.id } });
      const mailOptions = {
         from: `"Supply chain 👻" ${process.env.EMAIL_ADMIN}`,
         to: user.email,
         subject: 'Chúc mừng, Tài khoản của bạn đã được phê duyệt',
         text: `Vui lòng đăng nhập tại http://localhost:3000/login/${user.role}
            from Supply Chain Team
         `,
      };
      await sendMail(mailOptions);
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.APPROVE_ACCOUNT_SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}

export const deleteRequest = async (req: Request, res: Response) => {
   const code = req.params.code;
   try {
      const user: any = await User.findOne({ where: { code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      await User.destroy({ where: { id: user.id } });
      const mailOptions = {
         from: `Supply chain 👻${process.env.EMAIL_ADMIN}`,
         to: user.email,
         subject: 'Rất tiếc, tài khoản của bạn đã bị xóa do thông tin đăng ký không đúng',
         text: `from Supply Chain Team`,
      };
      await sendMail(mailOptions);
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message)
   }
}
