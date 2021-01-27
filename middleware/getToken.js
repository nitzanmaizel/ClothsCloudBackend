const jwt = require('jsonwebtoken');

function getToken(req, res, next) {
	const token = req.params.id;

	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, process.env.jwtSecret);

		req.user = decoded;
		next();
	} catch (err) {
		console.error(err.message);
		res.status(401).json({ msg: 'Token is not valid' });
	}
}

module.exports = getToken;
