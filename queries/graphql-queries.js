require('dotenv').config()

module.exports = {
    apiUrl: `${process.env.BASE_URL}/graphql`,
    queries: {
        getUsers: `
            {
                users {
                    id
                    username
                }
            }
        `,
    },
    mutations: {
        getCreateUserQuery: (username, mail) => {
            return `mutation {
                        createUser(
                            input: {
                                data: {
                                    username: "${username}"
                                    email: "${mail}"
                                    password: "${process.env.DEFAULT_USERS_PASSWORD}"
                                    confirmed: true
                                }
                            }
                        ) {
                            user {
                                id
                                username
                            }
                        }
                    }`
        },
        getCreateTechQuery: (username, mail) => {
            return `mutation {
                        createUser(
                            input: {
                                data: {
                                    username: "${username}"
                                    email: "${mail}"
                                    password: "${process.env.DEFAULT_USERS_PASSWORD}"
                                    confirmed: true
                                    role: ${process.env.TECH_ROLE_ID}
                                }
                            }
                        ) {
                            user {
                                id
                                username
                            }
                        }
                    }`
        },
        getCreateStatusQuery: (name, color) => {
            return `mutation {
                createStatus(
                  input: {
                    data: {
                      name: "${name}",
                      color: "${color}"
                    }
                  }
                ) {
                  status {
                    id
                    name
                    color
                  }
                }
              }`
        },
        getCreateLabelQuery: (name) => {
            return `mutation {
                createLabel(
                input: {
                  data: {
                    name: "${name}"
                  }
                }
              ) {
                label {
                  id
                  name
                }
              }
            }`
        },
        getCreateTicketQuery: (title, description, creator, labels, priority, timeline) => {
          return `mutation {
            createTicket(
              input: {
                data: {
                  title: "${title}"
                  description: "${description}"
                  creator: ${creator}
                  labels: ${labels}
                  priority: ${priority}
                  timeline: ${timeline}
                }
              }
            ) {
              ticket {
                id
              title
              description
              labels {
                id
                name
              }
              creator {
                id
                username
              }
              priority
              timeline {
                __typename
                ... on ComponentTimelineAssigneeChange {
                  id
                  date
                  newAsignee {
                    id
                    username
                  }
                }
                ... on ComponentTimelineComment {
                  id
                  date
                  comment
                }
                ... on ComponentTimelineStatusChange {
                  id
                  date
                  newStatus {
                    id
                    name
                    color
                  }
                }
              }
              }
            }
          }`
        }
    }
}