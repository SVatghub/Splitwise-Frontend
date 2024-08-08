import React, { useEffect, useState } from 'react';
import Expense from "./Expense.jsx";
import './Expenses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Expenses({userId}) {
    const [expenses,setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(()=> { 
        axios.get(`http://localhost:8080/splitwise-app/users/${userId}/expenses`)   
            .then( response => {
                setExpenses(response.data);
            })
            .catch(error => {
                setError("Error fetching Expenses");
            })
    },[userId])
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
                        <Expense dummyExpense={expense} userId={userId}/>
                    </div>                   
                ))
            }
        </div>
    )
}