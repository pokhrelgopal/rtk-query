// Import required modules
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); // Add this line

// Initialize the Express app
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Add this line to enable CORS for all routes

// Configure the PostgreSQL database connection
const pool = new Pool({
  connectionString:
    "postgresql://drizzle_owner:p4ZzY7WXUGdO@ep-autumn-hall-a1k5yg3w.ap-southeast-1.aws.neon.tech/drizzle?sslmode=require",
});

// Initialize database table
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT false
            );
        `);
    console.log("Table initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
})();

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
      [title, completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
