import { Request, Response } from "express";

// Extend Response to include dataObject
declare global {
  namespace Express {
    interface Response {
      dataObject?: {
        statusCode?: number;
        message?: string;
        data?: unknown;
        pagination?: unknown;
      };
    }
  }
}

export const apiResponseHandler = (_req: Request, res: Response) => {
  const result = res.dataObject;
  if (!result) {
    res.status(200).json({ success: true, message: "Success" });
    return;
  }

  const response: Record<string, unknown> = {
    success: true,
    message: result.message || "Success",
  };

  if (result.data !== undefined) response.data = result.data;
  if (result.pagination !== undefined) response.pagination = result.pagination;

  res.status(result.statusCode || 200).json(response);
};
