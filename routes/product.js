const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");

//Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    console.log(results);

    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    console.log(results);

    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { id, name, price } = req.body;
  const query = "INSERT INTO products (id, name, price) VALUES (?,?,?)";

  db.query(query, [id, name, price], (err, res) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
  });
  res.json({ message: "product added" });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const query = "UPDATE products name = ? price = ? WHERE id = ?";

  db.query(query, [name, price, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    console.log(results);

    res.json(results);
  });
});

module.exports = router;
