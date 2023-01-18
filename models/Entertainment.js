import mongoose from "mongoose"

const entertainmentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Entertainment name is required!"],
		},
		image: {
			type: String,
			required: [true, "Entertainment image is required!"],
		},
		path: {
			type: String,
			required: [true, "Entertainment path is required!"],
		},
		publicId: {
			type: String,
			required: [true, "Entertainment publicId is required!"],
		},
		creatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
		},
		updaterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
		},
	},
	{
		timestamps: true,
	}
)

const Entertainment = mongoose.model("Entertainment", entertainmentSchema)

export default Entertainment
