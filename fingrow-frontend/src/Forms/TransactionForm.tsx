import { useContext, useState } from "react";
import styles from "./form.module.css";
import { API_URL } from "../API";
import { UserContext } from "../Context";

const TransactionForm = () => {
    const [transactionName, setName] = useState("");
    const [amount, setAmount] = useState<string | number>("");
    const [on, setOn] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <>Context not present</>;
    }

    const { user, setUser } = userContext;
    if (!user) {
        return <>NO user</>;
    }

    const handleAdd = async () => {
        try {
            const response = await fetch(
                `${API_URL}/transaction/${user.name}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName,
                        category,
                        amount,
                        on,
                        date,
                    }),
                }
            );
            console.log(response);
            if (response.ok) {
                alert(`Transaction created`);
                setUser(user);
                setName("");
                setAmount("");
                setCategory("");
                setDate("");
                setOn("");
                const transactionsResponse = await fetch(
                    `${API_URL}/getTransactions/${user.name}`
                );
                if (transactionsResponse.ok) {
                    const updatedTransactions =
                        await transactionsResponse.json();
                    userContext.setTransactions(updatedTransactions); 
                }
            } else {
                const result = await response.json();
                alert(`Something went wrong ${result}`);
            }
        } catch (e) {
            alert("Error while creating transaction");
        }
    };

    return (
        <div className={styles.transactionFormContainer}>
            <div className={styles.column}>
                <input
                    placeholder="Transaction Name"
                    value={transactionName}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    placeholder="Variant"
                    value={on}
                    onChange={(e) => setOn(e.target.value)}
                />
            </div>
            <div className={styles.column}>
                <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button
                    type="submit"
                    className={styles.tbutton}
                    onClick={() => handleAdd()}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default TransactionForm;
