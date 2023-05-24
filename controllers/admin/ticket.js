import asyncHandler from "express-async-handler"
import Ticket from "../../models/Ticket.js"

// @desc    Get all Ticket/chats
// @route   GET /api/v1/admin/ticket
// @access  Private
const getChats = asyncHandler(async (req, res, next) => {
	const role = Object.keys(req.user?.role).join('')
	let chats

	req.user.isSuperAdmin === true
		? (chats = await Ticket.find({ status: { $ne: "close" } })
			.populate("client_id", "fullName image publicId")
			.populate("messages.user", "fullName image publicId")
			.slice("messages", -1))
		: (chats = await Ticket.find({ subject: role, status: { $ne: "close" } })
			.populate("client_id", "fullName image publicId")
			.populate("messages.user", "fullName image publicId")
			.slice("messages", -1))

	if (!chats) {
		res.status(400)
		throw new Error(t("not-found", { ns: "validations", key: t("message") }))
	}

	res.status(200).json(chats)
})

// @desc    Get all Ticket/Chat
// @route   GET /api/v1/admin/ticket/:id
// @access  Private
const getMessages = asyncHandler(async ({ params, t }, res, next) => {
	const chats = await Ticket.findOne({
		_id: params.id,
		status: { $ne: "close" },
	}).populate("messages.user", "fullName image publicId")

	if (!chats) {
		res.status(400)
		throw new Error(t("not-found", { ns: "validations", key: t("message") }))
	}

	res.status(200).json(chats.messages)
})

// @desc    Create Message
// @route   POST /api/v1/ticket/:id
// @access  private
const createMessage = asyncHandler(
	async ({ user, file, body, params, t }, res, next) => {
		let ticket = await Ticket.findOne({ _id: params.id })

		if (!ticket) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("chat") }))
		}

		const newMessage = {
			user: user.id,
			userType: "Admin",
			image: body.cloudinary?.secure_url || null,
			publicId: body?.cloudinary?.public_id || undefined,
			text: body?.text,
			reply: null,
		}

		ticket.messages.push(newMessage)

		const newTicket = await ticket.save()
		await newTicket.populate("messages.user", "fullName image publicId")
		await newTicket.populate("client_id", "fullName image publicId")

		res.status(201).json(newTicket.messages.pop())
	}
)

// @desc    Update message
// @route   Message: PUT /api/v1/ticket/:chatId/message/:messageId
// @access  Private
const updateMessage = asyncHandler(
	async ({ file, body, params, t }, res, next) => {
		// if (!mongoose.Types.ObjectId.isValid(params.msgId)) return next()

		let ticket = await Ticket.findOne({ _id: params.id })

		if (!ticket) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("chat") }))
		}

		const message = ticket.messages.some(
			(message) => message.id === params.msgId
		)

		if (!message) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("message") }))
		}

		// Update specific message
		const chatUpdatedMessage = await Ticket.findOneAndUpdate(
			{ "messages._id": params.msgId },
			{
				$set: {
					"messages.$.text": body.text,
					"messages.$.image": file && file?.path,
					"messages.$.image": body.cloudinary?.secure_url || null,
					"messages.$.publicId": body?.cloudinary?.public_id || undefined,
					"messages.$.updatedAt": new Date(),
				},
			},
			{
				new: true,
				upsert: true,
				select: {
					messages: {
						$elemMatch: { _id: params.msgId },
					},
				},
			}
		).populate("messages.user", "fullName image")

		res.status(200).json(chatUpdatedMessage.messages[0])
	}
)

// @desc    Close chat
// @route   PUT /api/v1/admin/ticket/:id/close-chat
// @access  private
const closeChat = asyncHandler(
	async ({ user, params: { id }, t }, res, next) => {
		const role = user?.role
		let ticket

		user.isSuperAdmin === true
			? (ticket = await Ticket.findOneAndUpdate(
				{ _id: id },
				{
					$set: {
						status: "close",
						closed_by: user._id,
						closing_date: new Date(),
					},
				},
				{
					new: true,
					runValidators: true,
				}
			))
			: (ticket = await Ticket.findOneAndUpdate(
				{ _id: id, subject: role },
				{
					$set: {
						status: "close",
						closed_by: user._id,
						closing_date: new Date(),
					},
				},
				{
					new: true,
					runValidators: true,
				}
			))
		if (!ticket) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("chat") }))
		}

		res.status(200).json({})
	}
)

// @desc    Reply Message
// @route   POST /api/v1/ticket/:chatId/message/:msgId/reply
// @access  private
const replyMessage = asyncHandler(
	async ({ user, file, body, params, t }, res, next) => {
		let ticket = await Ticket.findOne({ _id: params.id })

		if (!ticket) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("chat") }))
		}

		const message = ticket.messages.some(
			(message) => message.id === params.msgId
		)

		if (!message) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("message") }))
		}

		const replyMessage = {
			user: user.id,
			userType: "Admin",
			text: body.text,
			replyTo: params.msgId,
			preText: body.preText,
		}

		ticket.messages.push(replyMessage)

		const newTicketMessage = await ticket.save()

		await newTicketMessage.populate("messages.user", "fullName image")

		res.status(201).json(newTicketMessage.messages.pop())
	}
)

const deleteMessage = asyncHandler(
	async ({ user, file, body, params, t }, res, next) => {
		let ticket = await Ticket.findOne({ _id: params.id })

		if (!ticket) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("chat") }))
		}

		const message = ticket.messages.some(
			(message) => message.id === params.msgId
		)

		if (!message) {
			res.status(404)
			throw new Error(t("not-found", { ns: "validations", key: t("message") }))
		}

		const ChatUpdatedMessage = await Ticket.findOneAndUpdate(
			{ "messages._id": params.msgId },
			{ $pull: { messages: { _id: params.msgId } } },
			{
				select: {
					messages: {
						$elemMatch: { _id: params.msgId },
					},
				},
			}
		).populate("messages.user", "fullName image publicId")

		if (!ChatUpdatedMessage) {
			res.status(404)
			throw new Error(t("wrong", { ns: "validatisons", key: t("s") }))
		}

		res.status(200).json({})
	}
)
const TicketController = {
	getMessages,
	getChats,
	createMessage,
	updateMessage,
	deleteMessage,
	closeChat,
	replyMessage,
}

export default TicketController
