import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return res.status(400).json({
        status: "fail",
        message: error.errors ? error.errors[0].message : "Validation error",
        errors: error.errors,
      });
    }
  };