const authChecker = (subject, role) => {
	return (req, res, next) => {

		if (req.user?.isSuperAdmin) {
			next()
		} else if (
			req.user.role.hasOwnProperty(subject.toLowerCase()) &&
			(req.user.role[subject.toLowerCase()].includes(role) ||
				req.user.role[subject.toLowerCase()].includes("all"))
		) {
			next()
		} else {
			res.status(401)
			throw new Error("unauthorized access")
		}
	}
}
export default authChecker
