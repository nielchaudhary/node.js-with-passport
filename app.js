const express = require('express');
const {hashSync} = require('bcrypt')
const UserModel = require('./config/database'); // Ensure that this import is correctly configured
const session = require('express-session')
const MongoStore = require('connect-mongo')
const app = express();
const passport = require('passport')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'nielniel',
  resave: false,
  store : MongoStore.create({mongoUrl : 'mongodb://localhost:27017/passportJS', collectionName : "sessions"}),
  saveUninitialized: true,
  cookie: { maxAge : 1000 * 60 * 60 * 24}
}))

require('./config/passport')

app.use(passport.initialize());
app.use(passport.session())

app.post('/register', (req, res) => {
    let user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password , 10)
    });

    user.save()
        .then(() => {
            console.log("User Registered Successfully", user);
            res.send({ message: "Registered Successfully" });
        })
        .catch(error => {
            console.error("Error registering user:", error);
            res.status(500).send({ message: "Error registering user" });
        });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err); // Log the error
        return next(err); // Pass the error to the next middleware
      }
      if (!user) {
        console.error(info.message); // Log the error message
        return res.redirect('/login'); // Redirect to the login page with an error message
      }
      req.login(user, (err) => {
        if (err) {
          console.error(err); // Log the error
          return next(err); // Pass the error to the next middleware
        }
        res.redirect('/protected'); // Redirect to the protected page upon successful login
      });
    })(req, res, next);
  });
  


app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error during logout:', err);
            return next(err); // Pass the error to the next middleware
        }
        res.redirect('/login');
    });
});


app.get('/protected', (req, res) => {
    if(req.isAuthenticated()){
        res.render('protected')

    }else{
        res.status(401).send({message: "Unauthorized"})
    }
   
});

app.listen(3000, () => {
    console.log("THIS SERVER IS RUNNING ON PORT 3000");
});
