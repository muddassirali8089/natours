
import qs from "qs";

export class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query (e.g., Tour.find())
    this.queryString = qs.parse(qs.stringify(queryString)); // Deep clone of query object
  }

  filter() {
    console.log("call the filter...");

    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);
    console.log("✅ Filtered Query inside class:", parsedQuery); // ✅ Add this line

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // default sort
    }
    return this;
  }

  limitFields() {
    if (typeof this.queryString.fields === "string") {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // default: exclude __v
    }
    return this;
  }
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Optional: expose for controller (e.g., page existence check)
    this.skip = skip;
    this.limit = limit;

    return this;
  }
}