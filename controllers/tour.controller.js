import Tour from "../models/tour.model.js";
import qs from "qs";
import { APIFeatures } from "../utils/apiFeatures.js";

export const createTour = async (req, res) => {
  try {
    // Create new tour directly from request body
    // Mongoose will automatically ignore any fields not in the schema
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// export const aliasTopTours = (req, res, next) => {
//   req.queryOptions = {
//     limit: "5",
//     sort: "-ratingsAverage,price",
//     fields: "name,price,ratingsAverage,summary,difficulty",
//   };

  

//   next();
// };

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};


// utils/apiFeatures.js

export const getAllTours = async (req, res) => {
  const rawQuery =  req.query;

  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const total = await Tour.countDocuments(); // or .countDocuments(your filter)
    if (features.skip >= total) throw new Error("This page does not exist");
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    // const tour = await Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateTour = async (req, res) => {

  console.log("call");
  
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: {$toUpper:'$difficulty'},
          numTours:{$sum: 1},
          numRating:{$sum:"$ratingsQuantity"},
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort:{
          avgPrice : 1
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};


export const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2024

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
          // avgGroupSize: { $avg: "$maxGroupSize" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        year,
        monthlyStats: plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Add these to your tour.controller.js file

export const getToursWithin = async (req, res) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    if (!lat || !lng) {
      throw new Error(
        "Please provide latitude and longitude in the format lat,lng"
      );
    }

    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        data: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getDistances = async (req, res) => {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    if (!lat || !lng) {
      throw new Error(
        "Please provide latitude and longitude in the format lat,lng"
      );
    }

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
          duration: 1,
          difficulty: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        data: distances,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// import fs from "fs";

// import path from "path";
// import { fileURLToPath } from "url";

// Define __dirname equivalent for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const tours = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../dev-data/data/tours-simple.json"))
// );

// export const checkId = (req, res, next, val) => {
//   console.log(`the params middleware run for tour and id is ${val}`);

//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "invalid ID",
//     });
//   }

//   next();
// };

// export const validateTour = (req, res, next) => {
//   const { name, price } = req.body;

//   if (!name || !price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price"
//     });
//   }

//   next();
// };
