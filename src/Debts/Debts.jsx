import React, { useEffect, useState } from 'react';
import Debt from './Debt';
import './Debts.css';
import axios from 'axios';
import { DEBTUSERS_API, SETTLEMENT_API } from '../Constants/ApiConstants';

export default function Debts({userId}) {
    const[userDebts,setUserDebts] = useState([])
    const[loading,setLoading] = useState(true)
    const[error,setError] = useState(null)

    useEffect(()=>{
        axios.get(SETTLEMENT_API.GET_NET_DEBTS_TO_PAY_BY_USERID(userId))
        .then((response)=>{
            setUserDebts(response.data);
            setLoading(false);
        })
        .catch((error)=>{
            setError(error);
        }) 
    },[userId])

    if(loading){
        return <div>Loading</div>
    }

    if(error){
        return <div>Error : {error}</div>
    }

    return (
        <div className="debts-container">
            <h1>You Need to Pay :</h1>
            {
                userDebts.map((debt, index) => (
                    <div className="debt-item" key={index}>
                        <Debt Debt={debt} debtUserId={userId}/>  
                    </div>
                ))
            }
        </div>
    );
}