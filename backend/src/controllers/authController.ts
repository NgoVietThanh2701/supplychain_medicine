import User from "../models/userModel";
import { Request, Response } from 'express';
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import jwt from 'jsonwebtoken';
import Exception from "../HttpResponse/Exception";
import { Op } from "sequelize";
import { validationResult } from 'express-validator';
import { hashPassword, comparePassword } from "../utils/bcryptPassword";
import { roles } from "../utils/data";
import sendMail from "../services/sendMail";

export const register = async (req: Request, res: Response) => {
   const result = validationResult(req);
   if (!result.isEmpty()) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: result.array() });
   }
   const { name, email, password, longitude, latitude, addressWallet, role } = req.body;
   if (!name || !email || !password || !addressWallet || !role || !longitude || !latitude) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.MISSING_INPUT));
   }
   try {
      const user = await User.findOne({ where: { [Op.and]: [{ email: email }, { role: role }, { verifyOTP: true }] } });
      if (user) {
         return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_EXISTS));
      } else { // Create new user: user create account but user dont verify otp and then user register again new account.
         // => remove user and then create new user
         const existsUser: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { verifyOTP: false }] } });
         if (existsUser) {
            await User.destroy({ where: { id: existsUser.id } });
         }
         const otp = Math.floor(100000 + Math.random() * 900000);
         const instanceUser: any = await User.create({
            name: name,
            email: email,
            password: hashPassword(password.toString()),
            addressWallet: addressWallet,
            longitude,
            latitude,
            role: role,
            otp: otp
         });
         const mailOptions = {
            from: `Supply chain 👻" ${process.env.EMAIL_ADMIN}`,
            to: email,
            subject: 'OTP for Registration',
            text: `Your OTP is: ${otp}`,
         };
         await sendMail(mailOptions);
         if (instanceUser.role === roles[roles.customer]) {
            await User.update({ active: true }, { where: { id: instanceUser.id } });
         }
         return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, 'Vui lòng nhập OTP xác thực đã gửi trong email của', instanceUser.role));
      }
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const verifyOTP = async (req: Request, res: Response) => {
   const { email, otp, role } = req.body;
   try {
      const user: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { role: role }] } });
      if (!user) {
         return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      } else if (Number.parseInt(user.otp) === Number.parseInt(otp)) {
         await User.update({ verifyOTP: true }, {
            where: { email: email }
         })
         if (role === roles[roles.customer]) {
            return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, MessageResponse.REGISTER_SUCCESS))
         } else if (role === roles[roles.factory] || role === roles[roles.agent] || role === roles[roles.deliveryhub]) {
            return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, MessageResponse.REVIEWED_ACCOUNT));
         }
      } else {
         return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.WRONG_OTP));
      }
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const login = async (req: Request, res: Response) => {
   const { email, password, role } = req.body;
   if (!email || !password) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.MISSING_INPUT));
   try {
      // get user with email and has been verify OTP
      const user: any = await User.findOne({ where: { [Op.and]: [{ email: email }, { verifyOTP: true }, { role: role }] } });
      if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      // check password
      const isCorrectPassword = comparePassword(password.toString(), user.password);
      if (!isCorrectPassword) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.WRONG_PASSWORD));
      // check status of user
      if (user.active) { //login success
         const token = jwt.sign({ code: user.code, role: user.role }, process.env.SECRET_KEY || '', { expiresIn: process.env.TOKEN_LIFE });
         return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.LOGIN_SUCCESS, token));
      } else {
         return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.REVIEWED_ACCOUNT));
      }
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const getMe = async (req: Request, res: Response) => {
   const { code } = req.user;
   try {
      const user: any = await User.findOne({ where: { code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      const response = await User.findOne(
         {
            where: { id: user.id },
            attributes: { include: ['code', 'name', 'email', 'longitude', 'latitude', 'addressWallet', 'role'] }
         });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const getInfoUser = async (req: Request, res: Response) => {
   const code = req.params.code;
   try {
      const user: any = await User.findOne({ where: { code: code } });
      if (!user) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ACCOUNT_NO_EXISTS));
      const response = await User.findOne(
         {
            where: { id: user.id },
            attributes: { include: ['code', 'name', 'email', 'addressWallet', 'role', 'longitude', 'latitude'] }
         });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}
