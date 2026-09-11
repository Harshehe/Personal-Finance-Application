const pool = require("../config/db");
const { get } = require("../routes/billRoutes");

const createBill = async (req, res) => {

    try {
        const {
            bill_name,
            amount,
            category,
            frequency,
            description,
            start_date,
            end_date
        } = req.body;

        const user_id = req.user.id;

        if (!bill_name || !amount || !category || !frequency) {
            return res.status(400).json({
                message: "Bill name, amount, category and frequency are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO bills
             (user_id, bill_name, amount, category, frequency, description,start_date,end_date)
             VALUES ($1, $2, $3, $4, $5, $6,COALESCE($7, CURRENT_DATE), $8)
             RETURNING id, user_id, bill_name, amount, category,
                       frequency, description,start_date, end_date, created_at`,
            [
                user_id,
                bill_name,
                amount,
                category,
                frequency,
                description || null,
                start_date || null,
                end_date || null
            ]
        );

        const newBill = result.rows[0];

        await pool.query(
            `INSERT INTO bill_occurrences
            (bill_id, due_date, status)
            VALUES ($1, $2, $3)`,
    [
        newBill.id,
        start_date || new Date().toISOString().split("T")[0],
        "upcoming"
    ]
);

        res.status(201).json({
            message: "Bill created successfully",
            bill: newBill
        });

    } catch (error) {
        console.error("Create Bill Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getBillById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT
                b.id,
                b.bill_name,
                b.amount,
                b.category,
                b.frequency,
                b.description,
                b.start_date,
                b.end_date,
                o.id AS occurrence_id,
                o.due_date,
                o.paid_date,
                o.status,
                o.payment_method
             FROM bills b
             LEFT JOIN bill_occurrences o
                ON b.id = o.bill_id
             WHERE b.id = $1
             AND b.user_id = $2
             ORDER BY o.due_date ASC`,
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        res.status(200).json({
            message: "Bill fetched successfully",
            bill: result.rows
        });

    } catch (error) {
        console.error("Get Bill By ID Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getBills = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT
                b.id,
                b.bill_name,
                b.amount,
                b.category,
                b.frequency,
                b.description,
                b.start_date,
                b.end_date,
                o.id AS occurrence_id,
                o.due_date,
                o.paid_date,
                o.status,
                o.payment_method
             FROM bills b
             LEFT JOIN bill_occurrences o
                ON b.id = o.bill_id
             WHERE b.user_id = $1
             ORDER BY o.due_date ASC`,
            [user_id]
        );

        res.status(200).json({
            message: "Bills fetched successfully",
            bills: result.rows
        });

    } catch (error) {
        console.error("Get Bills Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const updateBill = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            bill_name,
            amount,
            category,
            frequency,
            description,
            start_date,
            end_date
        } = req.body;

        const user_id = req.user.id;

        const result = await pool.query(
            `UPDATE bills
             SET
                bill_name = $1,
                amount = $2,
                category = $3,
                frequency = $4,
                description = $5,
                start_date = $6,
                end_date = $7,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             AND user_id = $9
             RETURNING id, user_id, bill_name, amount, category,
                       frequency, description, start_date, end_date,
                       updated_at`,
            [
                bill_name,
                amount,
                category,
                frequency,
                description || null,
                start_date,
                end_date || null,
                id,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        res.status(200).json({
            message: "Bill updated successfully",
            bill: result.rows[0]
        });

    } catch (error) {
        console.error("Update Bill Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            `DELETE FROM bills
             WHERE id = $1
             AND user_id = $2
             RETURNING id`,
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        res.status(200).json({
            message: "Bill deleted successfully"
        });

    } catch (error) {
        console.error("Delete Bill Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createBill,
    getBillById,
    updateBill,
    deleteBill,
    getBills
};