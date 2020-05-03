const consts = require('../queries/graphql-queries');

module.exports = {
    createLabel: (axiosInstance, name) => {
        try {
            return axiosInstance.post(consts.apiUrl, {
                query: consts.mutations.getCreateLabelQuery(name)
            });
        } catch (error) {
            console.error(error);
        }  
    },
}