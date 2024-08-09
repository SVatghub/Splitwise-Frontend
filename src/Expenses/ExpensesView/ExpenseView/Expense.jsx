import React from 'react';
import './Expense.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Expense({ expense, userId,handleDelete }) {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleEdit = (expenseId) => {
        navigate(`/edit-expense/${userId}/${expenseId}`);
    };

    return (
        <div className="expense">
            <div className="expense-actions">
                <button className="expense-button edit-button" onClick={() => handleEdit(expense.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="expense-button delete-button" onClick={() => handleDelete(expense.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <div className="expense-details">
                <p className="expense-title">{expense.title}</p>
                <p className="expense-date">
                    {formatDate(expense.createdAt)}
                </p>
            </div>
            <p className="expense-amount">&#8377;{expense.amount.toFixed(2)}</p>
        </div>
    );
}