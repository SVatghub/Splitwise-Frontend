import './App.css'
import DashBoard from './DashBoard/DashBoard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Expenses from './Expense/Expenses';
import Debts from './Debts/Debts';
import AddExpense from './Adding Expense/AddExpense/AddExpense/AddExpense';
import AddPayee from './Adding Expense/AddExpense/AddPayee/AddPayee';
import SplitExpense from './Adding Expense/AddExpense/SplitExpense/SplitExpense';
import EditExpense from './EditExpense/EditExpense';
import Transactions from './Transactions/Transactions';

function App() {
  return (
    <>  
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/:userId" element={<DashBoard />} />
          <Route path="/addExpense/:userId" element={<AddExpense/>} />
          <Route path="/edit-Expense/:userId/:expenseId" element={<EditExpense/>} />
          <Route path="/transactions/:debtUserId/:lenderId" element = {<Transactions/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
