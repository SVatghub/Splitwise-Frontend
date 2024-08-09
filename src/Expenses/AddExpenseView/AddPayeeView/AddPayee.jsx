import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddPayee.css';
import SplitExpense from "../SplitAmountView/SplitExpense.jsx";
import { USERS_API } from "../../../Constants/ApiConstants";

export default function AddPayee({ splitAmount, currentUser, title, isValidTitleAndAmount }) {
    const [users, setUsers] = useState([]);
    const [selectedPayeeId, setSelectedPayeeId] = useState("");
    const [addedUsers, setAddedUsers] = useState([]);

    useEffect(() => {
        axios.get(USERS_API.GET_ALL)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    const handleAdd = (evt) => {
        evt.preventDefault();
        const user = users.find(u => u.userId === parseInt(selectedPayeeId));
        if (user && !addedUsers.some(u => u.userId === user.userId)) {
            setAddedUsers(prevAddedUsers => [...prevAddedUsers, user]);
            setSelectedPayeeId("");
        }
    };
    const isValidPayees = addedUsers.length > 0;

    return (
        <div className="add-payee-container">
            <form onSubmit={handleAdd}>
                <label htmlFor="payees">Add Payee :</label>
                <select id="payees" value={selectedPayeeId} onChange={(evt) => setSelectedPayeeId(evt.target.value)}>
                    <option value="" disabled>Select a payee</option>
                    {users
                        .filter(user => user.userId !== currentUser.userId)
                        .map(user => (
                            <option key={user.userId} value={user.userId}>{user.name}</option>
                        ))}
                </select>
                <div className="button-container">
                    <button type="submit" disabled={!selectedPayeeId}>Add</button>
                </div>
            </form>
            <SplitExpense
                addedUsers={addedUsers}
                splitAmount={splitAmount}
                currentUser={currentUser}
                title={title}
                isValidTitleAndAmount={isValidTitleAndAmount && isValidPayees}
            />
        </div>
    );
}