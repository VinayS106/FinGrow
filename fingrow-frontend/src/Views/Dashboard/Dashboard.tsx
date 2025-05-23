import Expenses from "../../Components/Expenses/Expenses";
import TopSection from "../../Components/TopSection/TopSection";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    return (
        <div>
            <div className={styles.header}>
                <h4>
                    Fin<span className={styles.spanContent}>Grow</span>
                </h4>
            </div>
            <TopSection />
            <Expenses />
        </div>
    );
};

export default Dashboard;
