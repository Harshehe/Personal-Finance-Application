import { useState } from "react";

function Expenses() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <h1>Expenses</h1>

            <button onClick={() => setShowForm(true)}>
                Add Expense
            </button>

            {showForm && (
                <div>
                    <h2>Add Expense</h2>

                    <form>
                        <div>
                            <label>Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Food"
                            />
                        </div>

                        <div>
                            <label>Amount</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div>
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="Enter description"
                            />
                        </div>

                        <div>
                            <label>Date</label>
                            <input type="date" />
                        </div>

                        <div>
                            <label>Payment Method</label>
                            <select>
                                <option value="">
                                    Select payment method
                                </option>
                                <option value="UPI">UPI</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>
                            </select>
                        </div>

                        <button type="submit">
                            Save Expense
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div>
                <input
                    type="text"
                    placeholder="Search expenses..."
                />

                <select>
                    <option value="">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Food</td>
                        <td>Groceries</td>
                        <td>₹2,500</td>
                        <td>2026-09-10</td>
                        <td>UPI</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Expenses;