import express from 'express';
import { ApolloServer } from '@apollo/server';
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
      `,
      resolvers:{
            Query:{
                hello:()=>'Hello World'
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