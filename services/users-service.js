const consts = require('../queries/graphql-queries');
var casual = require('casual');

module.exports = {
    getAllUsers: (axiosInstance) => {
        try {
            return axiosInstance.post(consts.apiUrl, { 
                query: consts.queries.getUsers
            });
        } catch (error) {
            console.error(error);
        }
    },
    createTech: (axiosInstance, name) => {
        const username = name.toLowerCase();
        const mail = username + '@troubleticket.local';
        try {
            return axiosInstance.post(consts.apiUrl, {
                query: consts.mutations.getCreateTechQuery(username, mail)
            });
        } catch (error) {
            console.error(error);
        }  
    },
    createRandomUser: (axiosInstance) => {
        // Random name and email logic here
        const randomName = casual.username.toLowerCase();
        const randomMail = randomName + '@troubleticket.local';
        try {
            return axiosInstance.post(consts.apiUrl, {
                query: consts.mutations.getCreateUserQuery(randomName, randomMail)
            });
        } catch (error) {
            console.error(error);
        }  
    }
}