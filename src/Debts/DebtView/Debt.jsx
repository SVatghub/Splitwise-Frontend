import React, { useState } from 'react';
import './Debt.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SETTLEMENT_API } from '../../Constants/ApiConstants';
import Lottie from 'lottie-react';
import successAnimation from '../../assets/settleAnimation.json';  

export default function Debt({ Debt, debtUserId, onDebtSettled }) {
    const navigate = useNavigate();
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

    const handleSettle = async () => {
        try {
            let lenderId = Debt.userId;
            await axios.put(SETTLEMENT_API.SETTLE_NET_DEBTS_BY_DEBTUSERID_LENDERID(debtUserId, lenderId));
            setIsAnimationPlaying(true);
            setTimeout(() => {
                setIsAnimationPlaying(false);
                onDebtSettled(Debt.userId); 
            }, 2000); 
        } catch (error) {
            console.error('Error settling debt', error);
        }
    };

    const handleTransaction = () => {
        navigate(`/transactions/${debtUserId}/${Debt.userId}`);
    };

    return (
        <div className="debt-container">
            {isAnimationPlaying ? (
                <Lottie 
                    animationData={successAnimation} 
                    loop={false} 
                    className="lottie-animation"
                />
            ) : (
                <>
                    <div className="debt-details">
                        <p className="debt-name">{Debt.name}</p>
                        <p className="debt-amount">&#8377;{Debt.amount.toFixed(2)}</p>
                    </div>
                    <div className="debt-buttons">
                        <button className="settle-button" onClick={handleSettle}>Settle</button>
                        <button className="transaction-button" onClick={handleTransaction}>
                            Transactions
                            <FontAwesomeIcon icon={faCaretRight} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}