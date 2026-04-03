import Record from "../models/Record.js";

/**
 * 1. DASHBOARD SUMMARY API
 * Aggregates data while ignoring "deleted" records.
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const stats = await Record.aggregate([
      // STEP 1: Filter out soft-deleted records
      { $match: { isDeleted: false } },
      {
        $facet: {
          // Calculate Totals
          totals: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
                },
                totalExpense: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                  },
                },
              },
            },
          ],
          // Totals per Category
          categoryWise: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                type: { $first: "$type" },
              },
            },
          ],
          // Recent 5 entries
          recentActivity: [{ $sort: { date: -1 } }, { $limit: 5 }],
        },
      },
    ]);

    const data = stats[0];
    const totalIncome = data.totals[0]?.totalIncome || 0;
    const totalExpense = data.totals[0]?.totalExpense || 0;

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryTotals: data.categoryWise,
      recentActivity: data.recentActivity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 2. CREATE RECORD
 */
export const createRecord = async (req, res) => {
  try {
    const newRecord = new Record({ ...req.body, userId: req.user.id });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 3. GET RECORDS (With Search & Pagination)
 * Supported Query Params: ?page=1&limit=10&search=food&category=salary
 */
export const getRecords = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const { page = 1, limit = 10, search = "", category, type } = req.query;

    // Build the filter object
    let filter = { isDeleted: false }; // Never show deleted items

    if (category) filter.category = category;
    if (type) filter.type = type;

    // SEARCH SUPPORT: Searches for the 'search' string inside description or category
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // PAGINATION LOGIC
    const skip = (page - 1) * limit;

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for frontend pagination metadata
    const totalItems = await Record.countDocuments(filter);

    res.json({
      records,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
        itemsPerPage: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 4. SOFT DELETE RECORD
 * Updates isDeleted to true instead of removing from DB.
 */
export const softDeleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Record.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record moved to trash successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
