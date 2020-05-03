require('dotenv').config()
const authservice = require('./services/auth-service');
const userservice = require('./services/users-service');
const statusservice = require('./services/status-service');
const labelservice = require('./services/label-service');
const ticketservice = require('./services/ticket-service');
const axios = require('axios');
const _ = require('lodash');

let axiosInstance;
let createdUsers = [];
let createdStatus = [];
let createdTechs = [];
let createdLabels = [];
let createdTickets = [];

console.log(`----- WORKING WITH API: ${process.env.BASE_URL} -----`);
console.log(`[ Loggin in as ${process.env.USER} ]`);
authservice.loginAsTeixe().then(r => {
    if (r.status == 200) {
        console.log(`-> Successfully logged as ${process.env.USER}, token: ${r.data.jwt}`);
        axiosInstance = axios.create({
            headers: {
                post:  {
                    'Content-Type': 'application/json',
                } ,
                'Authorization': `Bearer ${r.data.jwt}`
            }
        });
    } else {
        console.log('[Login ERROR] Login status is not OK');
    }
}).then(() => {
    // CREATE USERS
    console.log(`[ Creating ${process.env.N_USERS} users ]`);
    const techs = _.split(process.env.TECH_USERS, ',');
    console.log(`[ Creating ${techs.length} techs ]`);
    // CREATE STATUS
    const statuses = _.split(process.env.STATUS, ',');
    console.log(`[ Creating ${statuses.length} status ]`);
    // CREATE LABELS
    const labels = _.split(process.env.LABELS, ',');
    console.log(`[ Creating ${labels.length} labels ]`);

    Promise.all([
        // ADD STATUS PROMISE GROUP
        Promise.all(_.flatMap(statuses, s => {
            return statusservice.createStatus(axiosInstance, s);
        })).then(values => {
            values.forEach(value => createdStatus.push(value.data.data.createStatus.status));
            console.log('-> Status created successfully:');
            createdStatus.forEach(s => console.log(`\t${JSON.stringify(s)}`));
        }).catch(e => {
            console.error(`An error ocurred adding status. Maybe there are already created?\n->${e}`);
        }),
        // ADD TECH PROMISE GROUP
        Promise.all(_.map(techs, t => {
            return userservice.createTech(axiosInstance, t);
        })).then(values => {
            values.forEach(value => createdTechs.push(value.data.data.createUser.user));
            console.log('-> Tech users created successfully:');
            createdTechs.forEach(u => console.log(`\t${JSON.stringify(u)}`));
        }).catch(e => {
            console.error(`An error ocurred adding tech users.\n->${e}`);
        }),
        // ADD RANDOM USERS PROMISE GROUP
        Promise.all(_.times(process.env.N_USERS, () => {
            return userservice.createRandomUser(axiosInstance);
        })).then(values => {
            values.forEach(value => createdUsers.push(value.data.data.createUser.user));
            console.log('-> Users created successfully:');
            createdUsers.forEach(u => console.log(`\t${JSON.stringify(u)}`));
        }).catch(e => {
            console.error(`An error ocurred adding random users.\n->${e}`);
        }),
        // ADD RANDOM LABELS PROMISE GROUP
        Promise.all(_.map(labels, l => {
            return labelservice.createLabel(axiosInstance, l);
        })).then((values) => {
            values.forEach(value => createdLabels.push(value.data.data.createLabel.label));
            console.log('-> Labels created successfully:');
            createdLabels.forEach(l => console.log(`\t${JSON.stringify(l)}`));
        }).catch(e => {
            console.error(`An error ocurred adding labels.\n->${e}`);
        })
    ]).then(() => {
        // STATUS, LABELS, TECHS AND RANDOM USERS CREATED, NOW CREATE TICKETS
        console.log(`[ Creating ${process.env.N_TICKETS} tickets ]`);
        Promise.all(_.times(process.env.N_TICKETS, () => {
            return ticketservice.getCreateTicketQuery(axiosInstance, createdUsers, createdTechs, createdStatus, createdLabels);
        })).then(values => {
            values.forEach(value => createdTickets.push(value.data.data.createTicket.ticket));
            console.log('-> Tickets created successfully:');
            createdTickets.forEach(t => console.log(`\t${JSON.stringify(t)}`));
        }).catch(e => {
            console.error(`An error ocurred adding random tickets.\n->${e}`);
        })
    });
}).catch(e => {
    console.error(`An error ocurred while loggin in.\n->${e}`)
});
