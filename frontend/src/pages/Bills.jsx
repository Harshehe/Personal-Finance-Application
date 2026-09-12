import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/bills";

function Bills() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Add/Edit form
    const [showForm, setShowForm] = useState(false);
    const [editingBill, setEditingBill] = useState(null);

    const [formData, setFormData] = useState({
        bill_name: "",
        amount: "",
        category: "",
        frequency: "monthly",
        description: "",
        start_date: "",
        end_date: ""
    });

    // Fetch bills
    const fetchBills = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch bills"
                );
            }

            setBills(data.bills || []);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add Bill
    const handleAddBill = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount),
                    end_date: formData.end_date || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add bill"
                );
            }

            // Clear form
            resetForm();

            // Refresh bills
            fetchBills();

        } catch (error) {
            setError(error.message);
        }
    };

    // Edit Bill
    const handleEditBill = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/${editingBill.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bill_name: formData.bill_name,
                        amount: Number(formData.amount),
                        category: formData.category,
                        frequency: formData.frequency,
                        description: formData.description,
                        start_date: formData.start_date,
                        end_date: formData.end_date || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update bill"
                );
            }

            // Clear form and exit edit mode
            resetForm();

            // Refresh bills
            fetchBills();

        } catch (error) {
            setError(error.message);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            bill_name: "",
            amount: "",
            category: "",
            frequency: "monthly",
            description: "",
            start_date: "",
            end_date: ""
        });

        setEditingBill(null);
        setShowForm(false);
    };

    // Start editing a bill
    const startEditing = (bill) => {
        setEditingBill(bill);

        setFormData({
            bill_name: bill.bill_name || "",
            amount: bill.amount || "",
            category: bill.category || "",
            frequency: bill.frequency || "monthly",
            description: bill.description || "",
            start_date: bill.start_date
                ? bill.start_date.split("T")[0]
                : "",
            end_date: bill.end_date
                ? bill.end_date.split("T")[0]
                : ""
        });

        setShowForm(true);
    };

    if (loading) {
        return <h2>Loading bills...</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>

            <h1>My Bills</h1>

            {/* Error message */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* Add Bill Button */}
            <button
                onClick={() => {
                    if (showForm) {
                        resetForm();
                    } else {
                        setShowForm(true);
                    }
                }}
                style={{
                    padding: "10px 20px",
                    marginBottom: "20px",
                    cursor: "pointer"
                }}
            >
                {showForm ? "Cancel" : "+ Add Bill"}
            </button>

            {/* Add/Edit Form */}
            {showForm && (
                <form
                    onSubmit={
                        editingBill
                            ? handleEditBill
                            : handleAddBill
                    }
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "30px",
                        maxWidth: "500px"
                    }}
                >

                    <h2>
                        {editingBill
                            ? "Edit Bill"
                            : "Add New Bill"}
                    </h2>

                    {/* Bill Name */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Bill Name</label>

                        <input
                            type="text"
                            name="bill_name"
                            value={formData.bill_name}
                            onChange={handleChange}
                            placeholder="e.g. Rent"
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />
                    </div>

                    {/* Amount */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Amount</label>

                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g. 25000"
                            min="0"
                            step="0.01"
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Category</label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Utilities"
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />
                    </div>

                    {/* Frequency */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Frequency</label>

                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        >
                            <option value="monthly">
                                Monthly
                            </option>

                            <option value="yearly">
                                Yearly
                            </option>

                            <option value="one-time">
                                One-time
                            </option>
                        </select>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional description"
                            rows="3"
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />
                    </div>

                    {/* Start Date */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>Start Date</label>

                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />
                    </div>

                    {/* End Date */}
                    <div style={{ marginBottom: "15px" }}>
                        <label>End Date (Optional)</label>

                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer"
                        }}
                    >
                        {editingBill
                            ? "Update Bill"
                            : "Add Bill"}
                    </button>

                </form>
            )}

            {/* Bills List */}
            {bills.length === 0 ? (
                <p>No bills found.</p>
            ) : (
                <div>

                    {bills.map((bill) => (
                        <div
                            key={bill.occurrence_id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "20px",
                                marginBottom: "15px"
                            }}
                        >

                            <h2>{bill.bill_name}</h2>

                            <p>
                                <strong>Amount:</strong>{" "}
                                ₹{bill.amount}
                            </p>

                            <p>
                                <strong>Category:</strong>{" "}
                                {bill.category}
                            </p>

                            <p>
                                <strong>Frequency:</strong>{" "}
                                {bill.frequency}
                            </p>

                            <p>
                                <strong>Due Date:</strong>{" "}
                                {new Date(
                                    bill.due_date
                                ).toLocaleDateString("en-IN")}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {bill.status}
                            </p>

                            {bill.paid_date && (
                                <p>
                                    <strong>Paid Date:</strong>{" "}
                                    {new Date(
                                        bill.paid_date
                                    ).toLocaleDateString("en-IN")}
                                </p>
                            )}

                            {/* Edit Button */}
                            <button
                                onClick={() =>
                                    startEditing(bill)
                                }
                                style={{
                                    padding: "8px 15px",
                                    cursor: "pointer"
                                }}
                            >
                                Edit
                            </button>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Bills;

