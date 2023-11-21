import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

import { handleRegister } from "./controllers/register.js";
import { handleSignIn } from "./controllers/signin.js";
import { handleProfile } from "./controllers/profile.js";
import { handleImage } from "./controllers/image.js";
import imageUrl from "./controllers/imageurl.js";

const db = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
    },
});

// Database test
/* db.select("*")
    .from("users")
    .then((data) => {
        console.log(data);
    }); */

const app = express();
app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

/* const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "melons",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "125",
            name: "Pete",
            email: "pete@gmail.com",
            password: "carrots",
            entries: 0,
            joined: new Date(),
        },
    ],
}; */

// Request and response from the root ('/')
app.get("/", (req, res) => {
    res.json("Created by 98Moses");
});

app.post("/signin", handleSignIn(db, bcrypt));

app.post("/register", handleRegister(db, bcrypt, saltRounds));

app.get("/profile/:id", (req, res) => handleProfile(req, res, db));

app.put("/image", handleImage(db));

app.post("/imageurl", (req, res) => {
    imageUrl.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});

/**
 *
 * Implementations for the server (expected end-points)
 *
 * / --> res = this is working
 * /signin --> POST = success/fail
 * /register --> POST = new user
 * /profile/:userId --> GET = user
 * /image --> PUT
 *
 */
