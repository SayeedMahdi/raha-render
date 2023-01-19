const canChat = ({ user }, res, next) => {
	if (user.canChat === true) next()
	else {
		res.status(401)
		throw new Error("unauthorized access")
	}
}
export default canChat
