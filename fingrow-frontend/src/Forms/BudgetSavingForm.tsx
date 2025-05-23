import { useContext, useState } from "react";
import styles from "./form.module.css";
import { API_URL } from "../API";
import { UserContext } from "../Context";

const BudgetSavingForm = ({ type }: { type: string }) => {
    const [title, setTitle]  = useState('')
    const [target, setTarget]  = useState<string|number>('')

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <>Context not present</>;
    }

    const { user } = userContext;
    if (!user) {
        return <>NO user</>;
    }


    const handleCreate = async () => {
        const tag = type === "savings" ? "savings" : "budget";
        try {
            const response = await fetch(`${API_URL}/${tag}/${user.name}`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, target }),
            });
            if(response.status===200){
                alert(`${tag.toUpperCase()} created`);
                setTitle('');
                setTarget('')
            }
            else if(response.status===400){
                alert(`Form Incomplete`)
            }
            else{
                alert(`Error creating ${tag}`)
            }

        } catch (e) {
            alert(`Error creating ${tag}`);
        }
    };
    return (
        <div className={styles.formContainer}>
            <input data-testid="category-input" required type="text" placeholder="Category" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input data-testid="amount-input"  required type="number" placeholder="Amount" value={target} onChange={(e)=>setTarget(e.target.value)} />
            <button type="submit" className={styles.button} onClick={()=>handleCreate()}>Create</button>
        </div>
    );
};

export default BudgetSavingForm;
