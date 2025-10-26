import React, { useEffect, useState } from 'react';
import moment from "moment";
import Header from '../components/Header';
import Cards from '../components/cards/card';
import AddExpenseModal from '../components/Modals/addexpense';
import AddIncomeModal from '../components/Modals/addincome';
import { deleteDoc, doc, addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionsTable from '../components/TransactionTable';
import Chart from '../components/Charts/Charts';
import NoTransactions from '../components/NOtransaction';
import Welcome from '../components/welcome/welcome';


const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);

  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    // Make sure values.date is valid
    const date =
      values.date && typeof values.date.format === "function"
        ? values.date.format("YYYY-MM-DD")
        : moment(values.date).format("YYYY-MM-DD");
    const newTransaction = {
      type,
      date,
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
 



  async function resetTransactions() {
  if (!user) return;
  try {
    setLoading(true);

    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.info("No transactions to reset.");
      setLoading(false);
      return;
    }

    // Delete all documents
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, `users/${user.uid}/transactions`, document.id))
    );

    await Promise.all(deletePromises);

    // Reset local state
    setTransactions([]);
    setIncome(0);
    setExpense(0);
    setTotalBalance(0);

    toast.success("All transactions have been reset!");
  } catch (e) {
    console.error("Error resetting transactions:", e);
    toast.error("Could not reset transactions");
  } finally {
    setLoading(false);
  }
}



  // adddtransaction
 async function addTransaction(transaction, many) {
  if (!user) return;
  try {
    const docRef = await addDoc(
      collection(db, `users/${user.uid}/transactions`),
      transaction
    );
    console.log("Document written with Id: ", docRef.id);

    // Only show toast if not a batch
    if (!many) toast.success("Transaction Added!");
    setTransactions(prevTransactions => [...prevTransactions, transaction]);
  } catch (e) {
    console.error("Error Adding Document:", e);
    if (!many) toast.error("Couldn't add transaction");
  }
}


  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((docSnap) => {
        transactionsArray.push({ id: docSnap.id, ...docSnap.data() });
        });
        setTransactions(transactionsArray);
        // console.log("Transaction array", transactionsArray);
        toast.success("Transactions fetched");
      } catch (e) {
        console.error("Error fetching transactions:", e);
        toast.error("Could not fetch transactions");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach(transaction => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }

 

 let shortedTransactions = [...transactions].sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});


  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
         <Welcome/>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
             resetTransactions={resetTransactions} 
          />
          {transactions && transactions.length!= 0 ? <Chart shortedTransactions={shortedTransactions} /> : <NoTransactions/>}
          

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
           
          />
           
          <TransactionsTable transactions={transactions}  addTransaction={ addTransaction}/>
        </>
      )}
    </div>
  );
};

export default Dashboard;
