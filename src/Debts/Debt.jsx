import React from 'react';
import './Debt.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Debt({ Debt, debtUserId }) {
    const navigate = useNavigate();

    const handleSettle = async () => {
        try {
            await axios.put(`http://localhost:8080/splitwise-app/users/${debtUserId}/settle/${Debt.userId}`);
            alert('Debt settled successfully');
        } catch (error) {
            console.error('Error settling debt', error);
        }
    };

    const handleTransaction = () => {
        navigate(`/transactions/${debtUserId}/${Debt.userId}`);
    };

    return (
        <div className="debt-container">
            <div className="debt-details">
                <p className="debt-name">{Debt.name}</p>
                <p className="debt-amount">&#8377;{Debt.amount.toFixed(2)}</p>
            </div>
            <div className="debt-buttons">
                <button className="settle-button" onClick={handleSettle}>Settle</button>
                <button className="transaction-button" onClick={handleTransaction}>
                    Transactions
                    <FontAwesomeIcon icon={faCaretDown} />
                </button>
            </div>
        </div>
    );
}