let express = require('express')
let graphqlHTTP = require('express-graphql')
let {buildSchema} = require('graphql')

let schema = buildSchema(`
  type Account {
    name: String
    age: Int
    sex: String
    department: String
    salary(city: String): Int  
  }
  type Query {
    account(username: String) : Account
  }
`)

let root = {
  account: ({username}) => {
    const name = username
    const sex = 'female'
    const age = 18
    const department = 'developer'
    const salary = ({city}) => {
      switch (city) {
        case '北京':
        case '上海':
        case '广州':
        case '深圳':
          return 10000
        default:
          return 5000
      }
    }
    return {
      name,
      sex,
      age,
      department,
      salary
    }
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