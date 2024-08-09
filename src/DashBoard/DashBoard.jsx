import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Debts from '../Debts/DebtsView/Debts';
import Expenses from '../Expenses/ExpensesView/AllExpenseView/Expenses';
import { useParams } from 'react-router-dom';
import './DashBoard.css';
import { USERS_API } from '../Constants/ApiConstants';

export default function DashBoard() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) { 
            axios.get(USERS_API.GET_BY_ID(userId))
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setError("There was an error fetching the user details!");
                    setLoading(false);
                });
        }
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='dashboard'>
            <div className='dashboard-heading'>
                <h1>Splitwise App</h1>
                {user && <h1>{user.name}</h1>}
            </div>
            <div className="dashboard-container">
                <div className="component-container">
                    <Expenses userId={userId}/>
                </div>
                <div className="component-container">
                    <Debts userId={userId}/>
                </div>
            </div>
        </div>
    );
}