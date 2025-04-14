import { PrismaClient } from "../../prisma/src/generated/prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  const leases = await prisma.lease.findMany({
    include: { tenant: true, property: true },
  });

  res.json(leases);
};

export const getLeasePayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const payments = await prisma.payment.findMany({
    where: { leaseId: Number(id) },
  });

  res.json(payments);
};
