import styles from "./TagIcon.module.css";
import { GrTable } from "react-icons/gr";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { MdMoney } from "react-icons/md";
import { TbReport } from "react-icons/tb";

const TagIcon = ({ type }: { type: string }) => {
    let tag;
    let IconComponent;
    let id;
    if (type === "transaction") {
        tag = "Add Transaction";
        IconComponent = GrTable;
        id='transaction-icon'
    } else if (type === "budget") {
        tag = "Create Budget";
        IconComponent = BsFillPersonCheckFill;
        id='budget-icon'
    } else if (type === "saving") {
        tag = "Create Saving Goal";
        IconComponent = FaHandHoldingMedical;
        id='saving-icon'
    } else if (type === "recent") {
        tag = "Recent 5 transactions";
        IconComponent = MdMoney;
        id='5'
    } else{
      tag="Generate Reports"
      IconComponent = TbReport;
      id='reports'
    }
    
    return (
        <div className={styles.tagIconContainer}>
            <div className={styles.iconContainer}>
                <IconComponent size={20} color="blue"  data-testid={id}/>
            </div>
            <div className={styles.tagContainer}>
                <h3>{tag}</h3>
            </div>
        </div>
    );
};

export default TagIcon;
