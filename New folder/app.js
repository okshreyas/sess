

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample state changes
let stateChanges = [];

// Middleware to authenticate user
const authenticateUser = (username, password) => {
  return users.find((user) => user.username === username && user.password === password);
};

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('You must be logged in to access this resource');
  }
  next();
};


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simulate authentication
  const authenticatedUser = authenticateUser(username, password);

  if (authenticatedUser) {
    // Set the user ID and login time in the session
    req.session.userId = authenticatedUser.id;
    req.session.loginTime = new Date();
    console.log("req.session:", req.session);
    console.log("authenticatedUser:", authenticatedUser);
    res.redirect('/dashboard');
  } else {
    console.log("authenticatedUser:", authenticatedUser);
    res.status(401).send('Invalid username or password');
  }
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { userId: req.session.userId });
});

app.post('/updateState', requireLogin, (req, res) => {
  const newState = req.body.state; // 'yes' or 'no'
  const changedBy = req.session.userId;
  const changeTime = new Date();
  
  // Update the state in your application logic
  // For this example, we are pushing the state change to an array
  stateChanges.push({ state: newState, changedBy, changeTime });

  res.redirect('/nextpagetologin');
});

app.get('/logout', (req, res) => {
  // Destroy the session on logout
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.send('Logout successful');
  });
});
