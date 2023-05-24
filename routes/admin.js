import Router from "express-group-router"
/** Controllers **/
import AdminController from "../controllers/admin/admin.js"
import authController from "../controllers/admin/auth.js"
import BlogController from "../controllers/admin/blog.js"
import PackageController from "../controllers/admin/package.js"
import commentController from "../controllers/admin/comment.js"
// import categoryController from "../controllers/admin/category.js"
import serviceController from "../controllers/admin/service.js"
import FAQController from "../controllers/admin/faq.js"
import ContactUsController from "../controllers/admin/contactUs.js"
// import RoleController from "../controllers/admin/role.js"
// import MediaController from "../controllers/admin/media.js"
import TicketController from "../controllers/admin/ticket.js"
import JobRequestController from "../controllers/admin/jobRequest.js"
import ServiceRequestController from "../controllers/admin/serviceRequest.js"
import entertainmentController from "../controllers/admin/entertainment.js"
import canChat from "../middleware/canChat.js"

/** Models **/
import Admin from "../models/Admin.js"
/** Middlewares **/
// import advancedResults from "../middleware/advancedResults.js"
import { authenticate } from "../middleware/authMiddleware.js"
// import imageResizer from "../utils/imageResizer.js"
import limiter from "../utils/rateLimiting.js"
import imgUploader from "../utils/imgUploader.js"
/** Validators **/
import adminValidation from "../middleware/validators/admin/admin.js"
import authValidation from "../middleware/validators/admin/auth.js"
import blogValidation from "../middleware/validators/blogs/blog.js"
import commentValidation from "../middleware/validators/comments/comment.js"
import categoryValidation from "../middleware/validators/categories/categories.js"
import packageValidation from "../middleware/validators/packages/package.js"
import serviceValidation from "../middleware/validators/services/service.js"
import FAQValidation from "../middleware/validators/faq/faq.js"
import contactUsValidation from "../middleware/validators/support/contactUs.js"
// import roleValidation from "../middleware/validators/roles/role.js"
// import mediaValidation from "../middleware/validators/media/media.js"
import ticketValidation from "../middleware/validators/ticket/ticket.js"
import jobRequestValidation from "../middleware/validators/requests/jobRequest.js"
import serviceRequestValidation from "../middleware/validators/requests/serviceRequest.js"
import entertainmentValidation from "../middleware/validators/entertainment/entertainment.js"

//cloudinary
import uploadToCloudinary from "../utils/uploadCloudinary.js"
import authChecker from "../middleware/authorization.js"
import multiFileUploader from "../utils/multiFileUploader.js"

const router = new Router()

// Auth Routes
router.group("/auth", [limiter], (router) => {
	router.post("/login", authValidation.login, authController.login)
	router.get("/refresh", authController.refreshToken)
	router.post(
		"/forgot-password",
		authValidation.forgotPassword,
		authController.forgotPassword
	)
	router.put(
		"/reset-password/:token",
		authValidation.resetPassword,
		authController.resetPassword
	)
	router.post("/logout", authenticate(Admin), authController.logout)
})

