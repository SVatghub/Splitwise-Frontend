import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './EditExpense.css';
import axios from 'axios';

export default function EditExpense() {
    const { userId, expenseId } = useParams();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [debtUsers, setDebtUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserAmount, setCurrentUserAmount] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUserResponse = await axios.get(`http://localhost:8080/Splitwise-App/users/${userId}`);
                const currentUser = currentUserResponse.data;
                setCurrentUser(currentUser);

                const allUsersResponse = await axios.get('http://localhost:8080/Splitwise-App/users');
                const allUsers = allUsersResponse.data;
                setAllUsers(allUsers);

                const expenseResponse = await axios.get(`http://localhost:8080/Splitwise-App/users/${userId}/expenses/${expenseId}`);
                const expense = expenseResponse.data;
                setTitle(expense.title);
                setAmount(expense.amount);

                const debtUsersDetails = await Promise.all(
                    expense.debtUsersList.map(async (debtUser) => {
                        const userResponse = await axios.get(`http://localhost:8080/Splitwise-App/users/${debtUser.userId}`);
                        const user = userResponse.data;
                        return {
                            ...debtUser,
                            user
                        };
                    })
                );

                setDebtUsers(debtUsersDetails);
                setCurrentUserAmount(expense.amount - debtUsersDetails.reduce((sum, user) => sum + user.debtAmount, 0));
                setAvailableUsers(allUsers.filter(user => user.userId !== currentUser.userId && !debtUsersDetails.some(debtUser => debtUser.userId === user.userId)));
            } catch (error) {
                console.error("Error fetching data!", error);
            }
        };

        fetchData();
    }, [userId, expenseId]);

    const handleAddUser = () => {
        const user = allUsers.find(u => u.userId === parseInt(selectedUserId));
        if (user && !debtUsers.some(u => u.userId === user.userId)) {
            const newDebtUsers = [...debtUsers, { userId: user.userId, user, debtAmount: 0, isSettled: false }];
            setDebtUsers(splitAmounts(newDebtUsers, amount));
            setAvailableUsers(availableUsers.filter(u => u.userId !== user.userId));
            setSelectedUserId("");
        }
    };

    const handleRemoveUser = (userId) => {
        if (userId === currentUser.userId) {
            setCurrentUserAmount(0);
            setCurrentUser(null);
            setAvailableUsers([...availableUsers, currentUser]);
        } else {
            const user = debtUsers.find(u => u.userId === userId);
            if (user) {
                const newDebtUsers = debtUsers.filter(u => u.userId !== userId);
                setDebtUsers(splitAmounts(newDebtUsers, amount));
                setAvailableUsers([...availableUsers, user.user]);
            }
        }
    };

    const splitAmounts = (debtUsersList, totalAmount) => {
        const splitAmount = totalAmount / (debtUsersList.length + (currentUser ? 1 : 0));
        const newDebtUsers = debtUsersList.map(debtUser => ({
            ...debtUser,
            debtAmount: splitAmount
        }));
        setCurrentUserAmount(currentUser ? splitAmount : 0);
        return newDebtUsers;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (!title) {
            alert("Title cannot be empty!");
            return;
        }

        if (amount <= 0) {
            alert("Amount should be positive!");
            return;
        }

        const totalDebtAmount = debtUsers.reduce((sum, user) => sum + user.debtAmount, 0) + currentUserAmount;

        if (totalDebtAmount !== amount) {
            alert("Sum of all amounts must be equal to the total expense amount!");
            return;
        }

        const expenseData = {
            title,
            amount,
            debtUsersList: debtUsers.map(({ userId, debtAmount }) => ({
                userId,
                debtAmount,
                isSettled: false
            }))
        };

        try {
            await axios.put(`http://localhost:8080/Splitwise-App/users/${userId}/expenses/${expenseId}`, expenseData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate(`/dashboard/${userId}`);
        } catch (error) {
            console.log(expenseData)
            console.error("There was an error updating the expense!", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title: </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="amount">Amount: </label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => {
                        setAmount(parseFloat(e.target.value) || 0);
                        setDebtUsers(splitAmounts(debtUsers, parseFloat(e.target.value) || 0));
                    }}
                />

                <label htmlFor="addUser">Add User:</label>
                <div className="add-user-container">
                    <select name="addUser" id="addUser" onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
                        <option value="" disabled>Select a user</option>
                        {availableUsers.map(user => (
                            <option key={user.userId} value={user.userId}>{user.name}</option>
                        ))}
                    </select>
                    <button type="button" onClick={handleAddUser}>Add</button>
                </div>

                {debtUsers.map(debtUser => (
                    <div className="debt-user" key={debtUser.userId}>
                        <label>{debtUser.user.name}</label>
                        <input
                            type="number"
                            id={`amount-${debtUser.userId}`}
                            name="userAmount"
                            value={debtUser.debtAmount}
                            onChange={(e) => {
                                const newDebtUsers = debtUsers.map(user => user.userId === debtUser.userId
                                    ? { ...user, debtAmount: parseFloat(e.target.value) || 0 }
                                    : user
                                );
                                setDebtUsers(newDebtUsers);
                            }}
                        />
                        <button type="button" onClick={() => handleRemoveUser(debtUser.userId)}>Remove</button>
                    </div>
                ))}

                {currentUser && (
                    <div className="current-user-amount">
                        <label>{currentUser.name}'s amount</label>
                        <input
                            type="number"
                            value={currentUserAmount}
                            onChange={(e) => setCurrentUserAmount(parseFloat(e.target.value) || 0)}
                        />
                        <button type="button" onClick={() => handleRemoveUser(currentUser.userId)}>Remove</button>
                    </div>
                )}

                <button type="submit">Done</button>
            </form>
        </div>
    );
}