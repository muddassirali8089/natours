import Tour from "../models/tour.model.js";
import qs from "qs";
import { APIFeatures } from "../utils/apiFeatures.js";
import catchAsync from "./catchAsync.js";
import AppError from "../utils/AppError.js";
import Review from "../models/review.model.js";

import { deleteOne, createOne, updateOne, getAll, getOne } from "../controllers/handlerFactory.js";


/////////////////////////////////-----CREATE TOUR----/////////////////////////////////////////////


// ✅ Create tour using factory
export const createTour = createOne(Tour);



///////////////////////////////---IT RETURNS BEST TOUR---////////////////////////////////////////


export const aliasTopTours = catchAsync(async (req, res, next) => {
  req.queryOptions = {
    limit: "5",
    sort: "-ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty,duration",
  };

  console.log("✅ aliasTopTours middleware executed");
  console.log("✅ req.queryOptions:", req.queryOptions);

  next();
});




//////////////////////////////----- GET ALL TOOURS-------///////////////////////////////////////

// ✅ Get all tours using factory
export const getAllTours = getAll(Tour);

// Manual implementation (kept as reference/backup)
// export const getAllTours = catchAsync(async (req, res, next) => {
//   const rawQuery = req.queryOptions || req.query;

//   const features = new APIFeatures(Tour.find(), rawQuery)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const total = await Tour.countDocuments();
//   if (features.skip >= total) {
//     return next(new AppError("This page does not exist", 404));
//   }

//   const tours = await features.query;

//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: { tours },
//   });
// });

//////////////////////////////----- GET TOOUR BY ID -------///////////////////////////////////////

// ✅ Get tour by ID using factory with population
export const getTour = getOne(Tour, {
  path: "reviews",
  select: "review rating user createdAt -tour",
});

// Manual implementation (kept as reference/backup)
// export const getTour = catchAsync(async (req, res, next) => {
//   // 🔍 Debug: check the tour ID coming in
//   console.log("Tour ID:", req.params.id);

//   // 🔍 Debug: check if reviews exist for this tour
//   const reviews = await Review.find({ tour: req.params.id });
//   console.log("Reviews found:", reviews);

//   // Now fetch the tour + populate reviews
//   const tour = await Tour.findById(req.params.id).populate({
//     path: "reviews",
//     select: "review rating user createdAt -tour",
//   });

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });

//////////////////////////////----- UPDATE TOUR -------///////////////////////////////////////

// ✅ Update tour using factory
export const updateTour = updateOne(Tour);



//////////////////////////////----- DELETE TOUR -------///////////////////////////////////////


export const deleteTour = deleteOne(Tour);
// export const deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

//////////////////////////////----- GET TOOUR STATS-------///////////////////////////////////////

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

//////////////////////////////----- GET MONTHLY PLAN -------///////////////////////////////////////

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // e.g. 2024

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
});

//////////////////////////////----- GEOSPATIAL QUERIES -------///////////////////////////////////////

// 🌍 Find tours within a specified radius
// URL: /tours-within/:distance/center/:latlng/unit/:unit
// Example: /tours-within/233/center/34.111745,-118.113491/unit/mi
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Validate coordinates
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  // Convert distance to radians
  // Earth radius: 3963.2 miles, 6378.1 kilometers
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  console.log(`🌍 Searching for tours within ${distance} ${unit} of coordinates [${lat}, ${lng}]`);
  console.log(`📏 Radius in radians: ${radius}`);

  // Find tours within the specified radius using $geoWithin
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius] // Note: MongoDB expects [lng, lat] format
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

// 🗺️ Calculate distances from a point to all tours
// URL: /tours-distances/:latlng/unit/:unit
// Example: /tours-distances/34.111745,-118.113491/unit/mi
export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Validate coordinates
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  // Distance multiplier for unit conversion
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // Convert meters to miles or kilometers

  console.log(`📍 Calculating distances from coordinates [${lat}, ${lng}] in ${unit}`);

  // Use aggregation pipeline with $geoNear for distance calculation
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1] // Convert to numbers and use [lng, lat]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier // Convert from meters to specified unit
      }
    },
    {
      $project: {
        distance: 1,
        name: 1,
        startLocation: 1,
        ratingsAverage: 1,
        price: 1,
        difficulty: 1,
        duration: 1
      }
    },
    {
      $sort: { distance: 1 } // Sort by distance (closest first)
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});




/////////////////////////////////////// END /////////////////////////////////////////////////////////































// Add these to your tour.controller.js file

// export const getToursWithin = async (req, res) => {
//   try {
//     const { distance, latlng, unit } = req.params;
//     const [lat, lng] = latlng.split(",");

//     if (!lat || !lng) {
//       throw new Error(
//         "Please provide latitude and longitude in the format lat,lng"
//       );
//     }

//     const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

//     const tours = await Tour.find({
//       startLocation: {
//         $geoWithin: {
//           $centerSphere: [[lng, lat], radius],
//         },
//       },
//     });

//     res.status(200).json({
//       status: "success",
//       results: tours.length,
//       data: {
//         data: tours,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

// export const getDistances = async (req, res) => {
//   try {
//     const { latlng, unit } = req.params;
//     const [lat, lng] = latlng.split(",");

//     if (!lat || !lng) {
//       throw new Error(
//         "Please provide latitude and longitude in the format lat,lng"
//       );
//     }

//     const multiplier = unit === "mi" ? 0.000621371 : 0.001;

//     const distances = await Tour.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [lng * 1, lat * 1],
//           },
//           distanceField: "distance",
//           distanceMultiplier: multiplier,
//         },
//       },
//       {
//         $project: {
//           distance: 1,
//           name: 1,
//           duration: 1,
//           difficulty: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       status: "success",
//       data: {
//         data: distances,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

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
