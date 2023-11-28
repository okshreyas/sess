const express = require("express");

const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const port = 3000;
const crypto = require('crypto');
const path = require('path'); // Import the 'path' module
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const e = require("express");
const session = require("express-session"); // Import the express-session middleware.
module.exports.getBorderClass = getBorderClass;

app.use(express.json());
app.use(bodyParser.json());
app.use(session({ secret: "your-secret-key", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.static(__dirname + "/public")); // Assuming you have static files in the 'public' directory

// MySQL database configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "emp",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

function getUserById(id, callback) {
  // Implement a database query to fetch the user by ID
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 1) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
}






passport.use(
  new LocalStrategy((username, password, done) => {
    // Authenticate user here (query the database, check credentials)
    // If authenticated, store user details in session
    // Replace this example with your own authentication logic
    const user = getUserByUsername(username);
    console.log("User: " + user); // Debug line
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (decryptedPassword !== password) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});
passport.deserializeUser((id, done) => {
  getUserById(id, (err, user) => {
    if (err) {
      return done(err, null);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
});


function getBorderClass(interaction, leadinteraction) {
  if (interaction === "yes" && leadinteraction === "yes") {
    return "interaction-yes";
  } else if (interaction === "yes" && leadinteraction === "no") {
    return "interaction-yes-lead-no";
  } else if (interaction === "no" || leadinteraction === "no") {
    return "interaction-no";
  } else {
    return "interaction-none";
  }
}



app.get("/round", (req, res) => {

  //const query = "SELECT users.*, feedback.feedback_text FROM users LEFT JOIN (SELECT empid, MAX(feedback_time) AS latest_feedback_time FROM feedback GROUP BY empid ) latest_feedback_time ON users.empid = latest_feedback_time.empid LEFT JOIN feedback ON latest_feedback_time.empid = feedback.empid AND latest_feedback_time.latest_feedback_time = feedback.feedback_time;"; 
  //const query = "SELECT feedback.*, users.interaction FROM feedback LEFT JOIN users ON feedback.empid = users.empid WHERE feedback.empid = users.empid AND feedback.feedback_time = users.interaction_time";
  const query = "select * from spcl where rnk = 2";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Database query error: " + err.message);
      res.status(500).send("Error fetching data");
    } else {
      res.render("round", { employees: result });
    }
  });
});


app.post('/LeadDashBoard', (req, res) => {
  const { username, password } = req.body;
  const empid = req.query.empid;
  const interaction = req.query.interaction;
  
  console.log("interaction_time:", interaction_time);
  console.log("interaction_date:", interaction_date);
  console.log("interaction_month:", interaction_month);
  console.log("interaction_year:", interaction_year);
  
  console.log("data being sent to LeadDashBoard: " + interaction + interaction_time + interaction_date + interaction_month + interaction_year + empid); 
const sql = `UPDATE users SET leadinteraction = ?, leadinteraction_time = ?, leadinteraction_date = ?, leadinteraction_month = ?, leadinteraction_year = ? WHERE empid = ?`;
db.query(sql, [interaction, interaction_time, interaction_date, interaction_month, interaction_year, empid], (err, result) => {
if (err) {
      console.error("Error updating interaction:", err);
      res
        .status(500)
        .json({ success: false, message: "Error updating interaction." });
      console.log("Error updating interaction:", err);

    } else {
      res.json({ success: true, message: "Interaction updated successfully!" });
      console.log("Interaction updated successfully");
    }
  });

  // Authenticate the user here (e.g., check credentials against a database)
  if (username === 'validUser' && password === 'password') {
    // If authentication is successful, create a session or issue a token
    req.session.isAuthenticated = true;
    // Redirect to the next page
    res.redirect('/roundlead');
  } else {
    res.send('Authentication failed');
  }
});


app.post("/roundlead", (req, res) => {
  const empid = req.query.empid;
  const interaction = req.query.interaction;

  const sql = `UPDATE users SET leadinteraction = ? WHERE empid = ?`;

  db.query(sql, [interaction, empid], (err, result) => {
    if (err) {
      console.error("Error updating interaction:", err);
      res
        .status(500)
        .json({ success: false, message: "Error updating interaction." });
    } else {
      res.json({ success: true, message: "Interaction updated successfully!" });
    }
  });
});

app.post("/login", (req, res) => {
  const { empid, password } = req.body;

  console.log("Received login request with empid:", empid);

  function authenticateSpecialUser(user) {
    const decryptedPassword = decrypt(user.password, 'your-secret-key');
    console.log("Authenticating special user:", user);
    if (password === decryptedPassword) {
      req.login(user, (err) => {
        if (err) {
          console.error("Error establishing a session:", err);
          res.status(500).send("Internal Server Error");
        } else {
          if (user.rnk === 1) {





            //       console.log("Redirecting to /mngrdash");

            //         loggedUserEmail = req.user.email; // Assuming you have a user object with lead information in the session
            //         const query = "SELECT * FROM users WHERE manageremail = ?";
            //         const userResults = "SELECT * FROM users WHERE empid = ?";
            // const queryInteractionData = `
            //   SELECT interaction_month AS month, COUNT(*) AS interaction_count
            //   FROM users
            //   WHERE interaction_month IN (
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%M'),
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '%M'),
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%M'),
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%M'),
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%M'),
            //     DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 0 MONTH), '%M')
            //   )
            //   GROUP BY month;
            // `;    
            //   console.log("Logged user email: " + loggedUserEmail); // Debug line
            // db.query(query, [loggedUserEmail], (err, results) => {


            //   if (err) {
            //     console.error("Database query error (user data): " + err.message);
            //     res.status(500).send("Error fetching user details.");
            //   } else if (userResults.length === 0) {
            //     res.status(404).send("User not found.");
            //   } else {
            //     const user = userResults[0];
            //     // Now, fetch the interaction data
            //     db.query(queryInteractionData, (err, interactionResults) => {
            //       if (err) {
            //         console.error("Database query error (interaction data): " + err);
            //         res.status(500).send("Error fetching interaction data.");
            //       } else {

            //         const interactionData = interactionResults;
            //         // Render the 'mngrdash.ejs' template with user and interaction data
            //         res.render("mngrdash", { user: user, rawData: interactionData });
            //       }
            //     });


            //   }
            // });

            console.log("Redirecting to /mngrdash");
            loggedUserEmail = req.user.email; // Assuming you have a user object with lead information in the session
            const query = "SELECT * FROM users WHERE manageremail = ? ORDER BY ISNULL(interaction_date) DESC, interaction_date DESC;            ";
            console.log("Logged user email: " + loggedUserEmail); // Debug line


            // const employeeQuery = "SELECT COUNT(*) as record_count FROM spcl WHERE manageremail = ? and spclinter = 'yes'; ";
            const employeeQuery = "SELECT COUNT(*) as record_count FROM spcl WHERE spclinter = 'yes'; ";

            // Execute the query to get employees with id=7
            db.query(employeeQuery, loggedUserEmail, (employeeErr, employeeResults) => {
              if (employeeErr) {
                console.error("Database query error: " + employeeErr.message);
                res.status(500).send("Error fetching user.");
              } else {
                // Debug line to inspect the results

                // Your existing query to fetch user data
                const query = "SELECT * FROM spcl WHERE rnk = 2 ORDER BY ISNULL(spclinter) DESC, spclinter DESC;";
                db.query(query, [loggedUserEmail], (err, results) => {
                  if (err) {
                    console.error("Database query error: " + err.message);
                    res.status(500).send("Error fetching user.");
                  } else {
                    // Debug line to inspect the results

                    const isAuthenticated = req.isAuthenticated(); // Adjust this line based on your authentication method
                    console.log("isAuthenticated:", isAuthenticated);
                    // Render a template (e.g., 'LeadDashBoard.ejs') with the user's data and employee data
                    res.render("mngrdash", { data: results, employeeData: employeeResults, isAuthenticated: isAuthenticated });
                  }
                });


              }
            });





            //-----------------------------------------
          } else if (user.rnk === 2) {
            console.log("Redirecting to /LeadDashBoard");
            loggedUserEmail = req.user.email; // Assuming you have a user object with lead information in the session
            const query = "SELECT * FROM users WHERE leademail = ? ORDER BY ISNULL(interaction_date) DESC, interaction_date DESC;            ";
            console.log("Logged user email: " + loggedUserEmail); // Debug line


            const employeeQuery = "SELECT COUNT(*) as record_count FROM users WHERE leademail = ? and interaction = 'yes'; ";

            // Execute the query to get employees with id=7
            db.query(employeeQuery, loggedUserEmail, (employeeErr, employeeResults) => {
              if (employeeErr) {
                console.error("Database query error: " + employeeErr.message);
                res.status(500).send("Error fetching user.");
              } else {
                // Debug line to inspect the results

                // Your existing query to fetch user data
                const query = "SELECT * FROM users WHERE leademail = ? ORDER BY ISNULL(interaction_date) DESC, interaction_date DESC;            ";
                db.query(query, [loggedUserEmail], (err, results) => {
                  if (err) {
                    console.error("Database query error: " + err.message);
                    res.status(500).send("Error fetching user.");
                  } else {
                    // Debug line to inspect the results

                    const isAuthenticated = req.isAuthenticated(); // Adjust this line based on your authentication method
                    console.log("isAuthenticated:", isAuthenticated);
                    // Render a template (e.g., 'LeadDashBoard.ejs') with the user's data and employee data
                    res.render("LeadDashBoard", { data: results, employeeData: employeeResults, isAuthenticated: isAuthenticated });
                  }
                });


              }
            });


            //-----------------------------------------
          } else if (user.rnk === 3) {
            console.log("Redirecting to /admin");
            //  res.render("amdin");            loggedUserEmail = req.user.email; // Assuming you have a user object with lead information in the session
            const query =
              "SELECT * FROM users";

            db.query(query, (err, results) => {
              if (err) {
                console.error("Database query error: " + err.message);
                res.status(500).send("Error fetching user details.");
              } else if (results.length === 0) {
                res.status(404).send("User not found.");
              } else {
                res.render("amdin", { user });

              }
            });






          } else {
            const alertMessage = "Incorrect password. Please try again.";
            console.log("Incorrect password for special user");
            res.render("login", { error: alertMessage });
          }
        }
      });
    } else {
      const alertMessage = "Incorrect password. Please try again.";
      console.log("Incorrect password for special user");
      res.render("login", { error: alertMessage });
    }
  }

  function authenticateStandardUser(user) {
    console.log("Authenticating standard user:", user);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    if (user.interaction === "yes" && user.interaction_month === currentMonth) {
      // User is interacting in the current month
      if (password === decryptedPassword) {
        // Correct password provided, create a session and redirect to '/info'
        req.login(user, (err) => {
          if (err) {
            console.error("Error establishing a session:", err);
            res.status(500).send("Internal Server Error");
          } else {
            alert("You have already submitted your feedback for this month. Please try again next month.");
            console.log("Redirecting to /endpage");
            res.redirect("/endpage");
          }
        });
      } else {
        // Incorrect password provided
        const alertMessage = "Incorrect password. Please try again.";
        console.log("Incorrect password for standard user");
        res.render("login", { error: alertMessage });
      }
    } else {
      const decryptedPassword = decrypt(user.password, 'your-secret-key'); // Replace with your actual secret key
      // User is not interacting in the current month
      if (password === decryptedPassword) {
        // Correct password provided, create a session and redirect to '/endpage'
        req.login(user, (err) => {
          if (err) {
            console.error("Error establishing a session:", err);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("Redirecting to /info");
            res.redirect("/info");
          }
        });
      } else {
        // Incorrect password provided
        const alertMessage = "Incorrect password. Please try again.";
        console.log("Incorrect password for standard user");
        res.render("login", { error: alertMessage });
      }
    }
  }

  // Query the 'spcl' table to find a user with the provided empid
  const spclQuery = "SELECT * FROM spcl WHERE empid = ?";
  db.query(spclQuery, [empid], (err, spclResults) => {
    if (err) {
      console.error("Error querying spcl table:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (spclResults.length > 0) {
      // User found in 'spcl' table
      const user = spclResults[0];
      console.log("Special user found:", user);
      authenticateSpecialUser(user);
    } else {
      // User not found in 'spcl', query the 'users' table
      const usersQuery = "SELECT * FROM users WHERE empid = ?";
      db.query(usersQuery, [empid], (err, usersResults) => {
        if (err) {
          console.error("Error querying users table:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        if (usersResults.length > 0) {
          // User found in 'users' table
          const user = usersResults[0];
          console.log("Standard user found:", user);
          authenticateStandardUser(user);
        } else {
          // User not found in either table
          const alertMessage = "User not found. Please try again.";
          console.log("User not found");
          res.render("login", { error: alertMessage });
        }
      });
    }
  });
});



// Define a route to serve the HTML page with the employee list (assuming "round.html" is in the same directory as app.js)
app.get("/employee-list", (req, res) => {
  res.sendFile(__dirname + "/round.html"); // Replace with the path to your HTML file
});

// Helper function to generate an HTML table from the query result
function generateHTMLTable(data) {
  let tableRows = "";
  data.forEach((row) => {
    tableRows += `
      <tr>
        <td>${row.empid}</td>
        <td>${row.firstname}</td>
        <td>${row.lastname}</td>
        <!-- Add more table data cells as needed -->
      </tr>
    `;
  });
  return tableRows;
}


function encrypt(text, secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedPassword, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
  decryptedPassword += decipher.final('utf8');
  return decryptedPassword;
}





app.get("/person/:empid", (req, res) => {
  if (req.isAuthenticated()) {
    // The user is authenticated, you can access their user data via req.user
    const empid = req.params.empid;
    const query = "SELECT * FROM users WHERE empid = ?";

    db.query(query, empid, (err, results) => {
      if (err) {
        console.error("Database query error: " + err.message);
        res.status(500).send("Error fetching person details.");
      } else if (results.length === 0) {
        res.status(404).send("Person not found.");
      } else {
        res.json(results[0]);
      }
    });
  } else {
    res.redirect("/login"); // User is not authenticated
    //redirect to login page
  }
});

app.get("/", (req, res) => {
  // Registration Page - Create an account
  res.render("registration");
});

app.get('/analytics', (req, res) => {
  const query = `
    SELECT interaction_month AS month, COUNT(*) AS interaction_count
    FROM users
    WHERE interaction_month IN (
      DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 0 MONTH), '%M'),
      DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%M'),
      DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%M'),
      DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%M')
    )
    GROUP BY month;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }

    const rawData = results; // Assign the results to rawData

    res.render('analytics', { rawData }); // Render the 'index.ejs' template with the data
  }
  );
}
);
   
app.get("/registration", (req, res) => {
  // Registration Page - Create an account
  res.render("registration");
});

app.get("/feedback", (req, res) => {
  if (req.isAuthenticated()) {
    // Assuming you have a user object with lead information in the session
    const user = req.user;

    // Render a feedback form view and pass user data
    res.render("feedback", { user });
  } else {
    // User is not authenticated, handle this case as needed (e.g., redirect to login).
    res.redirect("/login");
  }
});




app.get("/confirmation", (req, res) => {
  // Confirmation Page
  res.render("confirmation");
});
app.get("/onetwo", (req, res) => {
  // Page for displaying information for an employee, their lead, and their manager
  res.render("onetwo");
  app.post("/onetwo", (req, res) => {
    if (req.isAuthenticated()) {
      const empid = req.user.empid;
      const { interaction, interaction_month, interaction_year } = req.body;
      const currentQuarter = getQuarter(interaction_month);

      const day11 = currentDate.getDate().toString().padStart(2, '0'); // Get the day (zero-padded)
      const month11 = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (zero-padded)
      const year11 = currentDate.getFullYear(); // Get the full year
      //quarter which starts from april
      const quarter = getQuarter(month);

      if (interaction === "yes" || interaction === "no") {
        const updateQuery =
          "UPDATE users SET interaction = ?, interaction_month = ?, interaction_year = ?, interaction_time = ?, interaction_date = ?, quarter = ? WHERE empid = ?";
        const currentDate = new Date().getDate();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const currentDateStr = currentDate.toISOString();



        const queryValues = [
          interaction,
          month11,
          year11,
          currentTime,
          day11,
          quarter,
          empid

        ];

        db.query(updateQuery, queryValues, (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Database update error: " + updateErr.message);
            res.status(500).json({ error: "Error updating interaction." });
          } else if (updateResults.affectedRows === 0) {
            res.status(404).json({ error: "User not found." });
          } else {
            //const url = `/feedback?response=${interaction}`;
            //res.redirect(url);
            res.redirect('/confirmation');
          }
        });
      } else {
        res.status(400).json({
          error: 'Invalid interaction value. Please select "Yes" or "No".',
        });
      }
    } else {
      res.redirect("/login");
    }
  });

  function getQuarter(month) {
    // Quarters starting from April
    if (month >= 4 && month <= 6) {
      return "Q1";
    } else if (month >= 7 && month <= 9) {
      return "Q2";
    } else if (month >= 10 && month <= 12) {
      return "Q3";
    } else {
      return "Q4";
    }
  }
});







function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to the next middleware or route
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to the login page
  }
}



app.get("/leadlist", (req, res) => {
  // Fetch employee data from the database
  const sql =
    "SELECT * FROM spcl where rnk = 2";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: " + err);
      return;
    }

    // Render the HTML template and pass employee details
    res.render("leadlist.ejs", { employees: results });
  });
});


app.get('/LeadDashBoard', (req, res) => {
  if (req.isAuthenticated()) {
    const leademail = req.user.email;
    console.log("Logged user email1: " + leademail); // Debug line
    const userEmail = req.user.email;
    console.log("Logged user email2: " + userEmail);
    // Get the email from the query parameter
    //const query = "SELECT f.*, CONCAT(u.firstname, ' ', u.lastname) AS full_name FROM feedback f JOIN users u ON f.empid = u.empid WHERE (f.empid, f.feedback_time) IN (SELECT f2.empid, MAX(f2.feedback_time) FROM feedback f2 GROUP BY f2.empid);  ";
    const query = "SELECT * FROM users WHERE leademail = ? ORDER BY interaction_time IS NULL, interaction_time;  ";
    //const query = "SELECT * FROM feedback";
    db.query(query, [leademail], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('An error occurred.');
      }

      res.render('LeadDashBoard', { employees: results, userEmail, data: results, leademail });// Render 'feedback.ejs' template with the data
    });
  } else {
    res.redirect('/login');
  }
});


app.get('/roundlead', isAuthenticated, (req, res) => {
  const userEmail = req.user.email; // Get the email from the query parameter

  // Here, you can request data from the 'LeadDashBoard' page using the email
  // You might want to use an API endpoint or another method to retrieve the data

  // Example: Assuming you have a function to get data from the 'LeadDashBoard' route
  // Replace this with your actual logic to fetch data
  getDataFromLeadDashBoard(userEmail, (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err);
      return;
    }

    // Log the retrieved data for debugging
    console.log('Retrieved data from LeadDashBoard:', results);

    // Render the 'roundlead.ejs' template and pass employee details and userEmail
    res.render("roundlead", { employees: results, userEmail });
  });
});



// Define a function to fetch data from the 'LeadDashBoard' route









// Handle the interaction update
app.post('/updateInteraction', (req, res) => {
  const empid = req.body.empid; // Use req.body to access the JSON data
  const interaction = req.body.interaction;
  const interaction_time = req.body.interaction_time;
  const interaction_date = req.body.interaction_date;
  const interaction_month = req.body.interaction_month;
  const interaction_year = req.body.interaction_year;

  console.log("interaction_time:", interaction_time);
  console.log("interaction_date:", interaction_date);
  console.log("interaction_month:", interaction_month);
  console.log("interaction_year:", interaction_year);
  console.log("Interaction: " + interaction); // Debug line
  console.log("Empid: " + empid); // Debug line
  const sql = `UPDATE users SET leadinteraction = ?, leadinteraction_time = ?, leadinteraction_date = ?, leadinteraction_month = ?, leadinteraction_year = ? WHERE empid = ?`;

  db.query(sql, [interaction, interaction_time, interaction_date, interaction_month, interaction_year, empid], (err, result) => {
    if (err) {
      console.error("Error updating interaction:", err);
      res.status(500).json({ success: false, message: "Error updating interaction." });
    } else {
      res.json({ success: true, message: "Interaction updated successfully!" });
      console.log("Interaction updated successfully");
    }
  });
});

// Handle user authentication
app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  // Authenticate the user here (e.g., check credentials against a database)
  if (username === 'validUser' && password === 'password') {
    // If authentication is successful, create a session or issue a token
    req.session.isAuthenticated = true;
    // Redirect to the next page
    res.redirect('/leadDashBoard');
  } else {
    res.send('Authentication failed');
  }
});







app.post('/setLeadname', (req, res) => {
  if (req.isAuthenticated()) {
    const empid = req.body.empid;
    const leademail = req.body.leademail;

    const sql = 'UPDATE users SET leademail = ? WHERE empid = ?';

    db.query(sql, [leademail, empid], (err, results) => {
      if (err) {
        console.error('Error updating leadname:', err);
        res.status(500).send('Internal server error');
      } else {
        console.log('Leadname updated successfully');
        res.send('Leadname updated successfully.');
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/registration', (req, res) => {
  const {
    firstname,
    lastname,
    empid,
    pass,
    confirmpass,
    email,
    contactNumber,
    leademail,
    manageremail,
  } = req.body;

  if (pass !== confirmpass) {
    return res.render('registration', { error: 'Passwords do not match.' });
  }

  // Generate the dupstring by combining empid and the current month
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'short' });
  const dupstring = `${empid}${month}`;

  // Check if the dupstring already exists in the users table
  const checkQuery = 'SELECT COUNT(*) as count FROM users WHERE dupstring = ?';
  db.query(checkQuery, [dupstring], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking dupstring:', checkErr);
      return res.render('registration', { error: 'Error checking the user.' });
    }

    if (checkResults[0].count > 0) {
      // The dupstring already exists; user already registered
      return res.render('registration', { error: 'User already exists.' });
    } else {
      // Define the SQL query to insert user data into the database, including the encrypted password
      const query =
        'INSERT INTO users (firstname, lastname, empid, password, email, contactNumber, leademail, manageremail, dupstring) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

      // Generate a secret key for password encryption
      const secretKey = 'your-secret-key'; // Replace with your actual secret key

      // Encrypt the password
      const passEncrypted = encrypt(pass, secretKey);

      // Execute the query
      db.query(
        query,
        [
          firstname,
          lastname,
          empid,
          passEncrypted, // Store the encrypted password
          email,
          contactNumber,
          leademail,
          manageremail,
          dupstring, // Store the dupstring
        ],
        (err, results) => {
          if (err) {
            console.error('Error inserting user data:', err);
            return res.render('registration', { error: 'Error registering the user.' });
          }

          // User registration successful, redirect to the login page
          res.redirect('/login');
        }
      );
    }
  });
});


app.post('/removeLeadname', (req, res) => {
  if (req.isAuthenticated()) {

    const empid = req.body.empid;

    const sql = 'UPDATE users SET leadinteraction = NULL WHERE empid = ?';

    connection.query(sql, [empid], (err, results) => {
      if (err) {
        console.error('Error removing leadname:', err);
        res.status(500).send('Internal server error');
      } else {
        console.log('Leadname removed successfully');
        res.send('Leadname removed successfully.');
      }
    })
  } else {
    res.redirect('/login');
  }
});




app.get("/login", (req, res) => {
  // Login Page - Enter your credentials
  res.render("login");
});

app.get("/person/:empid", (req, res) => {
  const empid = req.params.empid;
  const query = "SELECT * FROM users WHERE empid = ?";

  db.query(query, empid, (err, results) => {
    if (err) {
      console.error("Database query error: " + err.message);
      res.status(500).send("Error fetching person details.");
    } else if (results.length === 0) {
      res.status(404).send("Person not found.");
    } else {
      res.json(results[0]);
    }
  });
});

app.post("/person/:empid", (req, res) => {
  const empid = req.params.empid;
  const { firstname, lastname, email, contactNumber, leademail, manageremail } =
    req.body;
  const query =
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, contactNumber = ?, leademail = ?, manageremail = ? WHERE empid = ?";

  db.query(
    query,
    [firstname, lastname, email, contactNumber, leademail, manageremail, empid],
    (err, results) => {
      if (err) {
        console.error("Database query error: " + err.message);
        res.status(500).send("Error updating person details.");
      } else if (results.affectedRows === 0) {
        res.status(404).send("Person not found.");
      } else {
        res.send("Person details updated successfully.");
      }
    }
  );
});



app.get("/dashboard", (req, res) => {
  // Create Data Page - Enter data to be saved
  res.render("dashboard");
});



app.get("/info", (req, res) => {
  if (req.isAuthenticated()) {
    const empid = req.user.empid; // Assuming empid is stored in req.user

    // Assuming you have a database (e.g., MySQL) and a 'users' table
    const query =
      "SELECT * from users WHERE empid = ?";

    db.query(query, empid, (err, results) => {
      if (err) {
        console.error("Database query error: " + err.message);
        res.status(500).send("Error fetching user details.");
      } else if (results.length === 0) {
        res.status(404).send("User not found.");
      } else {
        const user = results[0];

        // Render the 'info.ejs' template with the user's data
        res.render("info", { user });
      }
    });
  } else {
    res.redirect("/login");
  }
});





app.post('/process_form', (req, res) => {
  // Extract your form fields here
  const {
    empid,
    one_on_one_completed,
    operational_targets_discussion,
    achievements_discussion,
    correction_discussion,
    goals_discussion,
    training_discussion,
    tl_supportive,
    one_on_one_documented,
    one_on_one_documented_shared,
    additional_message,
  } = req.body;

  // Get the current date and time
  const currentDate = new Date();
  const date = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  const currentTime = `${formattedHours}:${minutes}:${seconds} ${amOrPm}`;

  // Calculate the quarter based on specific date ranges
  const quarter = calculateQuarter(currentDate.getMonth() + 1);

  // Ensure req.body.feedback_text is a string


  

  // Define the INSERT SQL query for the "feedback" table
  const insertSql = `
    INSERT INTO feedback (
      empid,
      leadname,
      question1,
      question2,
      question3,
      question4,
      question5,
      question6,
      question7,
      question8,
      question9,
      feedback_Text,
      feedback_time,
      feedback_date,
      feedback_month,
      feedback_year,
      quarter
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;


  
  // Define the values for the INSERT query
  const insertValues = createInsertValues(
    req.user,
    one_on_one_completed,
    operational_targets_discussion,
    achievements_discussion,
    correction_discussion,
    goals_discussion,
    training_discussion,
    tl_supportive,
    one_on_one_documented,
    one_on_one_documented_shared,
    encryptedFeedbackText = "encryptedFeedbackText",
    currentTime,
    date, // Use 'DDMONYYYY' format
    month,
    year,
    quarter
  );

  // Always set the "interaction" value to 'yes'
  req.user.interaction = 'yes';

  // Execute the INSERT query for the "feedback" table
  db.query(insertSql, insertValues, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).send('Error storing feedback.');
    } else {
      console.log(`Feedback data inserted with ID: ${result.insertId}`);

      // Update the "users" table with the feedback values
      const updateValues = [
        req.user.interaction,
        month,
        date, // Use 'YYYY-MM-DD' format
        year,
        currentTime,
        quarter,
        req.user.empid,
      ];

      const updateSql = `
        UPDATE users
        SET interaction = ?,
          interaction_month = ?,
          interaction_date = ?,
          interaction_year = ?,
          interaction_time = ?,
          quarter = ?
        WHERE empid = ?
      `;

      db.query(updateSql, updateValues, (updateErr) => {
        if (updateErr) {
          console.error('Error updating user data in MySQL:', updateErr);
        } else {
          console.log('User data updated in MySQL.');
        }

        // Redirect to a confirmation page for feedback
        res.redirect('/confirmation');
      });
    }
  });
});
const decryptFeedbackText = (encryptedText, decryptionKey) => {
  const decipher = crypto.createDecipher('aes-256-cbc', decryptionKey);
  let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
  decryptedText += decipher.final('utf8');
  return decryptedText;
};

app.get('/emplist', (req, res) => {
  // Fetch employee data from the database

  const secretKey = 'your-secret-key'; // Provide your secret key here

  const decrypt = (encrypted_feedback_text, secretKey) => {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted_feedback_text = decipher.update(encrypted_feedback_text, 'hex', 'utf8');
    decrypted_feedback_text += decipher.final('utf8');
    return decrypted_feedback_text;
  }

  const query = `
    SELECT f.*, CONCAT(u.firstname, ' ', u.lastname) AS full_name, f.feedback_text AS decrypted_feedback_text
    FROM feedback f 
    JOIN users u ON f.empid = u.empid 
    WHERE (f.empid, f.feedback_time) IN (
      SELECT f2.empid, MAX(f2.feedback_time) 
      FROM feedback f2 
      GROUP BY f2.empid
    );
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('An error occurred.');
    }

    // Decrypt feedback text for each result
    results.forEach(result => {
      if (result.encrypted_feedback_text) {
        result.decrypted_feedback_text = decrypt(result.encrypted_feedback_text, secretKey);
        // Update the result property to 'decrypted_feedback_text'
      }
    });

    res.render('emplist', { data: results }); // Render 'emplist.ejs' template with the data
  });
});

app.get("/endpage", (req, res) => {
  // End Page
  res.render("endpage");
});

app.get("/history", (req, res) => {
  // History Page
  res.render("history");
});

app.get("*", (req, res) => {
  // You can customize the response for undefined routes here
  res.render("login");
});



app.get('/mngrdash', (req, res) => {
  if (req.isAuthenticated()) {
    const empid = req.user.empid; // Assuming empid is stored in req.user
    const empemail = req.user.email;
    const pending = "SELECT * FROM users WHERE leademail = ? ORDER BY ISNULL(interaction_date) DESC, interaction_date DESC";
    const queryUserData = "SELECT * FROM users";

    const queryInteractionData = `
      SELECT interaction_month AS month, COUNT(*) AS interaction_count
      FROM users
      WHERE interaction_month IN (
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%M'),
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '%M'),
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%M'),
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%M'),
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%M'),
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 0 MONTH), '%M')
      )
      GROUP BY month;
    `;

    db.query(queryUserData, [empid], (err, userResults) => {
      if (err) {
        console.error("Database query error: " + err.message);
        res.status(500).send("Error fetching user data.");
        return;
      }

      const alluser = userResults[0];

      db.query(pending, [empid], (err, userResults2) => {
        if (err) {
          console.error("Database query error: " + err.message);
          res.status(500).send("Error fetching pending user data.");
          return;
        }

        const pendinguser2 = userResults2[0];

        // Calculate the percentage of pending users
        const totalUsersCount = alluser.total_users_count; // Adjust this to match the actual column name
        const pendingUsersCount = pendinguser2.pending_users_count; // Adjust this to match the actual column name

        const percentagePending = ((pendingUsersCount / totalUsersCount) * 100).toFixed(1);

        db.query(queryInteractionData, (err, interactionResults) => {
          if (err) {
            console.error("Database query error: " + err.message);
            res.status(500).send("Error fetching interaction data.");
            return;
          }

          // Render the 'mngrdash' template with the calculated percentage
          res.render('mngrdash', {
            user: alluser,
            pendinguser: pendinguser2,
            interactionData: interactionResults,
            empemail,
            percentagePending // Include percentagePending in the context
          });
          
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function calculateQuarter(month) {
  // Calculate the quarter based on the month
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  if (month >= 10 && month <= 12) return 'Q4';
}


// Helper function to calculate the quarter
function calculateQuarter(month) {
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}

// Helper function to create insert values for the "feedback" table
function createInsertValues(
  user,
  one_on_one_completed,
  operational_targets_discussion,
  achievements_discussion,
  correction_discussion,
  goals_discussion,
  training_discussion,
  tl_supportive,
  one_on_one_documented,
  one_on_one_documented_shared,
  additional_message,
  feedback_time,
  feedback_date,
  feedback_month,
  feedback_year,
  quarter
) {
  return [
    user.empid, // Replace with actual user data
    user.leademail, // Replace with actual user data
    one_on_one_completed === 'Yes' ? 1 : 0,
    operational_targets_discussion === 'Yes' ? 1 : 0,
    achievements_discussion === 'Yes' ? 1 : 0,
    correction_discussion === 'Yes' ? 1 : 0,
    goals_discussion === 'Yes' ? 1 : 0,
    training_discussion === 'Yes' ? 1 : 0,
    tl_supportive === 'Yes' ? 1 : 0,
    one_on_one_documented === 'Yes' ? 1 : 0,
    one_on_one_documented_shared === 'Yes' ? 1 : 0,
    additional_message,
    feedback_time,
    feedback_date,
    feedback_month,
    feedback_year,
    quarter,
  ];
}


// Helper function to calculate the quarter
function calculateQuarter(month) {
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}

// Helper function to create insert values for the "feedback" table
function createInsertValues(
  user,
  one_on_one_completed,
  operational_targets_discussion,
  achievements_discussion,
  correction_discussion,
  goals_discussion,
  training_discussion,
  tl_supportive,
  one_on_one_documented,
  one_on_one_documented_shared,
  additional_message,
  feedback_time,
  feedback_date,
  feedback_month,
  feedback_year,
  quarter
) {
  return [
    user.empid, // Replace with actual user data
    user.leademail, // Replace with actual user data
    one_on_one_completed === 'Yes' ? 1 : 0,
    operational_targets_discussion === 'Yes' ? 1 : 0,
    achievements_discussion === 'Yes' ? 1 : 0,
    correction_discussion === 'Yes' ? 1 : 0,
    goals_discussion === 'Yes' ? 1 : 0,
    training_discussion === 'Yes' ? 1 : 0,
    tl_supportive === 'Yes' ? 1 : 0,
    one_on_one_documented === 'Yes' ? 1 : 0,
    one_on_one_documented_shared === 'Yes' ? 1 : 0,
    additional_message,
    feedback_time,
    feedback_date,
    feedback_month,
    feedback_year,
    quarter,
  ];
}
// Helper function to calculate the quarter
function calculateQuarter(month) {
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}

// Helper function to create insert values for the "feedback" table
function createInsertValues(user, one_on_one_completed, operational_targets_discussion, achievements_discussion, correction_discussion, goals_discussion, training_discussion, tl_supportive, one_on_one_documented, one_on_one_documented_shared, additional_message, currentTime, date, month, year, quarter) {
  return [
    user.empid, // Replace with actual user data
    user.leademail, // Replace with actual user data
    one_on_one_completed === 'Yes' ? 1 : 0,
    operational_targets_discussion === 'Yes' ? 1 : 0,
    achievements_discussion === 'Yes' ? 1 : 0,
    correction_discussion === 'Yes' ? 1 : 0,
    goals_discussion === 'Yes' ? 1 : 0,
    training_discussion === 'Yes' ? 1 : 0,
    tl_supportive === 'Yes' ? 1 : 0,
    one_on_one_documented === 'Yes' ? 1 : 0,
    one_on_one_documented_shared === 'Yes' ? 1 : 0,
    additional_message,
    currentTime,
    date,
    month,
    year,
    quarter,
  ];
}


// Helper function to calculate the quarter
function calculateQuarter(month) {
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}

// Helper function to create insert values for the "feedback" table
function createInsertValues(user, one_on_one_completed, operational_targets_discussion, achievements_discussion, correction_discussion, goals_discussion, training_discussion, tl_supportive, one_on_one_documented, one_on_one_documented_shared, additional_message, currentTime, date, month, year, quarter) {
  return [
    user.empid, // Replace with actual user data
    user.leademail, // Replace with actual user data
    one_on_one_completed === 'Yes' ? 1 : 0,
    operational_targets_discussion === 'Yes' ? 1 : 0,
    achievements_discussion === 'Yes' ? 1 : 0,
    correction_discussion === 'Yes' ? 1 : 0,
    goals_discussion === 'Yes' ? 1 : 0,
    training_discussion === 'Yes' ? 1 : 0,
    tl_supportive === 'Yes' ? 1 : 0,
    one_on_one_documented === 'Yes' ? 1 : 0,
    one_on_one_documented_shared === 'Yes' ? 1 : 0,
    additional_message,
    currentTime,
    date,
    month,
    year,
    quarter,
  ];
}


// Helper function to calculate the quarter
function calculateQuarter(month) {
  if (month >= 1 && month <= 3) return 'Q1';
  if (month >= 4 && month <= 6) return 'Q2';
  if (month >= 7 && month <= 9) return 'Q3';
  return 'Q4';
}



// Helper function to create insert values
function createInsertValues(user, one_on_one_completed, operational_targets_discussion, achievements_discussion, correction_discussion, goals_discussion, training_discussion, tl_supportive, one_on_one_documented, one_on_one_documented_shared, additional_message, currentTime, date, month, year, quarter) {
  return [
    user.empid, // Replace with actual user data
    user.leademail, // Replace with actual user data
    one_on_one_completed === 'Yes' ? 1 : 0,
    operational_targets_discussion === 'Yes' ? 1 : 0,
    achievements_discussion === 'Yes' ? 1 : 0,
    correction_discussion === 'Yes' ? 1 : 0,
    goals_discussion === 'Yes' ? 1 : 0,
    training_discussion === 'Yes' ? 1 : 0,
    tl_supportive === 'Yes' ? 1 : 0,
    one_on_one_documented === 'Yes' ? 1 : 0,
    one_on_one_documented_shared === 'Yes' ? 1 : 0,
    additional_message,
    currentTime,
    date,
    month,
    year,
    quarter,
  ];
}

app.get('/emplist', (req, res) => {

  function updateSpclRecord(loggedInUserEmail, callback) {
    const query = `
    UPDATE spcl
    SET spclinter = 'yes'
    WHERE spclinter = 'no'
    AND email = ? 
    AND EXISTS (
      SELECT 1
      FROM users
      WHERE email = ?
      AND leademail = ?
      AND interaction = 'yes'
      AND leadinteraction = 'yes'
    );
  `;

    connection.query(query, [loggedInUserEmail, loggedInUserEmail, loggedInUserEmail], (err, result) => {
      if (err) {
        console.error('Error updating spcl:', err);
      } else {
        console.log('Updated spcl records successfully');
      }
      callback(err);
    });
  }

  // Call the updateSpclRecord function with the logged-in user's email
  updateSpclRecord('logged_in_user_email', (err) => {
    if (err) {
      console.error('Error occurred during update');
    } else {
      console.log('Update operation completed');
    }

    // Close the database connection
    connection.end();
  });
}
);


// function to check if interaction is yes and leadinteraction is yes in users table and update spcl table spclinter to yes


const query = `
  UPDATE spcl
  SET spclinter = 'yes'
  WHERE email IN (
      SELECT leademail
      FROM users
      WHERE leademail IS NOT NULL
      GROUP BY leademail
      HAVING MIN(interaction) = 'yes' AND MIN(leadinteraction) = 'yes'
  );
  `;

db.query(query, (err, results) => {
  if (err) {
    console.error('Error executing the SQL query:', err);
  } else {
    // Process the query results here
  }
}
);