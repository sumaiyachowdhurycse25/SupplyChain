const db = require("../db");

class WarehouseModel {
  static async getAll() {
    const result = await db.query("SELECT * FROM warehouses ORDER BY id DESC");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query(
      "SELECT * FROM warehouses WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async create({ name, location }) {
    const result = await db.query(
      `INSERT INTO warehouses (name, location)
       VALUES ($1, $2) RETURNING *`,
      [name, location]
    );
    return result.rows[0];
  }

  static async update(id, { name, location }) {
    const result = await db.query(
      `UPDATE warehouses
       SET name=$1, location=$2
       WHERE id=$3 RETURNING *`,
      [name, location, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM warehouses WHERE id=$1", [id]);
    return true;
  }
}

module.exports = WarehouseModel;



