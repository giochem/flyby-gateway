const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(
  jwt({
    secret: process.env.JWT_SECRET || "secret",
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);
const gateway = new ApolloGateway({
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set("auth", context.auth ? JSON.stringify(context.auth) : null);
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  context: ({ req }) => {
    const auth = req.auth || null;
    return { auth };
  },
});
const startServer = async () => {
  await server.start();
  server.applyMiddleware({
    app,
  });
};
startServer();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server gateway ready at ` + `http://localhost:${port}${server.graphqlPath}`);
});
