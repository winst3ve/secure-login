const express = require("express");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
	const user = rows[0];
	if (!user) return res.status(400).json({ message: "Invalid credentials" });

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(400).json({ message: "Invalid credentials" });

	const token = jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	);
	res.cookie("token", token, { httpOnly: true, secure: false });
	res.json({ message: "Logged in" });
});

// Logout
router.post("/logout", (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logged out" });
});

// Register
router.post(
	"/register",
	[
		body("email").isEmail().withMessage("Invalid email address"),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
				email,
			]);
			if (user.length) {
				return res.status(400).json({ message: "Email already registered" });
			}

			const hash = await bcrypt.hash(password, 12);
			await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
				email,
				hash,
			]);

			res.json({ message: "Registered successfully" });
		} catch (err) {
			res.status(500).json({ message: "Server error" });
		}
	}
);

// Dashboard
router.get("/me", (req, res) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		res.json(user);
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
});

module.exports = router;
