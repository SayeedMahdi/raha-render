import mongoose from "mongoose"

const JobRequestSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: String,
		province: {
			type: String,
			required: true,
		},
		attachments: String,
		status: {
			type: String,
			enum: ["pending", "approved", "declined"],
			default: "pending",
			required: true,
		},
		province: String,
		subject: String,
		contractId: String,
		updaterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
		},
	},
	{ timestamps: true }
)

JobRequestSchema.plugin(accessibleRecordsPlugin)

const JobRequest = mongoose.model("job-request", JobRequestSchema)

export default JobRequest
