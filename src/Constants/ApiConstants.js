const API_BASE_URL = "http://splitwise-app-env.eba-wtgpanhq.ap-south-1.elasticbeanstalk.com/splitwise-app";

export const USERS_API = {
    GET_ALL :  `${API_BASE_URL}/users`,
    GET_BY_ID : (userId) => `${API_BASE_URL}/users/${userId}`,
    GET_BY_NAME_AND_EMAIL : (name,email) => `${API_BASE_URL}/users/${name}/${email}`,
    ADD_USER : `${API_BASE_URL}/users`
}

export const EXPENSES_API = {
    GET_ALL_USERID : (userId) => ` ${API_BASE_URL}/users/${userId}/expenses`,
    GET_BY_USERID_EXPENSEID : (userId,expenseId) => `${API_BASE_URL}/users/${userId}/expenses/${expenseId}`,
    DELETE_BY_USERID_EXPENSEID : (userId,expenseId) => `${API_BASE_URL}/users/${userId}/expenses/${expenseId}`,
    ADD_EXPENSE : (userId) => `${API_BASE_URL}/users/${userId}/expenses`,
    UPDATE_EXPENSE : (userId,expenseId) => `${API_BASE_URL}/users/${userId}/expenses/${expenseId}`
}

export const DEBTUSERS_API = {
    GET_DEBTS_BY_USERID : (userId) => `${API_BASE_URL}/users/debt/${userId}`,
    GET_DEBTUSERS_BY_EXPENSEID :(expenseId) => `${API_BASE_URL}/debt-users/${expenseId}`
}

export const SETTLEMENT_API = {
    GET_TRANSACTION_HISTORY_BETWEEN_TWO_USERS : (debtUserId,lenderId) => `${API_BASE_URL}/users/${debtUserId}/settle/${lenderId}`,
    GET_NET_DEBTS_TO_PAY_BY_USERID : (userId) => `${API_BASE_URL}/users/${userId}/debts-user-to-user`,
    SETTLE_NET_DEBTS_BY_DEBTUSERID_LENDERID : (debtUserId,lenderId) => `${API_BASE_URL}/users/${debtUserId}/settle/${lenderId}`
}

