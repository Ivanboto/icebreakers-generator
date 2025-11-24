import { Request, Response } from "express";

export const getHealth = (req: Request, res: Response) => {
  const response = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    name: "Icebreakers Generator API",
  };
  return res.status(200).json(response);
};

export default { getHealth };
