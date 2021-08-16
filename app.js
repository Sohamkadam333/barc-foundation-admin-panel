const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { UserModel } = require('./models/User');
const {
  requireAuth,
  checkUser,
} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
// database connection
const dbURI =
  'mongodb+srv://eric:test@123@cluster0.vwtix.mongodb.net/barc-foundation?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/users', requireAuth, (req, res) => {
  UserModel.find().then((response) => {
    // console.log(response);
    const data = response;
    res.render('users', {
      usersData: data,
    });
  });
});

app.use(authRoutes);
