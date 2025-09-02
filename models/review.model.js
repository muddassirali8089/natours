import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty!"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Belongs to a tour
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },

    // Belongs to a user
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔒 Ensure a user can leave only 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Auto populate user (and optionally tour) when fetching reviews
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  // If you also want to auto-populate tour details, uncomment below:
  // this.populate({
  //   path: "tour",
  //   select: "name slug",
  // });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
