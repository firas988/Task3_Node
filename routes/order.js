const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");

//Execute a query to the database
const db = dbSingleton.getConnection();

// API for creating an order
router.post("/orders", (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  // Check the existence of each product
  const productIds = items.map((item) => item.product_id);
  const checkProductsQuery = "SELECT id FROM products WHERE id IN (?)";

  db.query(checkProductsQuery, [productIds], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check products" });
    }

    const existingProductIds = result.map((product) => product.id);
    const invalidProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id)
    );

    if (invalidProductIds.length > 0) {
      return res.status(400).json({
        error: `Invalid product IDs: ${invalidProductIds.join(", ")}`,
      });
    }

    // Start the transaction
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: "Transaction error" });

      // Insert the order
      const orderQuery = "INSERT INTO orders (user_id) VALUES (?)";
      db.query(orderQuery, [user_id], (err, result) => {
        if (err) {
          db.rollback(() =>
            res.status(500).json({ error: "Order creation failed" })
          );
          return;
        }

        const orderId = result.insertId;

        // Generate data for inserting products
        const orderItems = items.map((item) => [
          orderId,
          item.product_id,
          item.quantity,
        ]);
        const itemsQuery = `
    INSERT INTO order_items (order_id, product_id, quantity)
    VALUES ?
    `;

        db.query(itemsQuery, [orderItems], (err) => {
          if (err) {
            db.rollback(() =>
              res.status(500).json({ error: "Order items creation failed" })
            );
            return;
          }

          // Complete the transaction
          db.commit((err) => {
            if (err) {
              db.rollback(() =>
                res.status(500).json({ error: "Transaction commit failed" })
              );
              return;
            }

            res
              .status(201)
              .json({ message: "Order created successfully", orderId });
          });
        });
      });
    });
  });
});

module.exports = router;
