import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import Entertainment from "../../models/Entertainment.js"

const getEntertainments = asyncHandler(async (req, res, next) => {
	const entertainments = await Entertainment.find().sort({ createdAt: -1 })
	res.json(entertainments)
})

// @desc    Get a Entertainment
// @route   GET /api/v1/admin/entertainment/:id
// @access  Private
const getEntertainment = asyncHandler(
	async ({ params: { id }, t }, res, next) => {
		if (!mongoose.Types.ObjectId.isValid(id)) return next()

		const entertainment = await Entertainment.findOne({ _id: id })

		if (!entertainment) {
			res.status(404)
			throw new Error(
				t("not-found", { ns: "validations", key: t("entertainment") })
			)
		}

		res.json(entertainment)
	}
)

// @desc    Create Entertainments
// @route   POST /api/v1/admin/entertainment
// @access  private
const createEntertainment = asyncHandler(async ({ body, user }, res) => {
	body.creatorId = user.id
	body.image = body.cloudinary.url
	body.publicId = body.cloudinary.public_id
	const entertainment = await Entertainment.create(body)
	res.status(201).json(entertainment)
})

// @desc    update Entertainment
// @route   PUT /api/v1/admin/entertainment/:id
// @access  private
const updateEntertainment = asyncHandler(
	async ({ body, user, params: { id }, t }, res, next) => {
		if (!mongoose.Types.ObjectId.isValid(id)) return next()
		body.creatorId = user.id
		const entertainment = await Entertainment.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					name: body.name,
					image: body.image,
					path: body.path,
				},
			},
			{ new: true }
		)

		if (!entertainment) {
			res.status(404)
			throw new Error(
				t("not-found", { ns: "validations", key: t("entertainment") })
			)
		}

		res.status(201).json(entertainment)
	}
)

// @desc    delete Entertainment
// @route   delete /api/v1/admin/entertainment/:id
// @access  private
const deleteEntertainment = asyncHandler(
	async ({ params: { id }, t }, res, next) => {
		if (!mongoose.isValidObjectId(id)) return next()
		const findAnEntertainment = await Entertainment.findByIdAndDelete(id)

		if (!findAnEntertainment) {
			res.status(404)
			throw new Error(
				t("not-found", { ns: "validations", key: t("entertainment") })
			)
		}
		res.json({})
	}
)

const entertainmentController = {
	getEntertainments,
	getEntertainment,
	createEntertainment,
	updateEntertainment,
	deleteEntertainment,
}

export default entertainmentController
