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
import qs from "qs";
import Tour from "../models/tour.model.js";


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



export const aliasTopTours = (req, res, next) => {
  req.queryOptions = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty'
  };

  console.log("✅ aliasTopTours middleware executed");
  console.log("✅ req.queryOptions:", req.queryOptions);

  next();
};

export const getAllTours = async (req, res) => {

  console.log(req.queryOptions);
  
  const rawQuery = req.queryOptions || req.query;

  // Parse and nest filters using qs
  let queryStr = qs.stringify(rawQuery);
  const formattedQuery = qs.parse(queryStr);

  console.log("✅ Formatted query (qs):", formattedQuery);

  try {
    // ❌ Remove special params before querying MongoDB
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete formattedQuery[field]);

    // 🔄 Convert to MongoDB query with operators like $gte
    queryStr = JSON.stringify(formattedQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(queryStr);
    console.log("✅ Final MongoDB Query:", queryObj);

    // 🔍 Execute query
    let query = Tour.find(queryObj);

    // ✅ Apply Sorting
    if (typeof rawQuery.sort === "string") {
      const sortBy = rawQuery.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // ✅ Apply Field Limiting
    if (typeof rawQuery.fields === "string") {
      const fields = rawQuery.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // ✅ Pagination Logic
    const page = parseInt(rawQuery.page) || 1;
    const limit = parseInt(rawQuery.limit) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Optional: Page existence check
    const total = await Tour.countDocuments(query);
    if (skip >= total) throw new Error("This page does not exist");

    // 🟢 Execute Final Query
    const tours = await query;

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
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "invalid ID",
  //   });
  // }
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour: "<updated tour here>",
  //   },
  // });
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
