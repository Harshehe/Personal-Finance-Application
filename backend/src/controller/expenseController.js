const pool = require("../config/db");
const createExpense = async (req, res) => {
    try {
        const { amount, category, description, expense_date } = req.body;
        const user_id = req.user.id; 
        if (!amount || !category) {
            return res.status(400).json({
                message: "Amount and category are required"
            });
        }
        const result = await pool.query(
            `INSERT INTO expenses (user_id, amount, category, description, expense_date)
             VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
             RETURNING id, user_id, amount, category, description, expense_date, created_at`,
            [user_id, amount, category, description || null, expense_date || null]
        );
        const newExpense = result.rows[0];
        res.status(201).json({
            message: "Expense created successfully",
            expense: newExpense
        });
    } catch (error) {
        console.error("Create Expense Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            category,
            from,
            to
        } = req.query;

        let query = `
            SELECT *
            FROM expenses
            WHERE user_id = $1
        `;

        const values = [userId];
        let parameterIndex = 2;

        if (category) {
            query += ` AND category = $${parameterIndex}`;
            values.push(category);
            parameterIndex++;
        }

        if (from) {
            query += ` AND expense_date >= $${parameterIndex}`;
            values.push(from);
            parameterIndex++;
        }

        if (to) {
            query += ` AND expense_date <= $${parameterIndex}`;
            values.push(to);
            parameterIndex++;
        }

        query += ` ORDER BY expense_date DESC`;

        const result = await pool.query(query, values);

        res.status(200).json({
            message: "Expenses fetched successfully",
            expenses: result.rows
        });

    } catch (error) {
        console.error("Get Expenses Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getExpenseById = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const result = await pool.query(
            `SELECT id, amount, category, description, expense_date, created_at
             FROM expenses WHERE id = $1 AND user_id = $2`,
            [id, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({
            expense: result.rows[0]
        });
    } catch (error) {
        console.error("Get Expense By Id Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const updateExpense = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const { amount, category, description, expense_date } = req.body;
        const existing = await pool.query(
            "SELECT id FROM expenses WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        const result = await pool.query(
            `UPDATE expenses
             SET amount = COALESCE($1, amount),
                 category = COALESCE($2, category),
                 description = COALESCE($3, description),
                 expense_date = COALESCE($4, expense_date)
             WHERE id = $5 AND user_id = $6
             RETURNING id, user_id, amount, category, description, expense_date, created_at`,
            [amount || null, category || null, description || null, expense_date || null, id, user_id]
        );
        res.status(200).json({
            message: "Expense updated successfully",
            expense: result.rows[0]
        });
    } catch (error) {
        console.error("Update Expense Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const deleteExpense = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Delete Expense Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
