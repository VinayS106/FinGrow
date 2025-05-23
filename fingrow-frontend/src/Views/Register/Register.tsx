import React, { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../API";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totalIncome, setTotalIncome] = useState<string|number>("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const balance = totalIncome;
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    password,
                    totalIncome,
                    balance,
                }),
            });
            if (response.ok) {
                alert("User created succesfully");
                navigate('/');
            } else {
                alert("Error creating user");
            }
        } catch (e: any) {
            alert(`Error creating User`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>
                Welcome to FinGrow Finance Application
            </h1>
            <h1>Register</h1>
            <div className={styles.form}>
                <label htmlFor="username" className={styles.label}>User Name:</label>
                <input
                required
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password" className={styles.label}>Password:</label>
                <input
                required
                    id="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="totalIncome" className={styles.label}>Total Income:</label>
                <input
                required
                    id="totalIncome"
                    type="number"
                    value={totalIncome}
                    onChange={(e) => setTotalIncome(parseInt(e.target.value))}
                />
                <button
                    className={styles.button}
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Submit
                </button>
            </div>
            <h5>
                Already have an account.{" "}
                <span
                    onClick={() => {
                        navigate('/');
                    }}
                    className={styles.spanContent}
                    data-testid="account-holder"
                >
                    Login
                </span>
            </h5>
        </div>
    );
};

export default Register;
