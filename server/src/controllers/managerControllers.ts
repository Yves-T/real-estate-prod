import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;
  const manager = await prisma.manager.findUnique({
    where: { cognitoId },
  });

  if (manager) {
    res.json(manager);
  } else {
    res.status(404).json({ message: "Manager not found" });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, name, email, phoneNumber } = req.body;
  const manager = await prisma.manager.create({
    data: { cognitoId, name, email, phoneNumber },
  });

  res.json(manager);
};

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;
  const { name, email, phoneNumber } = req.body;
  const updateManager = await prisma.manager.update({
    where: { cognitoId },
    data: { name, email, phoneNumber },
  });

  res.json(updateManager);
};
