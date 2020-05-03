const consts = require('../queries/graphql-queries');
var casual = require('casual');

module.exports = {
    createStatus: (axiosInstance, statusName) => {
        // Random color logic here
        const randomColor = casual.rgb_hex;
        try {
            return axiosInstance.post(consts.apiUrl, {
                query: consts.mutations.getCreateStatusQuery(statusName, randomColor)
            });
        } catch (error) {
            console.error(error);
        }
    }
}