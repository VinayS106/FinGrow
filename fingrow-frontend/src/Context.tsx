import React, { createContext, useState, ReactNode } from 'react';

interface User {
    name: string;
    password: string;
    totalIncome:number;
    balance:number
}
interface Transaction {
    transactionName:string
    title:string
    amount: number;
    type: string;
    on: string;
    date: Date;
    userId: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    transactions: Transaction[];
    setTransactions : (transaction:Transaction[]) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    return (
        <UserContext.Provider value={{ user, setUser,transactions, setTransactions}}>
            {children}
        </UserContext.Provider>
    );
};