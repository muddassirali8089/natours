import AppError from "../utils/AppError.js";
import catchAsync from "../controllers/catchAsync.js";
import { APIFeatures } from "../utils/apiFeatures.js";

// ✅ Factory method for reading all documents
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log("getAll");
    // Allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const rawQuery = req.queryOptions || req.query;

    const features = new APIFeatures(Model.find(filter), rawQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const total = await Model.countDocuments(filter);
    
    // Only check pagination if we have documents and are actually paginating
    if (total > 0 && features.skip >= total) {
      return next(new AppError("This page does not exist", 404));
    }

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { [Model.collection.name]: docs },
    });
  });

// ✅ Factory method for reading a single document
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [Model.collection.name.slice(0, -1)]: doc, // Remove 's' from collection name
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
