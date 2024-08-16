import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { USERS_API } from '../Constants/ApiConstants.js';
import "./Login.css";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);    
    const [showSignUp, setShowSignUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(USERS_API.GET_ALL)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(response => {
                setUsers(response.data);
                setLoading(false);  
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
                setError(error.message);
                setLoading(false);  
            });
    }, []);

    const handleLoginSubmit = (evt) => {
        evt.preventDefault();
        const user = users.find(user => user.name === name && user.email === email);
        if (user) {
            navigate(`/dashboard/${user.userId}`);
        } else {
            alert("Invalid credentials");
        }
    };

    const handleSignUpSubmit = async (name, email) => {
        try {
            const response = await fetch(USERS_API.ADD_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                alert("User registered successfully");
                setShowSignUp(false);
            } else {
                alert("Failed to register user");
            }
        } catch (error) {
            console.error("There was an error registering the user!", error);
        }
    };
    
    return (
        <div className="login-form-container">
            {loading ? (
                <div>Loading users...</div>
            ) : error ? (
                <div>Error loading users: {error}</div>
            ) : showSignUp ? (
                <div className="sign-up-form-container">
                    <h2 style={{ textAlign: "center" }}>Sign Up</h2>
                    <form onSubmit={(evt) => {
                        evt.preventDefault();
                        handleSignUpSubmit(name, email);
                    }}>
                        <label htmlFor="sign-up-name">Name:</label>
                        <input
                            type="text"
                            id="sign-up-name"
                            name="name"
                            value={name}
                            onChange={(evt) => setName(evt.target.value)}
                        />
                        <label htmlFor="sign-up-email">Email:</label>
                        <input
                            type="email"
                            id="sign-up-email"
                            name="email"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                        />
                        <button type="submit">Sign Up</button>
                        <button type="button" onClick={() => setShowSignUp(false)}>Back to Login</button>
                    </form>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleLoginSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(evt) => setName(evt.target.value)}
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                        />
                        <button type="submit">Login</button>
                        <button type="button" onClick={() => setShowSignUp(true)}>Sign Up</button>
                    </form>
                </div>
            )}
        </div>
    );
}