const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const name = req.body.name || req.body.fullName;
        const { email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (id, name, email, password_hash)
             VALUES (gen_random_uuid(), $1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name, email, passwordHash]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const userResult = await pool.query(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        delete user.password_hash;

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    register,
    login
};