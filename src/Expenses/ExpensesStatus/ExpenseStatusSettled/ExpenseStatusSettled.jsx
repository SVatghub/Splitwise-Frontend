import { IoIosDoneAll } from "react-icons/io";
import "./ExpenseStatusSettled.css";

export default function ExpenseStatusSettled({ expenseSettledDTO }) {
  const formatDateTime = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-GB", options);
  };

  return (
    <div className="expense-settled-container">
      <div className="expense-settled-user-info-container">
        <div>
          <b>Name : </b>
          {expenseSettledDTO.userName}
        </div>
        <div>
          <b>Settled on : </b>
          {formatDateTime(expenseSettledDTO.settledAt)}
        </div>
      </div>
      <div className="expense-settled-amount-container">
        <b> Amount paid : &#8377;{expenseSettledDTO.settlementAmount.toFixed(2)} </b>
        <section className="expense-settled-icon-container">
          <IoIosDoneAll />
        </section>
      </div>
    </div>
  );
}
