const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Incorrect form submission");
    }
    db.select("email", "hash")
        .from("login")
        .where("email", "=", email)
        .then((user) => {
            const isValid = bcrypt.compareSync(password, user[0].hash);
            if (isValid) {
                db.select("*")
                    .from("users")
                    .where("email", "=", email)
                    .then((user) => {
                        res.json(user[0]);
                    })
                    .catch(() => res.status(400).json("Unable to get user"));
            } else {
                res.status(400).json("Incorrect Email or Password");
            }
        })
        .catch(() => res.status(400).json("Wrong credentials"));
    /* if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.json("Error logging in");
    } */
    // res.json('Signed In');
};

export { handleSignIn };
