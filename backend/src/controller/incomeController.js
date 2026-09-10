const pool = require("../config/db");

const addIncome = async (req, res) => {
    try {
        const { source, amount, description, income_date, income_type } = req.body;

        if (!source || !amount || !income_date) {
            return res.status(400).json({
                message: "Source, amount and income date are required"
            });
        }

        const userId = req.user.id;

        const result = await pool.query(
            `INSERT INTO income
            (user_id, source, amount, description, income_date, income_type)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                userId,
                source,
                amount,
                description,
                income_date,
                income_type || "one_time"
            ]
        );

        res.status(201).json({
            message: "Income added successfully",
            income: result.rows[0]
        });

    } catch (error) {
        console.error("Add Income Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getIncome = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            source,
            from,
            to
        } = req.query;

        let query = `
            SELECT *
            FROM income
            WHERE user_id = $1
        `;

        const values = [userId];
        let parameterIndex = 2;

        if (source) {
            query += ` AND source = $${parameterIndex}`;
            values.push(source);
            parameterIndex++;
        }

        if (from) {
            query += ` AND income_date >= $${parameterIndex}`;
            values.push(from);
            parameterIndex++;
        }

        if (to) {
            query += ` AND income_date <= $${parameterIndex}`;
            values.push(to);
            parameterIndex++;
        }

        query += ` ORDER BY income_date DESC`;

        const result = await pool.query(query, values);

        res.status(200).json({
            message: "Income fetched successfully",
            income: result.rows
        });

    } catch (error) {
        console.error("Get Income Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getIncomeById = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const result = await pool.query(
            `SELECT id, amount, description,
            source,
            income_date, created_at
             FROM income WHERE id = $1 AND user_id = $2`,
            [id, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({
            income: result.rows[0]
        });
    } catch (error) {
        console.error("Get Income By Id Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const updateIncome = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const { amount, description, income_date,
        source
         } = req.body;
        const existing = await pool.query(
            "SELECT id FROM income WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "income not found" });
        }
        const result = await pool.query(
            `UPDATE income
             SET amount = COALESCE($1, amount),
                 description = COALESCE($2, description),
                 income_date = COALESCE($3, income_date),
                 source = COALESCE($4, source)
             WHERE id = $5 AND user_id = $6
             RETURNING id, user_id, amount, description, income_date, created_at`,
            [amount || null, description || null, income_date || null, source || null, id, user_id]
        );
        res.status(200).json({
            message: "Income updated successfully",
            income: result.rows[0]
        });
    } catch (error) {
        console.error("Update income Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const deleteIncome = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM income WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "income not found" });
        }
        res.status(200).json({
            message: "income deleted successfully"
        });
    } catch (error) {
        console.error("Delete income Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addIncome,
    getIncome,
    getIncomeById,
    updateIncome,
    deleteIncome
};