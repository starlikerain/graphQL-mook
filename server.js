let express = require('express')
let graphqlHTTP = require('express-graphql')
let {buildSchema} = require('graphql')

/**
 * 查询语句
 *
mutation {
  createAccount(input: {
    name: "哈撒给"
  	age: 18
    sex: "female"
  	department: "研发部门"
  }) {
    name
    age
    sex
    department
  }
}

 query {
  accounts {
    name
    age
    sex
    department
  }
}
 * @type {GraphQLSchema}
 */
let schema = buildSchema(`
        input AccountInput {
            name: String
            age: Int
            sex: String
            department: String
        }
        type Account {
            name: String
            age: Int
            sex: String
            department: String
        }
        type Mutation {
            createAccount(input: AccountInput): Account
            updateAccount(id: ID!, input: AccountInput): Account
        }
        type Query {
          accounts: [Account]
        } 
`)

const fakeDB = {}

let root = {
  createAccount: ({ input }) => {
    fakeDB[input.name] = input
    return fakeDB[input.name]
  },
  updateAccount: ({id, input}) => {
    fakeDB[id] = Object.assign({}, fakeDB[input.name], input) // updatedAccount
    return fakeDB[id]
  },
  accounts: () => {
    let arr = []
    for(const key in fakeDB){
      arr.push(fakeDB[key])
    }
    return arr
  }
}

let app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

app.use(express.static('public'))

app.listen(3000, () => console.log('Now browse to localhost:4000/graphql'))