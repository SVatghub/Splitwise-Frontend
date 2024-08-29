import axios from "axios";
import { EXPENSES_API } from "../../Constants/ApiConstants";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { IoArrowBack } from "react-icons/io5";
import "./ExpenseStatus.css";
import ExpenseStatusSettled from "./ExpenseStatusSettled/ExpenseStatusSettled";
import ExpenseStatusNotSettled from "./ExpenseStatusNotSettled/ExpenseStatusNotSettled";

export default function ExpenseStatus() {
  const{userId} = useParams();
  const{expenseId}= useParams();
  const [status, setStatus] = useState({
    userSettledDTOList: [],
    userNotSettledDTOList: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(EXPENSES_API.GET_EXPENSE_STATUS(userId, expenseId))
      .then((response) => {
        setStatus(response.data);
      })
      .catch((e) => {
        console.log("error fetching expense status", e);
      });
  }, [userId, expenseId]);

  return (
    <div className="expense-status-container">
      <div className="expense-header-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </button>
        <h1>Expense Status</h1>
      </div>
     
      <div className="expense-status-body">
      <h2>Payment Received</h2>
        <div>
            {status.userSettledDTOList.length > 0 ? (
              status.userSettledDTOList.map((user) => (
              <ExpenseStatusSettled key={user.userId} expenseSettledDTO={user}/>
              ))
            ) : (
              <p>No payments have been received yet.</p>
            )}
        </div>
      <h2>Payment Pending</h2>
        <div>
            {status.userNotSettledDTOList.length > 0 ? (
              status.userNotSettledDTOList.map((user) => (
              <ExpenseStatusNotSettled key={user.userId} expenseNotSettledDTO={user}/>
              ))
            ) : (
              <p>All payments received</p>
            )}
          </div>
      </div>
    </div>
  );
}