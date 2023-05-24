import Router from "express-group-router"
// Controllers
import AuthController from "../controllers/client/auth.js"
import ProfileController from "../controllers/client/profile.js"
import BlogController from "../controllers/client/blog.js"
import CommentController from "../controllers/client/comment.js"
import ServiceController from "../controllers/client/service.js"
import FAQController from "../controllers/client/faq.js"
import packageController from "../controllers/client/package.js"
import ContactUsController from "../controllers/client/contactUs.js"
import TicketController from "../controllers/client/ticket.js"
import GraphController from "../controllers/client/graph.js"
import ServiceRequestController from "../controllers/client/serviceRequest.js"
import Entertainment from "../controllers/client/entertainment.js"
import callCenter from "../webSocket/callCenter.js"

// Validators
import authValidation from "../middleware/validators/clients/auth.js"
import profileValidation from "../middleware/validators/clients/profile.js"
import commentValidation from "../middleware/validators/comments/comment.js"
import contactUsValidation from "../middleware/validators/support/contactUs.js"
import ticketValidation from "../middleware/validators/ticket/ticket.js"
import serviceValidation from "../middleware/validators/services/service.js"
import jobRequestValidation from "../middleware/validators/requests/jobRequest.js"
import serviceRequestValidation from "../middleware/validators/requests/serviceRequest.js"

// import serviceRequestValidation from "../middleware/validators/requests/serviceRequest";
// Middlewares
import { authenticate, isUserVerified } from "../middleware/authMiddleware.js"
// import advancedResults from "../middleware/advancedResults.js"
import imgUploader from "../utils/imgUploader.js"
import multiFileUploader from "../utils/multiFileUploader.js"
// Models
import Client from "../models/Client.js"
import JobRequestController from "../controllers/client/jobRequest.js"
import uploadToCloudinary from "../utils/uploadCloudinary.js"
import { requestService } from "../controllers/client/speedTest.js"

const router = new Router()

// User Client Routes
// Auth Routes
router.group("/auth", (router) => {
	router.post(
		"/register",
		imgUploader("image"),
		uploadToCloudinary,
		authValidation.signup,
		AuthController.register
	)
	router.post("/login", authValidation.login, AuthController.login)
	router.get("/refresh", AuthController.refresh)
	router.put("/verify", authValidation.verifyEmail, AuthController.verifyEmail)
	router.post(
		"/resend-token",
		authenticate(Client),
		authValidation.resendToken,
		AuthController.resendToken
	)
	router.post(
		"/forgot-password",
		authValidation.forgotPassword,
		AuthController.forgotPassword
	)
	router.put(
		"/reset-password",
		authValidation.resetPassword,
		AuthController.resetPassword
	)
	router.post("/logout", AuthController.logout)
})

// Profile Routes
router.group("/client/profile", [authenticate(Client)], (router) => {
	router.get("/", ProfileController.getUserInfo)
	router.put(
		"/",
		isUserVerified,
		imgUploader("image"),
		uploadToCloudinary,
		profileValidation.update,
		ProfileController.updateUser
	)
	router.put(
		"/change-password",
		isUserVerified,
		profileValidation.changePassword,
		ProfileController.changePassword
	)
	router.post(
		"/email/send-verification",
		ProfileController.sendEmailUpdateToken
	)
	router.post("/email/cancel-update", ProfileController.cancelEmailUpdate)
	router.post("/email/verify", ProfileController.verifyEmail)
	router.delete("/", isUserVerified, ProfileController.deleteUser)
})

// Blog Routes
router.group("blogs", (router) => {
	router.get("/", BlogController.getBlogs)
	router.get("/:id", BlogController.getBlog)

	// Comments
	router.group(
		"/:id/comment",
		[authenticate(Client), isUserVerified],
		(router) => {
			router.post(
				"/",
				commentValidation.createAndUpdate,
				CommentController.createComment
			)
			router.put(
				"/:commentId",
				commentValidation.createAndUpdate,
				CommentController.updateComment
			)
			router.delete("/:commentId", CommentController.deleteComment)
			//Reply Comment
			router.post(
				"/:commentId/reply",
				commentValidation.createAndUpdate,
				CommentController.replyComment
			)
		}
	)

	// Like & Dislike
	router.put(
		"/:id/like",
		[authenticate(Client), isUserVerified],
		BlogController.likeOrDislike
	)
})

// Package Routes
router.group("/packages", (router) => {
	router.get("/", packageController.getPackages)
	router.get(
		"/categories/provinces",
		packageController.getCategoriesAndProvinces
	)
	router.get("/:id", packageController.getPackage)
})

router.group("/request", (router) => {
	router.post(
		"job",
		imgUploader("image"),
		uploadToCloudinary,
		jobRequestValidation.create,
		JobRequestController.create
	)
	router.post(
		"service",
		serviceRequestValidation.create,
		ServiceRequestController.create
	)
	router.get("services", ServiceRequestController.getServices)
})

router.get("/services", ServiceController.getServices)
router.post(
	"/services/request",
	serviceValidation.requestService,
	ServiceController.requestService
)
router.get("/faq", FAQController.getFAQs)
router.post(
	"contact-us",
	contactUsValidation.create,
	ContactUsController.create
)
router.get("/download/graph/persian", GraphController.downloadPersianFile)
router.get("/download/graph/english", GraphController.downloadEnglishFile)

// Ticket/Chatting Routes
router.group("/ticket", [authenticate(Client), isUserVerified], (router) => {
	router.get("/chat/details", TicketController.chatDetails)
	router.get("/check/status", TicketController.checkTicketStatus)
	// router.post("/", ticketValidation.createChat, TicketController.createChat);
	router.post("/", ticketValidation.createChat, TicketController.createChat)
	router.get("/:id", TicketController.getMessages)
	router.post(
		"/:id",
		multiFileUploader("attachments"),
		uploadToCloudinary,
		TicketController.createMessage
	)
	router.put(
		"/:id/message/:msgId",
		multiFileUploader("attachments"),
		uploadToCloudinary,
		TicketController.updateMessage
	)
	router.post("/:id/message/:msgId/reply", TicketController.replyMessage)
	router.delete("/:id/message/:msgId", TicketController.deleteMessage)
})

router.group("/entertainment", (router) => {
	router.post("/generate-image", Entertainment.imageGenerator)
	router.get("/games", Entertainment.getGames)
})

router.group("/speed", (router) => {
	router.get("/", requestService)
})

export default router.init()
