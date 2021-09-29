const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { isLoggedin } = require('../../middleware');
const { dbConfig } = require('../../config');

//Post request to accounts

router.post('/accounts', isLoggedin, async (req, res) => {
  const { group_id } = req.body;
  if (!group_id) {
    return res.status(400).send({ err: 'Invalid data' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO accounts (group_id,user_id) VALUES
        (${mysql.escape(group_id)}
    ,${mysql.escape(req.userData.id)})`,
    );
    await con.end();
    res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data passed! please try' });
  }
});

//Get accounts

router.get('/accounts', isLoggedin, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT category.id, category.name, accounts.group_id, accounts.user_id 
      FROM category 
      LEFT JOIN accounts 
      ON category.id = accounts.group_id 
      WHERE user_id = ${mysql.escape(req.userData.id)}`,
    );
    await con.end();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whoopsy, DB Error!' });
  }
});

//GET bills by user id

router.get('/bills/:id?', isLoggedin, async (req, res) => {
  const id = req.params.id || '';
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      SELECT * FROM bills  
      ${id && `WHERE group_id = '${req.params.id}'`}
      `);
    await con.end();
    res.send(data);
  } catch {
    res.status(500).send({ err: 'Whoopsy, DB Error!' });
  }
});

//POST to bills

router.post('/bills', isLoggedin, async (req, res) => {
  const { group_id, amount, description } = req.body;
  if (!group_id || !amount || !description) {
    return res.status(400).send({ err: 'Invalid data passed!' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO bills (group_id,amount,description) VALUES
          (${mysql.escape(group_id)}
      ,${mysql.escape(amount)},${mysql.escape(description)})`,
    );
    await con.end();
    res.send(data);
  } catch {
    res.status(400).send({ err: 'Invalid data passed! please try' });
  }
});

module.exports = router;
