const axios = require('axios')
require('dotenv').config()

module.exports = {
    loginAsTeixe: () => {
        try {
            return axios.post(`${process.env.BASE_URL}/auth/local`, {
                identifier: process.env.USER,
                password: process.env.PASSWORD
            });
        } catch (error) {
            console.error(error);
        }
    },
}