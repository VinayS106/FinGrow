import { useContext, useEffect } from "react";
import TagIcon from "../TagIcon/TagIcon";
import styles from "./Transaction.module.css";
import { UserContext } from "../../Context";
import { API_URL } from "../../API";
import Tile from "./Tile";

const FiveTransactions = () => {
    const userContext = useContext(UserContext);
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/getTransactions/${userContext?.user?.name}`
                );
                if (response.ok) {
                    const data = await response.json();
                        userContext?.setTransactions(data);
                } else {
                    alert("Error fetching Transactions");
                }
            } catch (e) {
                alert(`Error fetching Transactions: ${e}`);
            }
        };
        fetchTransactions();
    }, [userContext?.user?.name, userContext?.transactions, userContext]);

    return (
        <div className={styles.transactionsContainer}>
            <TagIcon data-testid="tag-icon" type="recent" />
            {Array.isArray(userContext?.transactions) &&
            userContext?.transactions.length &&
            userContext?.transactions.length > 0 ? (
                userContext?.transactions.map(
                    (transaction: any, index: number) => (
                        <Tile key={index} transaction={transaction} />
                    )
                )
            ) : (
                <div>No recent Transactions Found</div>
            )}
        </div>
    );
};

export default FiveTransactions;
