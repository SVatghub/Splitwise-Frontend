import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import './Transactions.css';
import { SETTLEMENT_API, USERS_API } from "../Constants/ApiConstants";
import { IoArrowBack } from "react-icons/io5";

export default function Transactions() {
    const { debtUserId, lenderId } = useParams();
    const [expensesDTOSFromDebtUser, setExpensesDTOSFromDebtUser] = useState([]);
    const [expensesDTOSFromLender, setExpensesDTOSFromLender] = useState([]);
    const [debtUserName, setDebtUserName] = useState('');
    const [lenderName, setLenderName] = useState('');

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const debtUserResponse = await axios.get(SETTLEMENT_API.GET_TRANSACTION_HISTORY_BETWEEN_TWO_USERS(debtUserId, lenderId));
                setExpensesDTOSFromDebtUser(debtUserResponse.data.expensesDTOS);

                const lenderResponse = await axios.get(SETTLEMENT_API.GET_TRANSACTION_HISTORY_BETWEEN_TWO_USERS(lenderId, debtUserId));
                setExpensesDTOSFromLender(lenderResponse.data.expensesDTOS);

                const debtUserDetails = await axios.get(USERS_API.GET_BY_ID(debtUserId));
                setDebtUserName(debtUserDetails.data.name);

                const lenderDetails = await axios.get(USERS_API.GET_BY_ID(lenderId));
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
                <p>Created at : {new Date(dto.createdAt).toLocaleString()}</p>
                <hr />
            </div>
        ));
    };

    return (
        <div className="transactions-container">
            <button className="back-button" onClick={() => navigate(-1)}><IoArrowBack /></button> 
            <h1>Transactions Between {debtUserName} and {lenderName}</h1>
            <div className="transaction-sections">
                <div className="transaction-section">
                    <h2>{debtUserName} has to Pay {lenderName}</h2>
                    {renderTransactions(expensesDTOSFromDebtUser, debtUserName, lenderName)}
                </div>
                <div className="transaction-section">
                    <h2>{lenderName} has to Pay {debtUserName}</h2>
                    {renderTransactions(expensesDTOSFromLender, lenderName, debtUserName)}
                </div>
            </div>
        </div>
    );
}