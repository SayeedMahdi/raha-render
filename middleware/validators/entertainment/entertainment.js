import { checkSchema, validationResult } from "express-validator"

const errorHandler = (req, res, next) => {
	const validationError = validationResult(req)
	if (!validationError.isEmpty()) {
		return res.status(400).json({ validationError })
	}
	next()
}

//this is the schema checker for create and update of a Entertainment
const createSchema = checkSchema({
	name: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("name") }),
		},
	},
	path: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("path") }),
		},
	},
	cloudinary: {
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("answer") }),
		},
	},
})

const updateSchema = checkSchema({
	name: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("question") }),
		},
	},
	path: {
		escape: true,
		trim: true,
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("question") }),
		},
	},
	cloudinary: {
		isEmpty: {
			negated: true,
			errorMessage: (_, { req }) =>
				req.t("required", { ns: "validations", key: req.t("question") }),
		},
	},
})

export default {
	create: [createSchema, errorHandler],
	update: [updateSchema, errorHandler],
}
