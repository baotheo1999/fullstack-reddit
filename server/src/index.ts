require("dotenv").config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { Upvote } from "./entities/Unvote";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { Context } from "./types/Context";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "redditv3",
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post, Upvote],
  });

  // await sendEmail("nguyenquanganhbao148@gmail.com", "<b>Hello bao</b>");

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.sxiul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  ///session/cookie store
  await mongoose.connect(mongoUrl, {});
  console.log("mongodb connected");

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, // one hour
        httpOnly: true, // js front end connot access the cookie
        secure: __prod__, // cookie only works in https
        sameSite: "lax",
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // don't save empty sessions, right from the start
      resave: false,
    })
  );

  //dùng để gọi resolvers ra
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }): Context => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.POST || 4000;

  app.listen(PORT, () =>
    console.log(
      `server started on port ${PORT}. GraphQL server started on localhost ${PORT}${apolloServer.graphqlPath}`
    )
  );
};
main().catch((error) => console.log(error));
