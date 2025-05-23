import { useContext, useState } from "react";
import TagIcon from "../TagIcon/TagIcon";
import styles from "./FinancialReport.module.css";
import { UserContext } from "../../Context";
import { API_URL } from "../../API";
import Tile from "../FiveTransactions/Tile";
const FinancialReport = () => {
    const userContext = useContext(UserContext);
    const [reportType, setReportType] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [reportData, setReportData] = useState<any>({});

    if (!userContext || !userContext.user) {
        return <div>No User Context</div>;
    }

    const { user } = userContext;
    
    const handleGenerate = async () => {
        if (!reportType) {
            alert("Please fill in all fields.");
            return;
        }

        let tag;
        if (reportType === "Income/Expenses") {
            tag = "income-expenses";
        } else if (reportType === "Budget Summary") {
            tag = "budget-summary";
        } else {
            tag = "savings-progress";
        }

        try {
            let response;
            if (tag === "income-expenses") {
                response = await fetch(`${API_URL}/${tag}/${user.name}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ startDate, endDate }),
                });
            } else {
                response = await fetch(`${API_URL}/${tag}/${user.name}`);
            }
            if (response.ok) {
                const result = await response.json();
                if(typeof(result)==="string"){
                    setReportData(result);
                    return
                }
                if (reportType === "Budget Summary") {
                    result.unshift({
                        category: "Category",
                        target: 0,
                        spent: "Spent",
                        usagePercentage: "UsagePercentage",
                    });
                }
                if (reportType === "Savings Progress") {
                    result.unshift({
                        savingGoal: "Saving Goal",
                        target: 0,
                        current: "Current",
                        progressPercentage: "Progress Percentage",
                    });
                }
                setReportData(result);
                alerts(result);
            }
            else{
                alert("Something went wrong")
            }
        } catch (e:any) {
            alert(`Error fetching report`);
        }
    };

    const alerts =(reportData:any) => {
        let s = "";
        console.log(reportData)
        if (reportType === "Budget Summary") {
            console.log("Budget alerts")
            console.log(reportData)
            reportData.forEach((report: any, index:any) => {
                console.log(reportData)
                if (parseFloat(report.usagePercentage.replace('%', '')) > 90) {
                    s += report.category + " ";
                }
                return;
            });
            console.log(s);
            if(s){
                console.log("alert calling")
                alert(`The categories: ${s} have exceeded 90% of target amount`)
            }
        }
        if (reportType === "Savings Progress") {
            reportData.forEach((report: any) => {
                if (parseFloat(report.progressPercentage.replace('%', '')) > 90) {
                    s += report.savingGoal + " ";
                }
            });
            if(s){
                alert(`The savings: ${s} have exceeded 90% of target amount Congratulations`)
            }
        }
    }
    return (
        <div>
            <TagIcon type="report" />
            <div className={styles.Container}>
                <div className={styles.reportContainer}>
                <label htmlFor="reportType" style={{"marginRight":'10px'}}>Report Type</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a report
                        </option>
                        <option value="Income/Expenses">
                            Income & Expenses
                        </option>
                        <option value="Budget Summary">Budget Summary</option>
                        <option value="Savings Progress">
                            Savings Progress
                        </option>
                    </select>
                    {reportType === "Income/Expenses" && (
                        <div className={styles.dates}>
                            <input
                                type="date"
                                id="startDate"
                                data-testid="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                id="endDate"
                                data-testid="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <button className={styles.button} onClick={() => handleGenerate()}>
                    Generate Report
                </button>
            </div>

            {typeof(reportData)==="string" ? (<div>No corresponding report found</div>) : (<div>
            {reportType === "Income/Expenses" && reportData  && reportData.income && (
                <div className={styles.ieContainer}>
                    <h5>
                        Total Income in provided duration:{" "}
                        {reportData.totalIncome}
                    </h5>
                    <h5>
                        Total Expenses in provided duration:{" "}
                        {reportData.totalExpenses}
                    </h5>
                    <h4>Credit transactions</h4>
                    {reportData.income.map((transaction:any,index:number)=>(
                        <Tile key={index} transaction={transaction}/>
                    ))}
                    <h4>Debit transactions</h4>
                    {reportData.expenses.map((transaction:any,index:number)=>(
                        <Tile key={index} transaction={transaction}/>
                    ))}
                </div>
            )}

            {Array.isArray(reportData) &&  reportType === "Budget Summary" &&
                reportData &&
                reportData.map((report: any,index:any) => (
                    <div key={index}className={styles.budgetContainer}>
                        <div className={styles.name}>{report.category}</div>
                        <div className={styles.spent}>{report.spent}</div>
                        <div className={styles.percentage}>
                            {report.usagePercentage}
                        </div>
                    </div>
                ))}

            {Array.isArray(reportData) &&  reportType === "Savings Progress" &&
                reportData &&
                reportData.map((report: any,index:any) => (
                    <div key={index} className={styles.budgetContainer}>
                        <div className={styles.name}>{report.savingGoal}</div>
                        <div className={styles.spent}>{report.current}</div>
                        <div className={styles.percentage}>
                            {report.progressPercentage}
                        </div>
                    </div>
                ))}
                </div>)}
        </div>
    );
};

export default FinancialReport;
