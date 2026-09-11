import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Dashboard() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/dashboard/summary`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(data.message);
                    return;
                }

                setSummary(data);

            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };

        fetchSummary();
    }, []);

    console.log("Dashboard summary:", summary);

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Welcome to your finance dashboard.</p>

            <div>
                <h2>Total Income</h2>
                <p>{summary ? `₹${summary.summary.totalIncome}` : "Loading..."}</p>
            </div>

            <div>
                <h2>Total Expenses</h2>
                <p>{summary ? `₹${summary.summary.totalExpenses}` : "Loading..."}</p>
            </div>

            <div>
                <h2>Savings</h2>
                <p>{summary ? `₹${summary.summary.savings}` : "Loading..."}</p>
            </div>
        </div>
    );
}

export default Dashboard;