// router.group([authenticate(Admin)], (router) => {
router.group((router) => {
	// Admin User Routes
	router.group("/admin-users", (router) => {
		router.get("/", authChecker("Users", "read"), AdminController.getAdmins)
		router.put(
			"/:id/change-password",
			adminValidation.changePassword,
			AdminController.changePassword
		)
		router.get("/:id", AdminController.getAdmin)
		router.put(
			"/:id",
			imgUploader("image"),
			uploadToCloudinary,
			adminValidation.update,
			authChecker("User", "update"),
			AdminController.updateAdmin
		)
		router.post(
			"/",
			imgUploader("image"),
			uploadToCloudinary,
			adminValidation.create,
			// authChecker("Users", "create"),
			AdminController.createAdmin
		)
		router.delete(
			"/:id",
			authChecker("Users", "delete"),
			AdminController.deleteAdmin
		)
	})

	// Blog Routes
	router.group("/blog", (router) => {
		router.get("/", authChecker("Blog", "read"), BlogController.getBlogs)
		router.post(
			"/",
			imgUploader("image"),
			uploadToCloudinary,
			blogValidation.create,
			// authChecker("Blog", "create"),
			BlogController.createBlog
		)
		// router.get("/categories", BlogController.getCategories)
		router.get("/:id", authChecker("Blog", "read"), BlogController.getBlog)
		router.put(
			"/:id/update-local",
			authChecker("Blog", "create"),
			BlogController.updateLocal
		)
		router.put(
			"/:id",
			imgUploader("image"),
			uploadToCloudinary,
			blogValidation.update,
			authChecker("Blog", "update"),
			BlogController.updateBlog
		)
		router.delete(
			"/:id",
			authChecker("Blog", "delete"),
			BlogController.deleteBlog
		)

		// Comments
		router.group("/:id/comment", (router) => {
			router.put(
				"/:commentId",
				commentValidation.createAndUpdate,
				authChecker("Blog", "update"),
				commentController.updateComment
			)
			router.delete(
				"/:commentId",
				authChecker("Blog", "delete"),
				commentController.deleteComment
			)
			// Reply
			router.post(
				"/:commentId/reply",
				commentValidation.createAndUpdate,
				authChecker("Blog", "create"),
				commentController.replyComment
			)
		})
	})

	// Package Routes
	router.group("/packages", (router) => {
		router.get(
			"/",
			authChecker("Package", "read"),
			PackageController.getPackages
		)
		router.get(
			"/:id",
			authChecker("Package", "read"),
			PackageController.getPackage
		)
		// router.get(
		// 	"/categories-provinces",
		// 	PackageController.getCategoriesAndProvinces
		// )
		router.post(
			"/",
			packageValidation.create,
			authChecker("Package", "create"),
			PackageController.createPackage
		)
		router.put(
			"/:id",
			packageValidation.update,
			authChecker("Package", "update"),
			PackageController.updatePackage
		)
		router.put(
			"/:id/update-locals",
			authChecker("Package", "update"),
			PackageController.updateLocals
		)
		router.delete(
			"/:id",
			authChecker("Package", "delete"),
			PackageController.deletePackage
		)
	})

	// Category Routes
	// router.group("/categories", (router) => {
	// 	router.get("/", categoryController.getCategories)
	// 	router.put(
	// 		"/:id/update-locals",
	// 		categoryValidation.updateLocal,
	// 		categoryController.updateLocals
	// 	)
	// 	router.get("/:id", categoryController.getCategory)
	// 	router.post(
	// 		"/",
	// 		categoryValidation.create,
	// 		categoryController.createCategory
	// 	)
	// 	router.put(
	// 		"/:id",
	// 		categoryValidation.update,
	// 		categoryController.updateCategory
	// 	)
	// 	router.delete(
	// 		"/:id",
	// 		categoryValidation.delete,
	// 		categoryController.deleteCategory
	// 	)
	// })

	// Services Routes
	router.group("/services", (router) => {
		router.get(
			"/",
			authChecker("Services", "read"),
			serviceController.getServices
		)
		router.get(
			"/icon-options",
			authChecker("Services", "read"),
			serviceController.getIconOptions
		)
		router.get(
			"/:id",
			authChecker("Services", "read"),
			serviceController.getService
		)
		router.put(
			"/:id/update-locals",
			authChecker("Services", "update"),
			serviceController.updateLocals
		)
		router.post(
			"/",
			serviceValidation.create,
			authChecker("Services", "create"),
			serviceController.createService
		)
		router.put(
			"/:id",
			serviceValidation.update,
			authChecker("Services", "update"),
			serviceController.updateService
		)
		router.delete(
			"/:id",
			authChecker("Services", "delete"),
			serviceController.deleteService
		)
	})

	//FAQ Routes
	router.group("/faq", (router) => {
		router.get("/", authChecker("Faq", "read"), FAQController.getFAQs)
		router.get(
			"/categories",
			authChecker("Faq", "read"),
			FAQController.getCategories
		)
		router.get("/:id", authChecker("Faq", "read"), FAQController.getFaq)
		router.put(
			"/:id/update-locals",
			FAQValidation.updateLocal,
			authChecker("Faq", "update"),
			FAQController.updateLocals
		)
		router.post(
			"/",
			FAQValidation.create,
			authChecker("Faq", "create"),
			FAQController.createFAQ
		)
		router.put(
			"/:id",
			FAQValidation.update,
			authChecker("Faq", "update"),
			FAQController.updateFAQ
		)
		router.delete("/:id", authChecker("Faq", "delete"), FAQController.deleteFAQ)
	})

	//Entertainments Routes
	router.group("/entertainment", (router) => {
		router.get(
			"/",
			authChecker("Entertainment", "read"),
			entertainmentController.getEntertainments
		)
		router.get(
			"/:id",
			authChecker("Entertainment", "read"),
			entertainmentController.getEntertainment
		)
		router.post(
			"/",
			imgUploader("image"),
			uploadToCloudinary,
			entertainmentValidation.create,
			authChecker("entertainment", "create"),
			entertainmentController.createEntertainment
		)
		router.put(
			"/:id",
			imgUploader("image"),
			uploadToCloudinary,
			entertainmentValidation.update,
			authChecker("entertainment", "update"),
			entertainmentController.updateEntertainment
		)
		router.delete(
			"/:id",
			authChecker("entertainment", "delete"),
			entertainmentController.deleteEntertainment
		)
	})

	//Contact Routes
	router.group("/contact-us", (router) => {
		router.get(
			"/",
			authChecker("Contact-us", "read"),
			ContactUsController.getContacts
		)
		router.put(
			"/:id/change-status",
			contactUsValidation.changeStatus,
			authChecker("Contact-us", "update"),
			ContactUsController.changeStatus
		)

		// router.get("/:id", ContactUsController.getContact);
		// router.put("/:id", contactUsValidation.create, ContactUsController.updateContact);
		// router.delete("/:id", ContactUsController.deleteContact);
	})

	//Role Routes
	// router.group("/roles", (router) => {
	// 	router.get("/", RoleController.getRoles, advancedResults)
	// 	router.get("/:id", RoleController.getRole)
	// 	router.post("/", roleValidation.create, RoleController.createRole)
	// 	router.put("/:id", roleValidation.update, RoleController.updateRole)
	// 	router.delete("/:id", RoleController.deleteRole)
	// })

	// Ticket Routes
	router.group("/ticket", (router) => {
		router.get("/:id", canChat, TicketController.getMessages)
		router.get("/", canChat, TicketController.getChats)
		router.post(
			"/:id",
			multiFileUploader("attachments"),
			uploadToCloudinary,
			// ticketValidation.createMessage,
			canChat,
			TicketController.createMessage
		)
		router.put(
			"/:id/message/:msgId",
			multiFileUploader("attachments"),
			uploadToCloudinary,
			canChat,
			TicketController.updateMessage
		)
		router.put("/:id/close-chat", canChat, TicketController.closeChat)
		router.post(
			"/:id/message/:msgId/reply",
			canChat,
			TicketController.replyMessage
		)
		router.delete(
			"/:id/message/:msgId",
			canChat,
			TicketController.deleteMessage
		)
	})

	// Requests
	router.group("/request", (router) => {
		router.get(
			"/job",
			authChecker("Job", "read"),
			JobRequestController.getRequests
		)
		router.get(
			"/job/:id",
			authChecker("Job", "read"),
			JobRequestController.getRequest
		)
		router.put(
			"/job/:id",
			jobRequestValidation.changeState,
			authChecker("Job", "update"),
			JobRequestController.changeState
		)

		router.get(
			"/service",
			authChecker("Services", "read"),
			ServiceRequestController.getRequests
		)
		router.get(
			"/service/:id",
			authChecker("Services", "read"),
			ServiceRequestController.getRequest
		)
		router.put(
			"/service/:id",
			serviceRequestValidation.changeState,
			authChecker("Services", "update"),
			ServiceRequestController.changeState
		)
	})
})

export default router.init()
