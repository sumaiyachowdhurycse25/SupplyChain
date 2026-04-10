const db = require("../db");

class ProductModel {
  static async getAll() {
    const result = await db.query("SELECT * FROM products ORDER BY id DESC");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async create({ name, sku, reorder_level }) {
    const result = await db.query(
      `INSERT INTO products (name, sku, reorder_level)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, sku, reorder_level]
    );
    return result.rows[0];
  }

  static async update(id, { name, reorder_level }) {
    const result = await db.query(
      `UPDATE products
       SET name=$1, reorder_level=$2
       WHERE id=$3 RETURNING *`,
      [name, reorder_level, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM products WHERE id=$1", [id]);
    return true;
  }
}

module.exports = ProductModel;








//const db = require("../db");

//exports.getAll = async () => {
//  const res = await db.query("SELECT * FROM products");
//  return res.rows;
//};
