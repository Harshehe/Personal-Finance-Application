const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const incomeResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_income
             FROM income
             WHERE user_id = $1`,
            [userId]
        );

        const expenseResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_expenses
             FROM expenses
             WHERE user_id = $1`,
            [userId]
        );

        const totalIncome = Number(incomeResult.rows[0].total_income);
        const totalExpenses = Number(expenseResult.rows[0].total_expenses);

        const savings = totalIncome - totalExpenses;

        res.status(200).json({
            message: "Dashboard summary fetched successfully",
            summary: {
                totalIncome,
                totalExpenses,
                savings
            }
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get current month's income
        const incomeResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_income
             FROM income
             WHERE user_id = $1
             AND income_date >= DATE_TRUNC('month', CURRENT_DATE)
             AND income_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`,
            [userId]
        );

        // Get current month's expenses
        const expenseResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_expenses
             FROM expenses
             WHERE user_id = $1
             AND expense_date >= DATE_TRUNC('month', CURRENT_DATE)
             AND expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`,
            [userId]
        );

        const totalIncome = Number(incomeResult.rows[0].total_income);
        const totalExpenses = Number(expenseResult.rows[0].total_expenses);

        const savings = totalIncome - totalExpenses;

        res.status(200).json({
            message: "Monthly summary fetched successfully",
            month: new Date().toLocaleString("en-US", {
                month: "long",
                year: "numeric"
            }),
            summary: {
                totalIncome,
                totalExpenses,
                savings
            }
        });

    } catch (error) {
        console.error("Monthly Summary Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getCategorySummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 
                category,
                SUM(amount) AS total
             FROM expenses
             WHERE user_id = $1
             GROUP BY category
             ORDER BY total DESC`,
            [userId]
        );

        const categories = result.rows.map(row => ({
            category: row.category,
            total: Number(row.total)
        }));

        res.status(200).json({
            message: "Category summary fetched successfully",
            categories
        });

    } catch (error) {
        console.error("Category Summary Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM (
                 SELECT
                     id,
                     'expense' AS title,
                     category AS type,
                     -amount,
                     expense_date AS transaction_date
                 FROM expenses
                 WHERE user_id = $1

                 UNION ALL

                 SELECT
                     id,
                     'income' AS title,
                     source AS type,
                     amount,
                     income_date AS transaction_date
                 FROM income
                 WHERE user_id = $1
             ) AS transactions
             ORDER BY transaction_date DESC
             LIMIT 10`,
            [userId]
        );

        res.status(200).json({
            message: "Recent transactions fetched successfully",
            transactions: result.rows
        });

    } catch (error) {
        console.error("Recent Transactions Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboardSummary,
    getMonthlySummary,
    getCategorySummary,
    getRecentTransactions
};