import express from 'express';
import createApolloGraphqlServer from './graphql/index'
import UserService from './services/user';
const { expressMiddleware } = require( '@apollo/server/express4');
// import { expressMiddleware} from '@apollo/server/express4'

async function start() {
    const app = express();
    const port = Number(process.env.PORT) || 3000;
    app.use(express.json());
    const gqlserver= await createApolloGraphqlServer();
    app.use(
        '/graphql',
        expressMiddleware(gqlserver,{
            // @ts-ignore
          context: async ({ req  }) => { 
            const token = req.headers['token'];
            try {
              const user = UserService.decodeJWTToken(token as string);
              return { user };
            }
            catch (error){
              return {};
            }
          }
        }
      )
      );

      app.get('/', (req, res) => {
        res.send('Hello Wold!');
      });
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
}

start();