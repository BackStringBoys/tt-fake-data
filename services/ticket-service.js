const consts = require('../queries/graphql-queries');
var casual = require('casual');
const _ = require('lodash');

module.exports = {
    getCreateTicketQuery: (axiosInstance, createdUsers, createdTechs, createdStatus, createdLabels) => {
        const title = casual.title
        const description = casual.description
        const creator = createdUsers[_.random(createdUsers.lenght)].id
        const labels = JSON.stringify(_.shuffle(createdLabels).slice(end = _.random(1, 3)).map(v => v.id));
        const priority = _.random(0, 9);
        const timeline = JSON.stringify(generateRandomTimeline(creator, createdTechs, createdStatus)).replace(/"([^"]+)":/g, '$1:');
        try {
            return axiosInstance.post(consts.apiUrl, { 
                query: consts.mutations.getCreateTicketQuery(title, description, creator, labels, priority, timeline)
            });
        } catch (error) {
            console.error(error);
        }
    }
}

generateRandomTimeline = (creator, createdTechs, createdStatus) => {
    const typenames = [
        "ComponentTimelineAssigneeChange",
        "ComponentTimelineStatusChange",
        "ComponentTimelineComment"
    ]
    const components = [
        "timeline.assignee-change",
        "timeline.status-change",
        "timeline.comment"
    ]
    let result = []
    const assigned = createdTechs[_.random(createdTechs.lenght - 1)].id;

    if (_.random(10) < 8) {   // 80% to be assigned to one random tech
        result.push({
            __typename: typenames[0],
            __component: components[0],
            date: new Date(),
            newAsignee: assigned,
            changedBy: assigned
        })
        result.push({
            __typename: typenames[1],
            __component: components[1],
            date: new Date(),
            newStatus: createdStatus[0].id,
            changedBy: assigned
        })

        if (_.random(10)<8) {  // 80% | 80% to be commented by the tech  
            result.push({
                __typename: typenames[2],
                __component: components[2],
                date: new Date(),
                comment: casual.sentences(n = _.random(2, 4)),
                changedBy: assigned
            })

            if (_.random(10)<8) {  // 80% | 80% to be commented back by the creator
                result.push({
                    __typename: typenames[2],
                    __component: components[2],
                    date: new Date(),
                    comment: casual.sentences(n = _.random(2, 4)),
                    changedBy: creator
                })

                if (_.random(10)<8) {  // 80% | 80% to be changed status by the creator
                    result.push({
                        __typename: typenames[1],
                        __component: components[1],
                        date: new Date(),
                        newStatus: createdStatus[_.random(1, createdStatus.lenght - 2)].id,
                        changedBy: assigned
                    })

                    if (_.random(10)<8) {  // 80% | 80% to be commented by the tech and closed
                        result.push({
                            __typename: typenames[2],
                            __component: components[2],
                            date: new Date(),
                            comment: casual.sentences(n = _.random(2, 4)),
                            changedBy: assigned
                        })
                        result.push({
                            __typename: typenames[1],
                            __component: components[1],
                            date: new Date(),
                            newStatus: _.last(createdStatus).id,
                            changedBy: assigned
                        })
                    }
                }
            }
        }
    }
    

    return result
}