import styles from './Transaction.module.css'
import TagIcon from '../TagIcon/TagIcon'
import TransactionForm from '../../Forms/TransactionForm'

const Transactions = () => {
  return (
    <div className={styles.transactionContainer}>
      <TagIcon type="transaction"/>
      <TransactionForm/>
    </div>
  )
}

export default Transactions
