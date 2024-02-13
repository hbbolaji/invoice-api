class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // filter
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    const queryString = JSON.stringify(queryObj).replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  // sorting
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replace(",", " ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-invoiceDate");
    }
    return this;
  }
  // field
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replace(",", " ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  // pagination
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
