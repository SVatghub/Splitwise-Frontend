import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from './DashBoard/DashBoard'
import Login from './Login/Login';
import AddExpense from './Expenses/AddExpenseView/AddTitleAndAmountView/AddExpense.jsx';
import EditExpense from './Expenses/EditExpenseView/EditExpense.jsx';
import Transactions from './Transactions/Transactions';
import ExpenseStatus from './Expenses/ExpensesStatus/ExpenseStatus.jsx';

function App() {
  return (
    <div className='app'>  
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/:userId" element={<DashBoard />} />
          <Route path="/addExpense/:userId" element={<AddExpense/>} />
          <Route path="/edit-Expense/:userId/:expenseId" element={<EditExpense/>} />
          <Route path="/transactions/:debtUserId/:lenderId" element = {<Transactions/>} />
          <Route path='/dashboard/:userId/expenses/expense/:expenseId/status' element = {<ExpenseStatus/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
