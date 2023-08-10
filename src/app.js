const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const port = 3000;
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, 'public')));

require("../src/db/db");
const collection = require('../src/model/model');

const temp_path = path.join(__dirname, '../template/views');
app.set('view engine', 'hbs');
app.set('views', temp_path);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.post('/formdata', async(req, res) => {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const formdata = new collection({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
            });

            const postData = await formdata.save();
            res.send(postData);
        } catch (error) {
            console.error("Error saving data:", error);
            res.status(500).send("An error occurred while saving data.");
        }
    } else {
        res.send("Passwords do not match");
    }
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/loginPage', async(req, res) => {
    const email = req.body.email;
    const password = req.body.loginpassword;
    const keepLoggedIn = req.body.keepLoggedIn;

    try {
        const user = await collection.findOne({ email: email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                if (keepLoggedIn) {
                    res.cookie('user', user.name, { maxAge: 1 * 24 * 60 * 60 * 1000 });
                }

                res.render('welcome', { name: user.name });
            } else {
                res.send('Invalid credentials');
            }
        } else {
            res.send('User not found');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});
app.post('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});