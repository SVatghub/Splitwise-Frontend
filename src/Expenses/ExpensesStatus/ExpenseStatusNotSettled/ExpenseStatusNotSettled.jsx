import "./ExpenseStatusNotSettled.css";
import { ImCross } from "react-icons/im";

export default function ExpenseStatusNotSettled({expenseNotSettledDTO}) {

  return (
    <div className="expense-not-settled-container">
      <section className="expense-not-settled-user-info-container">
        <b>Name :</b> {expenseNotSettledDTO.userName  }
      </section>
      <section className="expense-not-settled-amount-container">
          <b>Pending amount : &#8377;{expenseNotSettledDTO.settlementAmount}</b> 
         <section className="expense-not-settled-icon-container">
          <ImCross />
        </section>
      </section>
    </div>
  );
}