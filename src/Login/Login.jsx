import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [showSignUp, setShowSignUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/splitwise-app/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
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
            await axios.post('http://localhost:8080/splitwise-app/users', { name, email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert("User registered successfully");
            setShowSignUp(false);
        } catch (error) {
            console.error("There was an error registering the user!", error);
        }
    };

    return (
        <div className="login-form-container">
            {showSignUp ? (
                <div className="sign-up-form-container">
                    <h2>Sign Up</h2>
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

export default Login;