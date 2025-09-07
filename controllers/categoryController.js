import Category from "../models/categorySchema.js";
import slugify from "slugify";


// Create system categories
export const seedCategories = async (req, res) => {
  try {
    const systemCategories = [
      { name: "Work", type: "system" },
      { name: "Personal", type: "system" },
      { name: "Health", type: "system" },
      { name: "Shopping", type: "system" },
      { name: "Finance", type: "system" },
    ];

    const created = [];

    for (const cat of systemCategories) {
      const slug = slugify(cat.name, { lower: true });
      const exists = await Category.findOne({ slug, type: "system" });

      if (!exists) {
        const newCat = await Category.create({ ...cat, slug });
        created.push(newCat);
      }
    }

    return res.status(201).json({ message: "System categories seeded successfully", created });
  } catch (err) {
    console.error("Error seeding categories:", err);
    return res.status(500).json({ message: "Error seeding categories", error: err.message });
  }
};


// Create Category (users only)
export const createCategory = async (req, res) => {
  try {
    const {name} = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists (for this user only)
    const existing = await Category.findOne({ user: userId, name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      user: userId,
      name,
      slug: slugify(name, { lower: true }),
      type: "user", // ensure it's marked as a user-created category
    });

    await category.save();

    return res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    console.error("Error creating category:", err);
    return res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOne({ _id: id, user: userId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const oldName = category.name;
    category.name = name;
    category.slug = slugify(name, { lower: true });

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    return res.status(500).json({
      message: "Error updating category",
      error: err.message,
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await Category.findOneAndDelete({
      _id: id,
      user: userId,
      type: "user", // prevent deleting system categories
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found or already deleted" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};

// Get Categories (system + user)
export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.find({
      $or: [{ type: "system" }, { user: userId }],
    }).sort({ name: 1 });

    return res.status(200).json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};
