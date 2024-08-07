import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './Transactions.css';

export default function Transactions() {
    const { debtUserId, lenderId } = useParams();
    const [expensesDTOSFromDebtUser, setExpensesDTOSFromDebtUser] = useState([]);
    const [expensesDTOSFromLender, setExpensesDTOSFromLender] = useState([]);
    const [debtUserName, setDebtUserName] = useState('');
    const [lenderName, setLenderName] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const debtUserResponse = await axios.get(`http://localhost:8080/Splitwise-App/users/${debtUserId}/settle/${lenderId}`);
                setExpensesDTOSFromDebtUser(debtUserResponse.data.expensesDTOS);

                const lenderResponse = await axios.get(`http://localhost:8080/Splitwise-App/users/${lenderId}/settle/${debtUserId}`);
                setExpensesDTOSFromLender(lenderResponse.data.expensesDTOS);

                const debtUserDetails = await axios.get(`http://localhost:8080/Splitwise-App/users/${debtUserId}`);
                setDebtUserName(debtUserDetails.data.name);

                const lenderDetails = await axios.get(`http://localhost:8080/Splitwise-App/users/${lenderId}`);
                setLenderName(lenderDetails.data.name);
            } catch (error) {
                console.error("Error getting history", error);
            }
        };

        fetchTransactions();
    }, [debtUserId, lenderId]);

    const renderTransactions = (transactions, fromName, toName) => {
        return transactions.map(dto => (
            <div key={dto.id} className="transaction">
                <p><strong>{dto.title}</strong></p>
                <p>Amount: &#8377;{dto.amount.toFixed(2)}</p>
                <p>Created At: {new Date(dto.createdAt).toLocaleString()}</p>
                <hr />
            </div>
        ));
    };

    return (
        <div className="transactions-container">
            <h1>Transactions Between {debtUserName} and {lenderName}</h1>
            <div className="transaction-section">
                <h2>From {debtUserName} to {lenderName}</h2>
                {renderTransactions(expensesDTOSFromDebtUser, debtUserName, lenderName)}
            </div>
            <div className="transaction-section">
                <h2>From {lenderName} to {debtUserName}</h2>
                {renderTransactions(expensesDTOSFromLender, lenderName, debtUserName)}
            </div>
        </div>
    );
}