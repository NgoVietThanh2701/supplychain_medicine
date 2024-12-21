import { Request, Response } from "express";
import HttpStatusCode from "../HttpResponse/HttpStatusCode";
import { DataResponse, MessageResponse } from "../HttpResponse/DataResponse";
import Category from "../models/categoryModel";
import Exception from "../HttpResponse/Exception";

export const createCategory = async (req: Request, res: Response) => {
   const { name } = req.body;
   if (!name || name === '') {
      return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.MISSING_INPUT));
   }
   try {
      await Category.create({ name });
      return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, MessageResponse.SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const getCategories = async (req: Request, res: Response) => {
   try {
      const response = await Category.findAll({ attributes: { exclude: ['id', 'updatedAt'] } });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS, response));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const updateCategory = async (req: Request, res: Response) => {
   const name = req.body.name;
   const code = req.params.code;
   try {
      const category: any = await Category.findOne({ where: { code } });
      if (!category) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ERROR_OCCURRED));
      await Category.update({ name }, { where: { id: category.id } });
      return res.status(HttpStatusCode.INSERT_OK).json(DataResponse(false, MessageResponse.SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}

export const deleteCategory = async (req: Request, res: Response) => {
   const code = req.params.code;
   const category: any = await Category.findOne({ where: { code } });
   if (!category) return res.status(HttpStatusCode.BAD_REQUEST).json(DataResponse(true, MessageResponse.ERROR_OCCURRED));
   try {
      await Category.destroy({ where: { id: category.id } });
      return res.status(HttpStatusCode.OK).json(DataResponse(false, MessageResponse.SUCCESS));
   } catch (error: any) {
      throw new Exception(error.message);
   }
}