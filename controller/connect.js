// express
const express = require("express");

// sql
const sql = require("mssql");
const bcrypt = require("bcrypt");

// env
require("dotenv").config();
console.log("DB USER:", process.env.USER);

// configure db connection
const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  port: Number(process.env.PORT) || 1433,
  options: {
    encrypt: process.env.ENCRYPT === "true", // read from env
    trustServerCertificate: false,
  },
};

// Global pool instance
let pool;

const connectToDatabase = async () => {
  try {
    pool = await sql.connect(config);
    console.log("✅ Connected to Azure SQL Database");
  } catch (err) {
    console.error("❌ Error connecting to Database:", err.message);
    throw err;
  }
};

const getAllGames = async () => {
  try {
    const result = await pool.request().query("SELECT * FROM games");
    return result.recordset;
  } catch (err) {
    console.error("❌ Error getting games:", err.message);
    throw err;
  }
};

module.exports = {
  sql,
  connectToDatabase,
  getAllGames,
  getPool: () => pool,
};
