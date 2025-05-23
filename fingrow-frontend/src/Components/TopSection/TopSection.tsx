import React, { useContext } from 'react'
import styles from './TopSection.module.css'
import { UserContext } from '../../Context'
const TopSection = () => {
  const userContext  = useContext(UserContext);
  if(!userContext){
    return <>
    Context not present</>
  }

  const {user} = userContext
  if(!user){
    return <>User not found</>
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <p>Welcome <span className={styles.spanContent}>{user.name}</span></p>
        <h3>Your One Stop <span className={styles.spanContent}>Finance <br/> Management System</span></h3>
      </div>
      <div>
        <img className={styles.img} src='./assets/img1.png' alt="finance"/>
      </div>
    </div>
  )
}

export default TopSection
