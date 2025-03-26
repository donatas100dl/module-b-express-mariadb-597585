const express = require("express");
import {
  pupulateDB,
  getPlaces,
  getPlaceByID,
  newReview,
  getPlaceReviews,
  findNearMe,
} from "./placesController";

const router = express.Router();

// router.get("/", getPlaces);
// router.post("/add", pupulateDB);
// router.get("/:id", getPlaceByID);
// router.post("/:id/reviews", newReview);
// router.get("/:id/reviews", getPlaceReviews);
router.get("/nearby", findNearMe);

export default router;
