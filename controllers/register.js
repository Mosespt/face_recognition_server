const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("Incorrect form submission");
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email,
        })
            .into("login")
            .returning("email")
            .then((loginEmail) => {
                return db("users")
                    .returning("*")
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date(),
                    })
                    .then((user) => {
                        res.json(user);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(() => res.status(400).json("Unable to register"));
};

export default { handleRegister };
