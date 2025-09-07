import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, index: true },

  // "system" = default global category, "user" = custom category
  type: { type: String, enum: ["system", "user"], default: "user" },

  // user field is only required for user-created categories
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, default: null },
},
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
