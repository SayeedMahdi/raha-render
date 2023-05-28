import asyncHandler from "express-async-handler"
import Province from "../../models/Province.js"

// @desc    Get all FAQs
// @route   POST /api/v1/provinces
// @access  public
const getProvinces = asyncHandler(async (req, res, next) => {
	const provinces = await Province.find()

	res.json(provinces)
})

export default {
	getProvinces
}
