const db = require("../db");

exports.getAll = async () => {
  const res = await db.query("SELECT * FROM suppliers ORDER BY id DESC");
  return res.rows;
};

exports.create = async ({ name, email, phone }) => {
  const res = await db.query(
    `INSERT INTO suppliers (name, email, phone)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [name, email, phone]
  );
  return res.rows[0];
};

exports.update = async (id, { name, email, phone }) => {
  const res = await db.query(
    `UPDATE suppliers
     SET name=$1, email=$2, phone=$3
     WHERE id=$4
     RETURNING *`,
    [name, email, phone, id]
  );
  return res.rows[0];
};

exports.remove = async (id) => {
  await db.query("DELETE FROM suppliers WHERE id=$1", [id]);
};
