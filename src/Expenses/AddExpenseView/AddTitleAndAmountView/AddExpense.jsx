import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from 'axios'; 
import AddPayee from "../AddPayeeView/AddPayee";
import "./AddExpense.css";
import { USERS_API } from "../../../Constants/ApiConstants";

export default function AddExpense() {
    const { userId } = useParams();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState();
    const [isValid, setIsValid] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(USERS_API.GET_BY_ID(userId))
                .then(response => {
                    setCurrentUser(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the user!", error);
                });
        }
    }, [userId]);

    useEffect(() => {
        if (title && amount > 0) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [title, amount]);

    const handleAmountChange = (evt) => {
        const value = parseFloat(evt.target.value) || 0;
        if (value > 0) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    };

    return (
        <div>
            <div className="add-expense-container">
                <h1>Add an Expense</h1>
                <form className="add-expense-form">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(evt) => setTitle(evt.target.value)}
                    />
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount || ''}
                        onChange={handleAmountChange}
                        min="0" 
                    />
                </form>
            </div>
            {currentUser && (
                <AddPayee
                    splitAmount={amount}
                    currentUser={currentUser}
                    title={title}
                    isValidTitleAndAmount={isValid}
                />
            )}
        </div>
    );
}