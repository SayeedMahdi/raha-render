const authChecker = (subject, role) => {
	return (req, res, next) => {
		if (req.user?.isSuperAdmin) {
			next()
		} else if (
			req.user.role.hasOwnProperty(subject) &&
			(req.user.role[subject].includes(role) ||
				req.user.role[subject].includes("all"))
		) {
			next()
		} else {
			res.status(401)
			throw new Error("unauthorized access")
		}
	}
}
export default authChecker
