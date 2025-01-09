import express from 'express';
import { ApolloServer } from '@apollo/server';
import { prismaClient } from './lib/db';
const { expressMiddleware } = require( '@apollo/server/express4');
// import { expressMiddleware} from '@apollo/server/express4'

async function start() {
    const app = express();
    const port = Number(process.env.PORT) || 3000;
    app.use(express.json());

    const gqlserver = new ApolloServer({
      typeDefs:`
         type Query {
              hello: String
         }
         type Mutation {
              createUser(firstName: String!, lastName:String!, email: String! , password: String! ): Boolean
          }
      `,
      resolvers:{
            Query:{
                hello:()=>'Hello World'
            },
            Mutation:{
                createUser: async (_,{firstName, lastName, email, password}:{firstName:string ; lastName:string ; email:string ; password:string })=>{
                    await prismaClient.user.create({
                        data:{
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: 'random_salt',
                        }
                    })
                    return true;
                } 
            }
      },
    });

    await gqlserver.start();

    app.use(
        '/graphql',
        expressMiddleware(gqlserver)
      );

      app.get('/', (req, res) => {
        res.send('Hello Wold!');
      });
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
}

start();