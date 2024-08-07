import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './SplitExpense.css';

function getEqualSplits(countUsers, splitAmount) {
    return Array(countUsers).fill(splitAmount / countUsers);
}

export default function SplitExpense({ addedUsers, splitAmount, currentUser, title, isValidTitleAndAmount }) {
    const [usersWithCurrentUser, setUsersWithCurrentUser] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const navigator = useNavigate();

    useEffect(() => {
        const allUsers = [...addedUsers, currentUser];
        setUsersWithCurrentUser(allUsers);
        setAmounts(getEqualSplits(allUsers.length, splitAmount));
    }, [addedUsers, currentUser, splitAmount]);

    const handleChange = (userId, value) => {
        const newAmounts = amounts.map((amt, index) =>
            usersWithCurrentUser[index].userId === userId ? parseFloat(value) || 0 : amt
        );

        const total = newAmounts.reduce((acc, amt) => acc + amt, 0);
        setAmounts(newAmounts);
        setIsValid(total === splitAmount);
    };

    const handleRemove = (userId) => {
        // Remove user from the list
        const updatedUsers = usersWithCurrentUser.filter(user => user.userId !== userId);
        setUsersWithCurrentUser(updatedUsers);
        // Remove corresponding amount
        const updatedAmounts = amounts.filter((_, index) => usersWithCurrentUser[index].userId !== userId);
        setAmounts(updatedAmounts);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (isValid) {
            const debtUsersList = usersWithCurrentUser
                .filter(user => user.userId !== currentUser.userId)
                .map((user, index) => ({
                    userId: user.userId,
                    debtAmount: amounts[index],
                    isSettled: false
                }));

            const expenseData = {
                title,
                amount: splitAmount,
                debtUsersList
            };

            try {
                await axios.post(`http://localhost:8080/Splitwise-App/users/${currentUser.userId}/expenses`, expenseData, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                console.log("Expense added successfully.");
                navigator(`/dashboard/${currentUser.userId}`);
            } catch (error) {
                console.error("There was an error posting the expense!", error);
            }
        } else {
            alert("Total splits must equal the split amount.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {usersWithCurrentUser.map(user => (
                <div key={user.userId} className="split-form-group">
                    <label htmlFor={user.userId}>{user.name}:</label>
                    <input
                        type="number"
                        id={user.userId}
                        name={user.userId}
                        value={amounts[usersWithCurrentUser.findIndex(u => u.userId === user.userId)] || ''}
                        onChange={(e) => handleChange(user.userId, e.target.value)}
                    />
                    <button type="button" id="split-form-removeButton" onClick={() => handleRemove(user.userId)}>Remove</button>
                </div>
            ))}
            <button type="submit" disabled={!isValid || !isValidTitleAndAmount}>Submit</button>
        </form>
    );
}