import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  const tenant = await prisma.tenant.findUnique({
    where: { cognitoId },
    include: { favorites: true },
  });

  if (tenant) {
    res.json(tenant);
  } else {
    res.status(404).json({ message: "Tenant not found" });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, name, email, phoneNumber } = req.body;
  const tenant = await prisma.tenant.create({
    data: { cognitoId, name, email, phoneNumber },
  });

  res.json(tenant);
};

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;
  const { name, email, phoneNumber } = req.body;
  const updateTenant = await prisma.tenant.update({
    where: { cognitoId },
    data: { name, email, phoneNumber },
  });

  res.json(updateTenant);
};
