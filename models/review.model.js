import mongoose from "mongoose";
import Tour from "./tour.model.js";

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

// 🚀 ADDITIONAL DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION

// 1. Index for tour-based queries (get all reviews for a tour)
reviewSchema.index({ tour: 1, createdAt: -1 }); // Tour reviews sorted by newest first

// 2. Index for user-based queries (get all reviews by a user)
reviewSchema.index({ user: 1, createdAt: -1 });

// 3. Index for rating-based sorting and filtering
reviewSchema.index({ rating: -1 }); // Higher ratings first
reviewSchema.index({ tour: 1, rating: -1 }); // Tour reviews sorted by rating

// 4. Index for date-based queries
reviewSchema.index({ createdAt: -1 }); // Newest reviews first

// 5. Compound index for tour statistics (average ratings, etc.)
reviewSchema.index({ tour: 1, rating: 1 });

// 6. Text search index for review content
reviewSchema.index({ review: "text" });

// 🚀 STATIC METHOD FOR CALCULATING TOUR STATISTICS
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10 // Round to 1 decimal
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5 // Default value
    });
  }
};

// 🚀 MIDDLEWARE FOR AUTOMATIC STATISTICS UPDATE

// Update tour statistics after saving a review
reviewSchema.post('save', function() {
  // Use Review model to calculate statistics
  this.constructor.calcAverageRatings(this.tour);
});

// Update tour statistics after review is deleted
reviewSchema.post(/^findOneAnd/, async function() {
  // this.r is the review document that was found and modified/deleted
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

// Store the review document before deletion for statistics update
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

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
