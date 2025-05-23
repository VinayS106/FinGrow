import Budget from "../Budget/Budget";
import Savings from "../Savings/Savings";
import Transactions from "../Transactions/Transactions";
import FiveTransactions from "../FiveTransactions/FiveTransactions";
import styles from "./Expensess.module.css";
import FinancialReport from "../Report/FinancialReport";

const Expenses = () => {
    return (
        <>
            <div className={styles.header}>
                <h3>Record Expenses</h3>
            </div>
            <div className={styles.container}>
                <Transactions />
                <Budget />
                <Savings />
                <FiveTransactions />
                <FinancialReport />
            </div>
        </>
    );
};

export default Expenses;
