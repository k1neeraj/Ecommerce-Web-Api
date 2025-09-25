const mongoose = require('mongoose');

// Define category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing spaces
  },
  icon: {
    type: String,
    default: "", // Optional but keeps the field consistent
  },
  color: {
    type: String,
    default: "",
  }
});

// Ensure 'id' field is available for frontend (optional, but common)
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
categorySchema.set('toJSON', {
  virtuals: true,
});

// Export the Category model
exports.Category = mongoose.model("Category", categorySchema);
