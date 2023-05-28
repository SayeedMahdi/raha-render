import mongoose from "mongoose"
import Province from "../../models/Province.js"
import asyncHandler from "express-async-handler"

// @desc    Get Provincea
// @route   GET /api/v1/admin/Province
// @access  private
const getProvinces = asyncHandler(async (req, res, next) => {
	const provinces = await Province.find()

	res.json(provinces)
})

// @desc    Create Province
// @route   POST /api/v1/admin/Province
// @access  private
const createProvince = asyncHandler(async ({ body, user }, res) => {
	body.creatorId = user?.id

	body.name = {
		fa: body.name,
	}

	const province = await Province.create(body)

	res.status(201).json(province)
})

// @desc    Update Province
// @route   PUT /api/v1/admin/Province/:id
// @access  private
const updateProvince = asyncHandler(
	async ({ body, user, params: { id }, t }, res, next) => {
		if (!mongoose.Types.ObjectId.isValid(id)) return next()

		body.creatorId = user.id

		body.name = {
			fa: body.name,
		}

		const province = await Province.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					name: body.name,
				},
			},
			{ new: true }
		)

		if (!province) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("Province") }))
		}

		res.status(201).json(province)
	}
)

const deleteProvince = asyncHandler(async ({ params: { id }, t }, res, next) => {
	if (!mongoose.isValidObjectId(id)) return next()

	const findAnProvince = await Province.findByIdAndDelete(id)

	if (!findAnProvince) {
		res.status(404)
		throw new Error(t("not-found", { ns: "validations", key: t("Province") }))
	}

	res.json({})
})

// @desc      Delete Province locals
// @route     DELETE api/v1/admin/Province/:id/update-locals
// @access    private/admin
const updateLocals = asyncHandler(async ({ body, params: { id }, t }, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(id)) return next()

	const province = await Province.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				"name.en": body["name_en"],
				"name.ps": body["name_ps"],
			},
		},
		{
			new: true,
			runValidators: true,
		}
	)

	if (!province) {
		res.status(404)
		throw new Error(t("not-found", { ns: "validations", key: t("Province") }))
	}

	res.status(200).json(province)
})

export default {
	getProvinces,
	createProvince,
	updateLocals,
	deleteProvince,
	updateProvince
}
