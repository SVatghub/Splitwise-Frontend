import React, { useState } from 'react';
import './Expense.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { LuMoreVertical } from "react-icons/lu";
import deleteAnimation from '../../../assets/deleteAnimation.json';  

export default function Expense({ expense, userId, handleDelete }) {
    const navigate = useNavigate();
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleEdit = (expenseId) => {
        navigate(`/edit-expense/${userId}/${expenseId}`);
    };

    const handleDeleteClick = () => {
        setIsAnimationPlaying(true);
        setTimeout(() => {
            handleDelete(expense.id);
        }, 1000); 
    };

    const handleShowStatus = (userId, expenseId) => {
        navigate(`/dashboard/${userId}/expenses/expense/${expenseId}/status`);
    };

    return (
        <div className="expense">
            {isAnimationPlaying ? (
                <Lottie 
                    animationData={deleteAnimation} 
                    loop={false} 
                    className="lottie-animation" 
                />
            ) : (
                <>
                    <div className="expense-actions">
                        <button className="expense-button edit-button" onClick={() => handleEdit(expense.id)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="expense-button delete-button" onClick={handleDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button className='expense-button status-button' onClick={() => handleShowStatus(userId, expense.id)}>
                            <LuMoreVertical />
                        </button>
                    </div>
                    <div className="expense-details">
                        <p className="expense-title">{expense.title}</p>
                        <p className="expense-date">
                            {formatDate(expense.createdAt)}
                        </p>
                    </div>
                    <p className="expense-amount">&#8377;{expense.amount.toFixed(2)}</p>
                </>
            )}
        </div>
    );
}