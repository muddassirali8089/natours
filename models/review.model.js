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

    // Reference to Tour
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },

    // Reference to User
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    timestamps: true, // ⏱ Adds createdAt & updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Ensure unique review per tour by each user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// 🔄 Auto populate user & tour when fetching reviews
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo", // ✅ Include _id by removing -_id
  }).populate({
    path: "tour",
    select: "name", // return only tour name
    options: { strictPopulate: false }
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
