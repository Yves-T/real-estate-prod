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

export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;

  const properties = await prisma.property.findMany({
    where: { tenants: { some: { cognitoId } } },
    include: { location: true },
  });

  const propertiesWithFormattedLocation = await Promise.all(
    properties.map(async (property) => {
      if (property) {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      }
    })
  );
  res.json(propertiesWithFormattedLocation);
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, propertyId } = req.params;
  const tenant = await prisma.tenant.findUnique({
    where: { cognitoId },
    include: { favorites: true },
  });
  const propertyIdNumber = Number(propertyId);
  const existingFavorites = tenant?.favorites || [];

  if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: { favorites: { connect: { id: propertyIdNumber } } },
      include: { favorites: true },
    });

    res.json(updateTenant);
  } else {
    res.status(409).json({ message: "Property already added as favorite" });
  }
};

export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, propertyId } = req.params;
  const propertyIdNumber = Number(propertyId);
  const updatedTenant = await prisma.tenant.update({
    where: { cognitoId },
    data: { favorites: { disconnect: { id: propertyIdNumber } } },
    include: { favorites: true },
  });

  res.json(updatedTenant);
};
