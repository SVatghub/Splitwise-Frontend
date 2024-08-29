import React, { useEffect, useState } from 'react';
import Debt from '../DebtView/Debt';
import './Debts.css';
import axios from 'axios';
import {SETTLEMENT_API } from '../../Constants/ApiConstants';

export default function Debts({userId}) {
    const[userDebts,setUserDebts] = useState([])
    const[loading,setLoading] = useState(true)
    const[error,setError] = useState(null)

  useEffect(() => {
    axios
      .get(SETTLEMENT_API.GET_NET_DEBTS_TO_PAY_BY_USERID(userId))
      .then((response) => {
        setUserDebts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  const handleDebtSettled = (settledUserId) => {
    setUserDebts((prevDebts) =>
      prevDebts.filter((debt) => debt.userId !== settledUserId)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="debts-container">
      <h1>You Need to Pay:</h1>
      {userDebts.map((debt, index) => (
        <div className="debt-item" key={index}>
          <Debt
            Debt={debt}
            debtUserId={userId}
            onDebtSettled={handleDebtSettled}
          />
        </div>
      ))}
    </div>
  );
}
