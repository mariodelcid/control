const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  console.error('In Railway: link your PostgreSQL service or set DATABASE_URL manually.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ingredients (
      code INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      cost_per_unit REAL DEFAULT 0,
      oz_in_unit REAL DEFAULT 1,
      cost_per_oz REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS packaging (
      code INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      cost_per_case REAL DEFAULT 0,
      units_in_case REAL DEFAULT 1,
      cost_per_unit REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sell_price REAL DEFAULT 0,
      units_per_month INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS product_ingredients (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      qty REAL DEFAULT 1,
      qty_unit TEXT DEFAULT 'oz',
      unit_cost REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS product_packaging (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      qty REAL DEFAULT 1,
      qty_unit TEXT DEFAULT 'unit',
      unit_cost REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS overhead (
      key TEXT PRIMARY KEY,
      value REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      day TEXT NOT NULL,
      v_ch INTEGER DEFAULT 0,
      v_gra INTEGER DEFAULT 0,
      v_24 INTEGER DEFAULT 0,
      v_20 INTEGER DEFAULT 0,
      v_16 INTEGER DEFAULT 0,
      v_nieve INTEGER DEFAULT 0,
      charolas INTEGER DEFAULT 0,
      cheetos INTEGER DEFAULT 0,
      conchitas INTEGER DEFAULT 0,
      sopas INTEGER DEFAULT 0,
      v_sopas INTEGER DEFAULT 0,
      doritos INTEGER DEFAULT 0,
      hot_cup INTEGER DEFAULT 0,
      red_bull INTEGER DEFAULT 0,
      tostitos INTEGER DEFAULT 0,
      takis INTEGER DEFAULT 0
    );
  `);

  // Add qty_unit columns if they don't exist (migration for existing DBs)
  try {
    await pool.query(`ALTER TABLE product_ingredients ADD COLUMN IF NOT EXISTS qty_unit TEXT DEFAULT 'oz'`);
    await pool.query(`ALTER TABLE product_packaging ADD COLUMN IF NOT EXISTS qty_unit TEXT DEFAULT 'unit'`);
  } catch(e) {
    console.log('Migration note:', e.message);
  }

  const { rows } = await pool.query('SELECT COUNT(*) as c FROM overhead');
  if (parseInt(rows[0].c) === 0) {
    await pool.query(`INSERT INTO overhead (key, value) VALUES ('rent', 1500), ('labor', 4500), ('utilities', 0), ('insurance', 80)`);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== INGREDIENTS =====
app.get('/api/ingredients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT code, name, cost_per_unit as "costPerUnit", oz_in_unit as "ozInUnit", cost_per_oz as "costPerOz" FROM ingredients ORDER BY code');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/ingredients error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ingredients', async (req, res) => {
  try {
    const { code, name, costPerUnit, ozInUnit } = req.body;
    if (code == null || !name) { return res.status(400).json({ error: 'code and name are required' }); }
    const costPerOz = ozInUnit > 0 ? costPerUnit / ozInUnit : 0;
    await pool.query('INSERT INTO ingredients (code, name, cost_per_unit, oz_in_unit, cost_per_oz) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (code) DO UPDATE SET name=$2, cost_per_unit=$3, oz_in_unit=$4, cost_per_oz=$5', [code, name, costPerUnit, ozInUnit, costPerOz]);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/ingredients error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/ingredients/:code', async (req, res) => {
  try {
    const { name, costPerUnit, ozInUnit } = req.body;
    const costPerOz = ozInUnit > 0 ? costPerUnit / ozInUnit : 0;
    await pool.query('UPDATE ingredients SET name=$1, cost_per_unit=$2, oz_in_unit=$3, cost_per_oz=$4 WHERE code=$5', [name, costPerUnit, ozInUnit, costPerOz, req.params.code]);
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/ingredients error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ingredients/:code', async (req, res) => {
  try {
    await pool.query('DELETE FROM ingredients WHERE code=$1', [req.params.code]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/ingredients error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== PACKAGING =====
app.get('/api/packaging', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT code, name, cost_per_case as "costPerCase", units_in_case as "unitsInCase", cost_per_unit as "costPerUnit" FROM packaging ORDER BY code');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/packaging error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/packaging', async (req, res) => {
  try {
    const { code, name, costPerCase, unitsInCase } = req.body;
    if (code == null || !name) { return res.status(400).json({ error: 'code and name are required' }); }
    const costPerUnit = unitsInCase > 0 ? costPerCase / unitsInCase : 0;
    await pool.query('INSERT INTO packaging (code, name, cost_per_case, units_in_case, cost_per_unit) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (code) DO UPDATE SET name=$2, cost_per_case=$3, units_in_case=$4, cost_per_unit=$5', [code, name, costPerCase, unitsInCase, costPerUnit]);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/packaging error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/packaging/:code', async (req, res) => {
  try {
    const { name, costPerCase, unitsInCase } = req.body;
    const costPerUnit = unitsInCase > 0 ? costPerCase / unitsInCase : 0;
    await pool.query('UPDATE packaging SET name=$1, cost_per_case=$2, units_in_case=$3, cost_per_unit=$4 WHERE code=$5', [name, costPerCase, unitsInCase, costPerUnit, req.params.code]);
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/packaging error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/packaging/:code', async (req, res) => {
  try {
    await pool.query('DELETE FROM packaging WHERE code=$1', [req.params.code]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/packaging error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== PRODUCTS =====
app.get('/api/products', async (req, res) => {
  try {
    const { rows: products } = await pool.query('SELECT id, name, sell_price as "sellPrice", units_per_month as "unitsPerMonth" FROM products ORDER BY id');
    for (const p of products) {
      const { rows: ings } = await pool.query('SELECT id, name, qty, qty_unit as "qtyUnit", unit_cost as "unitCost" FROM product_ingredients WHERE product_id=$1 ORDER BY id', [p.id]);
      p.ingredients = ings;
      const { rows: pkgs } = await pool.query('SELECT id, name, qty, qty_unit as "qtyUnit", unit_cost as "unitCost" FROM product_packaging WHERE product_id=$1 ORDER BY id', [p.id]);
      p.packaging = pkgs;
    }
    res.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, sellPrice, unitsPerMonth, ingredients, packaging } = req.body;
    const { rows } = await pool.query('INSERT INTO products (name, sell_price, units_per_month) VALUES ($1,$2,$3) RETURNING id', [name, sellPrice || 0, unitsPerMonth || 0]);
    const prodId = rows[0].id;
    if (ingredients) {
      for (const i of ingredients) {
        await pool.query('INSERT INTO product_ingredients (product_id, name, qty, qty_unit, unit_cost) VALUES ($1,$2,$3,$4,$5)', [prodId, i.name, i.qty, i.qtyUnit || 'oz', i.unitCost]);
      }
    }
    if (packaging) {
      for (const p of packaging) {
        await pool.query('INSERT INTO product_packaging (product_id, name, qty, qty_unit, unit_cost) VALUES ($1,$2,$3,$4,$5)', [prodId, p.name, p.qty, p.qtyUnit || 'unit', p.unitCost]);
      }
    }
    res.json({ ok: true, id: prodId });
  } catch (err) {
    console.error('POST /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, sellPrice, unitsPerMonth, ingredients, packaging } = req.body;
    await pool.query('UPDATE products SET name=$1, sell_price=$2, units_per_month=$3 WHERE id=$4', [name, sellPrice, unitsPerMonth, req.params.id]);
    if (ingredients !== undefined) {
      await pool.query('DELETE FROM product_ingredients WHERE product_id=$1', [req.params.id]);
      for (const i of ingredients) {
        await pool.query('INSERT INTO product_ingredients (product_id, name, qty, qty_unit, unit_cost) VALUES ($1,$2,$3,$4,$5)', [req.params.id, i.name, i.qty, i.qtyUnit || 'oz', i.unitCost]);
      }
    }
    if (packaging !== undefined) {
      await pool.query('DELETE FROM product_packaging WHERE product_id=$1', [req.params.id]);
      for (const p of packaging) {
        await pool.query('INSERT INTO product_packaging (product_id, name, qty, qty_unit, unit_cost) VALUES ($1,$2,$3,$4,$5)', [req.params.id, p.name, p.qty, p.qtyUnit || 'unit', p.unitCost]);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== OVERHEAD =====
app.get('/api/overhead', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM overhead');
    const obj = {};
    rows.forEach(r => obj[r.key] = r.value);
    res.json(obj);
  } catch (err) {
    console.error('GET /api/overhead error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/overhead', async (req, res) => {
  try {
    for (const [k, v] of Object.entries(req.body)) {
      await pool.query('INSERT INTO overhead (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value=$2', [k, Number(v)]);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/overhead error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== SALES =====
app.get('/api/sales', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, date, day, v_ch as "vCh", v_gra as "vGra", v_24 as "v24", v_20 as "v20", v_16 as "v16", v_nieve as "vNieve", charolas, cheetos, conchitas, sopas, v_sopas as "vSopas", doritos, hot_cup as "hotCup", red_bull as "redBull", tostitos, takis FROM sales ORDER BY date ASC`);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/sales error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const s = req.body;
    const { rows } = await pool.query(`INSERT INTO sales (date,day,v_ch,v_gra,v_24,v_20,v_16,v_nieve,charolas,cheetos,conchitas,sopas,v_sopas,doritos,hot_cup,red_bull,tostitos,takis) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
      [s.date,s.day,s.vCh||0,s.vGra||0,s.v24||0,s.v20||0,s.v16||0,s.vNieve||0,s.charolas||0,s.cheetos||0,s.conchitas||0,s.sopas||0,s.vSopas||0,s.doritos||0,s.hotCup||0,s.redBull||0,s.tostitos||0,s.takis||0]);
    res.json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error('POST /api/sales error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sales WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/sales error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Elotes Locos app running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
