import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';


const startServer = async() => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(3000,() => console.log("App is listening on....."))
};

startServer();