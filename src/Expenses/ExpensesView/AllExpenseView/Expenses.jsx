import React, { useEffect, useState } from 'react';
import Expense from "../ExpenseView/Expense.jsx";
import './Expenses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EXPENSES_API } from '../../../Constants/ApiConstants.js';

export default function Expenses({userId}) {
    const [expenses,setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [isExpenseDeleted,setIsExpenseDeleted] = useState(false);

    const navigate = useNavigate();

    useEffect(()=> { 
        axios.get(EXPENSES_API.GET_ALL_USERID(userId))   
            .then( response => {
                setExpenses(response.data);
            })
            .catch(error => {
                setError("Error fetching Expenses");
            })
    },[userId,isExpenseDeleted])
    
    const handleDelete = (expenseId) => {
        axios.delete(EXPENSES_API.DELETE_BY_USERID_EXPENSEID(userId,expenseId))
            .then(response => {
                console.log("Expense deleted successfully");
                setIsExpenseDeleted(true);
            })
            .catch(error => {
                console.error("There was an error deleting the expense!", error);
            });
    };

    const handlePlus = ()=>{
        navigate(`/addExpense/${userId}`)
    }

    if(error){
        return <div>{error}</div>
    }
    
    return (
        <div className="expenses-container">
            <div className='expenses-container-header'>
                <h1>Expenses</h1>
                <button onClick={handlePlus}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            
            {
                expenses.map(expense => (
                    <div key={expense.id} className="expense-wrapper"> 
                        <Expense expense={expense} userId={userId} handleDelete={handleDelete}/>
                    </div>                   
                ))
            }
        </div>
    )
}