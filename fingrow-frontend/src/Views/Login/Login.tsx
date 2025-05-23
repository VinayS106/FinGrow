import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context";
import { API_URL } from "../../API";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <h1>Context not present</h1>;
    }

    const { setUser } = userContext;
    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
            if (response.status===200) {
                const result = await response.json();
                setUser(result)
                navigate("/dashboard");
            } else if (response.status === 500) {
                const result = await response.json();
                alert(`Error logging in: ${result}`);
            }
            else if(response.status===404){
                alert("User with given user name is not present")
            }
            else {
                alert('Invalid Credentials: UnAuthorised.')
            }
        } catch (e) {
            alert("Error occured while fetching user details");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>
                Welcome to FinGrow Finance Application
            </h1>
            <h1>Login</h1>
            <div className={styles.form}>
                <label htmlFor="username" className={styles.label}>User Name:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password" className={styles.label}>Password:</label>
                <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* <input type="file"/> */}
                <button className={styles.button} onClick={() => handleLogin()}>
                    Submit
                </button>
            </div>
            <h5>
                Don't have an account.{" "}
                <span
                    onClick={() => {
                        navigate("/register");
                    }}
                    className={styles.spanContent}
                    data-testid="non-account-holder"
                >
                    Register
                </span>
            </h5>
        </div>
    );
};

export default Login;
