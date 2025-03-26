import { PrismaClient, places, reviews } from "@prisma/client";
import { error } from "console";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

export const pupulateDB = async (req: Request, res: Response) => {
  try {
    const places: places[] = req.body;

    if (places && places.length) {
      places.forEach((place) => {
        let data: any = {
          name: place.name,
          address: place.address,
          latitude: place.latitude,
          longitude: place.longitude,
          description: place.description,
          rating: place.rating,
        };
        prisma.places
          .create({
            data: data,
          })
          .then((response) => {
            console.log(response);
          });
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaces = async (req: Request, res: Response) => {
  try {
    var { q, rating_from, rating_to, sort_by } = req.query;
    var places = null;
    if (
      sort_by != "rating_desc" ||
      sort_by != "popularity" ||
      sort_by != "rating_asc" ||
      sort_by != "newest"
    ) {
      sort_by = "asc";
    } else if (sort_by != "rating_desc") {
      sort_by = "desc";
    } else if (sort_by != "newest") {
      sort_by = sort_by;
    } else {
      sort_by = "asc";
    }

    if ((sort_by = "newest")) {
      places = await prisma.places.findMany({
        where: {
          name: {
            startsWith: q,
          },
          rating: {
            lte: parseFloat(rating_to) || 5,
            gte: parseFloat(rating_from) || 0,
          },
        },
        orderBy: [
          {
            created_at: "desc",
          },
          {
            updated_at: "desc",
          },
        ],
      });
    } else {
      places = await prisma.places.findMany({
        where: {
          name: {
            startsWith: q,
          },
          rating: {
            lte: parseFloat(rating_to) || 5,
            gte: parseFloat(rating_from) || 0,
          },
        },
        orderBy: {
          name: sort_by,
        },
      });
    }

    if (!places) {
      res.status(404).json({ message: "not Found" });
      return;
    }
    res.status(200).json({
      total: places.length,
      per_page: places.length,
      curent_page: 1,
      data: places,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaceByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(404).json({ error: "Lankytina vieta neegzistuoja" });
      return;
    }
    const place: any = await prisma.places.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        address: true,
        longitude: true,
        latitude: true,
        rating: true,
      },
    });
    if (!place) {
      res.status(501).json({ error: "Faild to get" });
      return;
    }
    res.status(200).json({
      place,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newReview = async (req: Request, res: Response) => {
  try {
    const { user_name, comment, rating } = req.body;

    if (!user_name || !comment || !rating) {
      res.status(422).json({
        error: "Validation failed",
        user_name: user_name || "this vield is required",
        comment: comment || "this vield is required",
        rating: rating || "this vield is required",
      });
      return;
    }

    if (!req.params.id) {
      res.status(404).json({ error: "Lankytina vieta neegzistuoja" });
      return;
    }
    const place = await prisma.places.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!place) {
      res.status(501).json({ error: "Faild to get" });
      return;
    }
    const data: any = {
      user_name,
      comment,
      rating,
      place_id: place.id,
    };
    const review = await prisma.reviews.create({ data: data });

    if (!review) {
      res.status(501).json({ error: "Faild to get review" });
      return;
    }
    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaceReviews = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(404).json({ error: "Lankytina vieta neegzistuoja" });
      return;
    }

    const reviews: reviews[] = await prisma.reviews.findMany({
      where: {
        place_id: parseInt(id),
      },
    });
    if (!reviews) {
      res.status(501).json({ error: "Faild to get review" });
      return;
    }
    res.status(201).json({
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findNearMe = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius, category } = req.query;
    //acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371

    //cover to km
    var radius_km = radius * 100 || 10 * 100; /// 10 yra numatyta

    const places: any[] = await prisma.places.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        rating: true,
      },
    });
    var placesNear: places[] | null = [];

    places.forEach((place) => {
      //cauculate distance
      let lat1 = latitude;
      let lon1 = longitude;
      let lat2 = place.latitude;
      let lon2 = place.longitude;
      let distance =
        Math.acos(
          Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
        ) * 6371;
      if (radius_km >= distance) {
        placesNear.push(place);
      }
    });
    if (placesNear.length === 0) {
      res.status(404).json({
        error: "Lankytina vieta neegzistuoja",
      });
    }
    res.status(200).json({ placesNear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
