import asyncHandler from "express-async-handler"
import Package from "../../models/Package.js"
import Category from "../../models/Category.js"
import mongoose from "mongoose"

const PackageController = {
	// @desc    Get all packages
	// @route   GET /api/v1/packages
	// @access  public
	getPackages: asyncHandler(async (req, res, next) => {
		const { province, category } = req.query

		const packages = await Package.aggregate([
			{
				$match: {
					province: { $eq: mongoose.Types.ObjectId(province) },
					category: { $eq: mongoose.Types.ObjectId(category) },
				},
			},
			{
				$lookup: {
					from: "provinces",
					localField: "province",
					foreignField: "_id",
					as: "province",
				},
			},
			{
				$lookup: {
					from: "categories",
					localField: "category",
					foreignField: "_id",
					as: "category",
				},
			},
		])

		res.status(200).json({ length: packages.length, packages })
	}),

	// @desc      Get single package
	// @route     GET /api/v1/packages/:id
	// @access    private
	getPackage: asyncHandler(async ({ params: { id }, t }, res) => {
		const filter = mongoose.Types.ObjectId.isValid(id)
			? { _id: id }
			: { slug: id }

		const pack = await Package.findOne(filter).populate(
			"category",
			"name slug _id"
		)

		if (!pack) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("package") }))
		}

		res.json(pack)
	}),

	// @desc    Get all categories and provinces
	// @route   GET /api/v1/packages/categories/provinces
	// @access  public
	getCategoriesAndProvinces: asyncHandler(async (req, res) => {
		const result = await Package.aggregate([
			{
				$group: {
					_id: "$province",
					categories: {
						$addToSet: "$category",
					},
				},
			},
			{
				$lookup: {
					from: "categories",
					localField: "categories",
					foreignField: "_id",
					as: "categories",
				},
			},
			{
				$project: {
					categories: {
						name: true,
						slug: true,
						_id: true,
					},
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
		])
		res.json(result)
	}),

	getPackageCategory: asyncHandler(async (req, res) => {
		const categories = await Category.find(
			{ type: "package" },
			"name createdAt"
		)

		res.status(200).json(categories)
	}),
}

export default PackageController
