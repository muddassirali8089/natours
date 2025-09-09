import mongoose from "mongoose";
import { type } from "os";
import slugify from "slugify";
// import validator from 'validator';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      // Temporarily disable schema validation - we'll handle it in middleware
      // validate: {
      //   validator: function (val) {
      //     // If priceDiscount is not provided or is 0, it's valid
      //     if (!val || val === 0) return true;
      //     
      //     // For new documents, this.price is the current price
      //     // For updates, this.price might be the old price, so we'll handle this in pre-save
      //     return val < this.price;
      //   },
      //   message: "Discount price ({VALUE}) should be below regular price",
      // },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      address: {
        type: String,
        required: [true, "A tour must have a starting address"],
      },
      description: String,
    },

    // if you want multiple locations (stops in a tour)
    locations: [
      {
        address: {
          type: String,
          required: [true, "Location must have an address"],
        },
        description: String,
        day: {
          type: Number,
          required: [true, "Location must have a day number"],
        },
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,

        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});


tourSchema.virtual("reviews", {
  ref: "Review", // The model to use
  foreignField: "tour", // field in Review
  localField: "_id", // field in Tour
});

// 🚀 DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION

// 1. Single field indexes for commonly queried fields
tourSchema.index({ price: 1 }); // Ascending order for price queries
tourSchema.index({ ratingsAverage: -1 }); // Descending order (higher ratings first)
tourSchema.index({ slug: 1 }); // For slug-based queries

// 2. Compound index for price and ratingsAverage (commonly filtered together)
tourSchema.index({ price: 1, ratingsAverage: -1 });

// 3. Compound index for filtering and sorting (most common query pattern)
tourSchema.index({ ratingsAverage: -1, price: 1, difficulty: 1 });

// 4. Text index for search functionality
tourSchema.index({ 
  name: "text", 
  summary: "text", 
  description: "text" 
}, {
  weights: {
    name: 10,      // Name is most important
    summary: 5,    // Summary is medium importance  
    description: 1 // Description is least important
  }
});

// 5. Geospatial index for location-based queries

// 6. Index for date-based queries (monthly plan functionality)
tourSchema.index({ startDates: 1 });

// 7. Index for commonly used filters
tourSchema.index({ difficulty: 1 });
tourSchema.index({ duration: 1 });
tourSchema.index({ maxGroupSize: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  
  // Validate priceDiscount against current price
  if (this.priceDiscount && this.priceDiscount > 0 && this.priceDiscount >= this.price) {
    const error = new Error(`Discount price (${this.priceDiscount}) should be below regular price (${this.price})`);
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
});

// PRE-UPDATE MIDDLEWARE: runs before findOneAndUpdate, findOneAndDelete, etc.
tourSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  const update = this.getUpdate();
  
  console.log('🔍 Pre-update middleware - Full update object:', JSON.stringify(update, null, 2));
  
  // Check if both price and priceDiscount are being updated
  if (update.price && update.priceDiscount && update.priceDiscount > 0) {
    const price = parseFloat(update.price);
    const priceDiscount = parseFloat(update.priceDiscount);
    
    console.log(`🔍 Pre-update validation: price=${price}, priceDiscount=${priceDiscount}`);
    console.log(`💰 Comparison: ${priceDiscount} >= ${price} = ${priceDiscount >= price}`);
    
    if (priceDiscount >= price) {
      const error = new Error(`Discount price (${priceDiscount}) should be below regular price (${price})`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  // Check if only priceDiscount is being updated
  if (update.priceDiscount && update.priceDiscount > 0 && !update.price) {
    // We need to get the current price from the database
    this.findOne({}, 'price').then(doc => {
      if (doc && update.priceDiscount >= doc.price) {
        const error = new Error(`Discount price (${update.priceDiscount}) should be below regular price (${doc.price})`);
        error.name = 'ValidationError';
        return next(error);
      }
      next();
    }).catch(next);
    return;
  }
  
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});


tourSchema.pre(/^find/, function (next) {
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt -email -emailVerified'
  });
  next();

});




tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
