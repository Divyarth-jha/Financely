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

const Dashboard = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Redirect/loading while checking auth
  if (loadingAuth) return <p>Loading...</p>;
  if (!user) return <p>Please login to access the dashboard.</p>;

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);

  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  // Add transaction
  const onFinish = (values, type) => {
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

  async function addTransaction(transaction, many) {
    if (!user) return;
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      setTransactions(prev => [...prev, { id: docRef.id, ...transaction }]);
      if (!many) toast.success("Transaction Added!");
    } catch (e) {
      console.error("Error Adding Document:", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  // Reset all transactions
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

      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, `users/${user.uid}/transactions`, document.id))
      );

      await Promise.all(deletePromises);

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

  // Fetch transactions on user load
  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setTransactions(transactionsArray);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      toast.error("Could not fetch transactions");
    } finally {
      setLoading(false);
    }
  }

  // Calculate balance
  useEffect(() => {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach(t => {
      if (t.type === "income") incomeTotal += t.amount;
      else expensesTotal += t.amount;
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }, [transactions]);

  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            resetTransactions={resetTransactions}
          />

          {transactions.length ? (
            <Chart sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}

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

          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
