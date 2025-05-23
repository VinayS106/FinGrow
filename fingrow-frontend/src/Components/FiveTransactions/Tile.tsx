import styles from "./Transaction.module.css";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
const Tile = ({ transaction }: { transaction: any }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getUTCFullYear();

        return `${day} ${month} ${year}`;
    };
    return (
        <div className={styles.transaction} data-testid="tile">
            <div className={styles.icon}>
                {transaction.type === "credit" ? (
                    <FiArrowDownLeft size={30} color="blue" />
                ) : (
                    <FiArrowUpRight size={30} color="blue" />
                )}
            </div>
            <div className={styles.details}>
                <div className={styles.leftSection}>
                    <p>
                        {transaction.transactionName} -{transaction.title}
                    </p>
                    <p className={styles.date}>
                        {formatDate(transaction.date)}
                    </p>
                </div>
                <div
                    className={`${styles.rightSection} ${
                        transaction.type === "credit"
                            ? styles.green
                            : styles.red
                    }`}
                >
                    {transaction.type === "credit" ? "+" : "-"}Rs.
                    {transaction.amount}
                </div>
            </div>
        </div>
    );
};

export default Tile;
