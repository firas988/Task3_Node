// Importing necessary modules
const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");
const bcrypt = require("bcrypt");

// Execute a query to the database
const db = dbSingleton.getConnection();

// Route to get all users
// This route handles GET requests to the root URL and retrieves all users from the database
router.get("/", (req, res) => {
  const query = "SELECT * FROM users"; // SQL query to select all users
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err); // Send a 500 error if the query fails
      return;
    }
    console.log(results); // Log the results to the console

    res.json(results); // Send the results as a JSON response
  });
});

// Route to handle user login
// This route handles POST requests to /login and checks user credentials
router.post("/login", (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  const query = "SELECT * FROM users WHERE email = ?"; // SQL query to find user by email
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.send("notfound"); // Send "notfound" if there's an error
    }
    if (results.length === 0) {
      return res.send("notfound"); // Send "notfound" if no user is found
    }

    if (results[0].password) {
      bcrypt.compare(password, results[0].password, (err, isPasswordValid) => {
        if (err) {
          return res.send("notfound"); // Send "notfound" if there's an error during password comparison
        }
        if (isPasswordValid) {
          return res.send("found"); // Send "found" if the password is valid
        } else {
          return res.send("notfound"); // Send "notfound" if the password is invalid
        }
      });
    }
  });
});

// Route to add a new user
// This route handles POST requests to the root URL and adds a new user to the database
router.post("/", async (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, and password from the request body

  const query = "INSERT INTO users (name,email,password) VALUES (?,?,?)"; // SQL query to insert a new user

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing it
  db.query(query, [name, email, hashedPassword], (err, insertRes) => {
    if (err) {
      res.status(500).send(err); // Send a 500 error if the query fails
      return;
    }

    res.json({ message: "User added!", row: insertRes.insertId }); // Send a success message with the new user's ID
  });
});

// Route to update an existing user
// This route handles PUT requests to /:id and updates the user with the specified ID
router.put("/:id", (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, and password from the request body
  const { id } = req.params; // Extract the user ID from the request parameters
  const query =
    "UPDATE users SET name = ? , email = ? , password = ? WHERE id = ?"; // SQL query to update the user

  const hashedPassword = bcrypt.hash(password, 10); // Hash the password before updating it
  db.query(query, [name, email, hashedPassword, id], (err, updRes) => {
    if (err) {
      res.status(500).send(err); // Send a 500 error if the query fails
      return;
    }
    res.json({ message: "User UPDATED!" }); // Send a success message
  });
});

// Route to delete a user
// This route handles DELETE requests to /:id and deletes the user with the specified ID
router.delete("/:id", (req, res) => {
  const { id } = req.params; // Extract the user ID from the request parameters
  const query = "DELETE FROM users WHERE id = ?"; // SQL query to delete the user

  db.query(query, [id], (err, updRes) => {
    if (err) {
      res.status(500).send(err); // Send a 500 error if the query fails
      return;
    }
    res.json({ message: "User DELETED!" }); // Send a success message
  });
});

// Exporting the router to be used in other parts of the application
module.exports = router;
