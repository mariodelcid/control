// Run: DATABASE_URL=your_url node seed.js
// Seeds the database with all data from your Costos All Excel sheet

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
});

const INGREDIENTS = [
  [100,"Corn grated",40.5,480,0.084375],[101,"Corn Cob",32.5,288,0.112847],[102,"Sour Cream",30,80,0.375],
  [103,"Butter",22.06,280,0.078786],[104,"Valentina",5.54,408,0.013578],[105,"Salt",0.76,26,0.029231],
  [106,"Lime natural",9.35,64,0.146094],[107,"Lime bulk",7.87,128,0.061484],[108,"Flour",1.97,80,0.024625],
  [109,"Milk",39.88,336,0.118690],[110,"Whipped Cream",35.68,180,0.198222],[111,"Nutella",27.28,105.82,0.257796],
  [112,"Caramel syrup",4.46,22,0.202727],[113,"Chocolate syrup",4.52,24,0.188333],[114,"Strawberry syrup",2.64,22,0.12],
  [115,"Sugar",2.97,64,0.046406],[116,"Strawberry powder",31.96,48,0.665833],[117,"Taro Powder",16.99,35.2,0.482670],
  [118,"Horchata Powder",41.3,56,0.7375],[119,"Vanilla Powder",24.5,56,0.4375],[120,"Shredded cheese",11.37,80,0.142125],
  [121,"Red Bull",38.99,201.6,0.193403],[122,"Romano Cheese",30.78,160,0.192375],[123,"Cotija Cheese",28.17,80,0.352125],
  [124,"Mayonnaise",22,128,0.171875],[125,"Mango syrup",8.76,128,0.068438],[126,"Fructose",93.5,880,0.10625],
  [127,"Boba pearls",24.99,71.6,0.349022],[128,"Dulce de leche powder",24.29,56,0.433750],
  [129,"Mango Frozen",26.44,160,0.16525],[130,"Strawberry Frozen",2.86,16,0.17875],
  [131,"Watermelon ice",24.75,320,0.077344],[132,"Lemon pepper",37.43,112,0.334196],
  [133,"Cayenne",16.94,80,0.21175],[134,"Takis fuego 4oz",57.99,160,0.362438],
  [135,"Conchitas salsa verde",45.32,28,1.618571],[136,"Chetos hot",45.32,28,1.618571],
  [137,"Sopas (snack)",0.75,1,0.75],[138,"Tostaditas",45.32,28,1.618571],
  [139,"Eggs",4.12,31.5,0.130794],[140,"Oil vegetable",3.57,48,0.074375],
  [141,"Tajin",16.1,32,0.503125],[142,"Espresso Powder",24.5,56,0.4375],
  [143,"Caramel Latte Powder",24.5,56,0.4375]
];

const PACKAGING = [
  [200,"Charola (tray)",22.5,200,0.1125],[201,"Vaso 20/16oz foam",37.97,500,0.07594],
  [202,"Vaso 12oz foam",42.48,1000,0.04248],[203,"Spoon medium weight",30.31,1000,0.03031],
  [204,"Forks",6.69,1000,0.00669],[206,"Lids flat 16-24oz",6,100,0.06],
  [207,"Lids Dome with hole",7.47,100,0.0747],[208,"Lids Dome no hole",7.47,100,0.0747],
  [210,"Portavasos (cup carrier)",38.11,75,0.508133],[211,"Napkins",47.04,2000,0.02352],
  [212,"Vaso 16oz clear",10.74,100,0.1074],[214,"Vaso 24oz clear",12.58,100,0.1258]
];

const PRODUCTS = [
  {name:"Elote Entero/Cob",sellPrice:4.99,unitsPerMonth:203,
   ingredients:[{n:"Corn Cob",q:1,c:0.112847},{n:"Butter",q:1,c:0.078786},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094},{n:"Valentina",q:1,c:0.013578},{n:"Salt",q:0.01,c:0.029231},{n:"Lemon pepper",q:0.1,c:0.334196},{n:"Cayenne",q:0.1,c:0.21175}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Elote Chico",sellPrice:4.99,unitsPerMonth:1031,
   ingredients:[{n:"Corn grated",q:10,c:0.084375},{n:"Butter",q:1,c:0.078786},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094},{n:"Valentina",q:0.5,c:0.013578},{n:"Salt",q:0.01,c:0.029231},{n:"Lemon pepper",q:0.1,c:0.334196},{n:"Cayenne",q:0.01,c:0.21175}],
   packaging:[{n:"Vaso 12oz foam",q:1,c:0.04248},{n:"Spoon medium weight",q:1,c:0.03031},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Elote Grande",sellPrice:6.99,unitsPerMonth:277,
   ingredients:[{n:"Corn grated",q:12,c:0.084375},{n:"Butter",q:1,c:0.078786},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094},{n:"Valentina",q:0.1,c:0.013578},{n:"Salt",q:0.01,c:0.029231},{n:"Lemon pepper",q:0.1,c:0.334196},{n:"Cayenne",q:0.01,c:0.21175}],
   packaging:[{n:"Vaso 20/16oz foam",q:1,c:0.07594},{n:"Spoon medium weight",q:1,c:0.03031},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Taki-Lokos",sellPrice:6.99,unitsPerMonth:9,
   ingredients:[{n:"Takis fuego 4oz",q:1,c:0.362438},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Conchitas",sellPrice:6.99,unitsPerMonth:5,
   ingredients:[{n:"Conchitas salsa verde",q:1,c:1.618571},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Tostaditas",sellPrice:6.99,unitsPerMonth:23,
   ingredients:[{n:"Tostaditas",q:1,c:1.618571},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Sopas Preparadas",sellPrice:4.99,unitsPerMonth:327,
   ingredients:[{n:"Sopas (snack)",q:1,c:0.75},{n:"Sour Cream",q:1,c:0.375},{n:"Mayonnaise",q:1,c:0.171875},{n:"Cotija Cheese",q:1,c:0.352125},{n:"Lime natural",q:1,c:0.146094},{n:"Valentina",q:0.5,c:0.013578}],
   packaging:[{n:"Spoon medium weight",q:1,c:0.03031},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Crepa (Nutella/Banana)",sellPrice:8,unitsPerMonth:3,
   ingredients:[{n:"Flour",q:1,c:0.024625},{n:"Eggs",q:1,c:0.130794},{n:"Milk",q:1,c:0.118690},{n:"Sugar",q:1,c:0.046406},{n:"Butter",q:1,c:0.078786},{n:"Salt",q:0.1,c:0.029231},{n:"Nutella",q:1,c:0.257796},{n:"Whipped Cream",q:1,c:0.198222},{n:"Oil vegetable",q:1,c:0.074375}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Crepa (Fresa/Cream Cheese)",sellPrice:8,unitsPerMonth:3,
   ingredients:[{n:"Flour",q:1,c:0.024625},{n:"Eggs",q:1,c:0.130794},{n:"Milk",q:1,c:0.118690},{n:"Sugar",q:1,c:0.046406},{n:"Butter",q:1,c:0.078786},{n:"Salt",q:0.1,c:0.029231},{n:"Strawberry syrup",q:1,c:0.12},{n:"Whipped Cream",q:1,c:0.198222},{n:"Oil vegetable",q:1,c:0.074375}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Crispy Crepa",sellPrice:8,unitsPerMonth:3,
   ingredients:[{n:"Flour",q:1,c:0.024625},{n:"Eggs",q:1,c:0.130794},{n:"Milk",q:1,c:0.118690},{n:"Sugar",q:1,c:0.046406},{n:"Butter",q:1,c:0.078786},{n:"Salt",q:0.1,c:0.029231},{n:"Nutella",q:1,c:0.257796},{n:"Whipped Cream",q:1,c:0.198222},{n:"Oil vegetable",q:1,c:0.074375}],
   packaging:[{n:"Charola (tray)",q:1,c:0.1125},{n:"Forks",q:1,c:0.00669},{n:"Napkins",q:1,c:0.02352}]},
  {name:"Boba Tea",sellPrice:5.99,unitsPerMonth:7,
   ingredients:[{n:"Taro Powder",q:1,c:0.482670},{n:"Milk",q:1,c:0.118690},{n:"Fructose",q:1,c:0.10625},{n:"Boba pearls",q:1,c:0.349022},{n:"Sugar",q:1,c:0.046406}],
   packaging:[{n:"Vaso 24oz clear",q:1,c:0.1258},{n:"Lids Dome with hole",q:1,c:0.0747},{n:"Spoon medium weight",q:1,c:0.03031}]},
  {name:"Chamoyada (Mango)",sellPrice:6.99,unitsPerMonth:154,
   ingredients:[{n:"Mango Frozen",q:1,c:0.16525},{n:"Mango syrup",q:1,c:0.068438},{n:"Lime natural",q:1,c:0.146094},{n:"Tajin",q:1,c:0.503125},{n:"Sugar",q:1,c:0.046406}],
   packaging:[{n:"Vaso 24oz clear",q:1,c:0.1258},{n:"Lids Dome with hole",q:1,c:0.0747},{n:"Spoon medium weight",q:1,c:0.03031}]},
  {name:"Chamoyada (Fresa)",sellPrice:6.99,unitsPerMonth:125,
   ingredients:[{n:"Strawberry Frozen",q:1,c:0.17875},{n:"Strawberry syrup",q:1,c:0.12},{n:"Lime natural",q:1,c:0.146094},{n:"Tajin",q:1,c:0.503125},{n:"Sugar",q:1,c:0.046406}],
   packaging:[{n:"Vaso 24oz clear",q:1,c:0.1258},{n:"Lids Dome with hole",q:1,c:0.0747},{n:"Spoon medium weight",q:1,c:0.03031}]},
  {name:"Refresher",sellPrice:3.99,unitsPerMonth:104,
   ingredients:[{n:"Horchata Powder",q:1,c:0.7375},{n:"Strawberry powder",q:1,c:0.665833},{n:"Fructose",q:1,c:0.10625},{n:"Sugar",q:1,c:0.046406}],
   packaging:[{n:"Vaso 24oz clear",q:1,c:0.1258},{n:"Lids flat 16-24oz",q:1,c:0.06}]},
  {name:"Caramel Frapuchino",sellPrice:5.99,unitsPerMonth:30,
   ingredients:[{n:"Caramel syrup",q:1,c:0.202727},{n:"Milk",q:1,c:0.118690},{n:"Sugar",q:1,c:0.046406},{n:"Whipped Cream",q:1,c:0.198222}],
   packaging:[{n:"Vaso 24oz clear",q:1,c:0.1258},{n:"Lids Dome no hole",q:1,c:0.0747}]},
  {name:"Nieves",sellPrice:2.5,unitsPerMonth:23,
   ingredients:[{n:"Watermelon ice",q:1,c:0.077344}],
   packaging:[{n:"Vaso 12oz foam",q:1,c:0.04248},{n:"Spoon medium weight",q:1,c:0.03031}]}
];

const SALES = [
  ["2026-01-02","Fri",48,8,7,12,0,0,16,1,1,5,0,1,1,0,2,1],
  ["2026-01-03","Sat",34,19,9,9,0,0,2,3,1,4,0,1,0,0,0,0],
  ["2026-01-04","Sun",36,3,12,12,6,0,9,0,0,4,0,0,1,0,1,2],
  ["2026-01-05","Mon",23,3,16,8,3,0,16,0,0,3,0,0,0,0,0,2],
  ["2026-01-06","Tue",39,9,6,7,4,0,11,1,1,4,0,0,1,1,1,1],
  ["2026-01-07","Wed",24,10,5,2,0,0,18,0,0,1,0,0,0,0,1,0],
  ["2026-01-08","Thu",28,7,5,7,3,0,6,1,1,3,0,0,1,0,1,1],
  ["2026-01-09","Fri",31,5,5,5,3,0,18,0,0,0,0,0,0,0,0,0],
  ["2026-01-10","Sat",35,7,8,9,2,2,6,0,0,3,0,0,0,0,0,0],
  ["2026-01-11","Sun",39,8,12,24,3,0,16,0,0,4,0,0,1,0,2,1],
  ["2026-01-12","Mon",26,6,3,6,1,0,13,1,0,4,0,0,0,0,1,0],
  ["2026-01-13","Tue",50,8,1,9,1,0,14,1,1,0,0,1,0,0,2,0],
  ["2026-01-14","Wed",26,7,4,4,4,0,1,0,0,5,0,0,0,0,0,0],
  ["2026-01-15","Thu",24,6,4,6,1,1,2,2,0,3,0,0,4,0,1,0],
  ["2026-01-16","Fri",29,7,3,8,2,0,12,0,0,0,0,0,0,0,0,0],
  ["2026-01-17","Sat",38,20,7,7,4,0,20,1,0,4,0,1,4,0,5,4],
  ["2026-01-18","Sun",40,11,7,12,3,1,9,1,1,3,0,0,0,0,1,1],
  ["2026-01-19","Mon",31,5,5,8,3,0,8,0,0,5,0,0,1,0,1,1],
  ["2026-01-20","Tue",30,6,5,3,2,0,8,0,0,2,0,0,0,0,0,0],
  ["2026-01-21","Wed",20,3,5,5,2,0,8,0,0,2,0,0,0,0,0,0],
  ["2026-01-22","Thu",24,4,4,6,0,0,8,0,0,3,0,0,1,0,0,0],
  ["2026-01-23","Fri",27,4,5,5,0,0,12,1,0,0,0,0,0,1,0,1],
  ["2026-01-24","Sat",42,10,11,11,5,0,14,2,1,5,0,0,3,0,1,3],
  ["2026-01-25","Sun",44,14,11,19,5,1,15,2,0,3,0,0,0,1,2,2],
  ["2026-01-26","Mon",28,9,4,5,2,0,8,1,0,3,0,0,0,0,0,1],
  ["2026-01-27","Tue",25,5,7,3,1,0,9,0,0,2,0,0,0,0,0,0],
  ["2026-01-28","Wed",23,5,2,7,1,0,5,0,0,2,0,0,0,0,0,0],
  ["2026-01-29","Thu",25,6,3,6,2,0,8,0,0,0,0,0,0,0,0,0],
  ["2026-01-30","Fri",33,5,5,6,1,0,7,0,0,2,2,0,0,0,0,0],
  ["2026-01-31","Sat",44,14,13,13,5,0,12,2,2,6,1,0,1,1,2,2],
  ["2026-02-01","Sun",37,6,9,19,5,0,14,0,0,2,1,0,1,0,2,2],
  ["2026-02-02","Mon",27,3,5,5,0,0,8,0,0,5,1,0,0,0,0,0],
  ["2026-02-03","Tue",28,6,9,5,3,0,8,0,0,4,0,0,0,0,0,1],
  ["2026-02-04","Wed",24,6,3,3,3,0,6,0,0,2,0,0,1,0,0,0],
  ["2026-02-05","Thu",22,6,3,3,2,0,4,0,1,3,1,0,0,0,0,0],
  ["2026-02-06","Fri",34,6,3,9,4,0,3,0,0,2,0,0,0,1,0,0],
  ["2026-02-07","Sat",40,14,12,13,6,0,8,2,2,5,3,1,2,1,2,3],
  ["2026-02-08","Sun",41,9,12,18,6,0,11,1,1,2,0,0,1,0,2,2],
  ["2026-02-09","Mon",26,5,5,5,0,0,8,0,0,3,0,0,0,0,0,0],
  ["2026-02-10","Tue",31,6,5,9,3,0,4,0,0,2,0,0,0,0,0,1],
  ["2026-02-11","Wed",27,4,5,6,3,0,1,0,0,3,0,0,0,0,0,0],
  ["2026-02-12","Thu",25,5,5,6,1,0,5,0,0,2,0,0,0,1,0,0],
  ["2026-02-13","Fri",29,5,6,9,3,0,3,0,0,0,1,0,0,0,0,0],
  ["2026-02-14","Sat",48,17,9,14,8,3,16,3,1,7,2,1,6,1,3,4],
  ["2026-02-15","Sun",42,11,8,17,5,1,14,2,0,5,0,1,1,1,3,3],
  ["2026-02-16","Mon",28,7,7,6,1,0,5,1,0,3,1,0,0,0,0,1],
  ["2026-02-17","Tue",32,8,5,8,2,0,10,0,1,2,0,0,1,0,0,1],
  ["2026-02-18","Wed",22,6,4,5,3,0,6,0,0,3,0,0,0,0,0,0],
  ["2026-02-19","Thu",20,7,7,8,2,0,7,1,0,2,0,0,1,0,0,0],
  ["2026-02-20","Fri",33,8,5,7,3,0,12,0,0,3,0,0,0,1,0,2],
  ["2026-02-21","Sat",44,18,10,15,7,1,16,3,2,6,2,1,3,1,5,5],
  ["2026-02-22","Sun",38,10,10,16,4,1,12,0,0,4,0,0,1,0,2,2],
  ["2026-02-23","Mon",25,4,5,6,1,0,6,0,0,3,0,0,0,0,0,1],
  ["2026-02-24","Tue",26,7,8,6,2,0,8,1,1,2,1,0,0,1,0,1],
  ["2026-02-25","Wed",19,12,7,11,2,0,7,1,1,0,0,0,2,0,0,3],
  ["2026-02-26","Thu",22,9,5,10,3,0,13,0,1,2,0,0,0,0,0,0],
  ["2026-02-27","Fri",30,9,3,8,2,0,4,0,0,0,0,0,0,1,0,0],
  ["2026-02-28","Sat",31,9,8,20,5,1,4,0,0,4,0,0,0,0,0,0]
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await pool.query('DELETE FROM product_ingredients');
  await pool.query('DELETE FROM product_packaging');
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM ingredients');
  await pool.query('DELETE FROM packaging');
  await pool.query('DELETE FROM sales');
  await pool.query('DELETE FROM overhead');

  // Reset sequences
  await pool.query("ALTER SEQUENCE products_id_seq RESTART WITH 1");
  await pool.query("ALTER SEQUENCE product_ingredients_id_seq RESTART WITH 1");
  await pool.query("ALTER SEQUENCE product_packaging_id_seq RESTART WITH 1");
  await pool.query("ALTER SEQUENCE sales_id_seq RESTART WITH 1");

  // Ingredients
  for (const [code, name, cpu, oiu, cpo] of INGREDIENTS) {
    await pool.query('INSERT INTO ingredients VALUES ($1,$2,$3,$4,$5)', [code, name, cpu, oiu, cpo]);
  }
  console.log(`  ${INGREDIENTS.length} ingredients`);

  // Packaging
  for (const [code, name, cpc, uic, cpu] of PACKAGING) {
    await pool.query('INSERT INTO packaging VALUES ($1,$2,$3,$4,$5)', [code, name, cpc, uic, cpu]);
  }
  console.log(`  ${PACKAGING.length} packaging items`);

  // Products with BOM
  for (const p of PRODUCTS) {
    const { rows } = await pool.query('INSERT INTO products (name, sell_price, units_per_month) VALUES ($1,$2,$3) RETURNING id',
      [p.name, p.sellPrice, p.unitsPerMonth]);
    const id = rows[0].id;
    for (const i of p.ingredients) {
      await pool.query('INSERT INTO product_ingredients (product_id, name, qty, unit_cost) VALUES ($1,$2,$3,$4)', [id, i.n, i.q, i.c]);
    }
    for (const pk of p.packaging) {
      await pool.query('INSERT INTO product_packaging (product_id, name, qty, unit_cost) VALUES ($1,$2,$3,$4)', [id, pk.n, pk.q, pk.c]);
    }
  }
  console.log(`  ${PRODUCTS.length} products with BOM`);

  // Overhead
  await pool.query(`INSERT INTO overhead VALUES ('rent', 1500), ('labor', 4500), ('utilities', 0), ('insurance', 80)`);
  console.log('  Overhead set');

  // Sales
  for (const s of SALES) {
    await pool.query(`INSERT INTO sales (date,day,v_ch,v_gra,v_24,v_20,v_16,v_nieve,charolas,cheetos,conchitas,sopas,v_sopas,doritos,hot_cup,red_bull,tostitos,takis)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`, s);
  }
  console.log(`  ${SALES.length} sales entries`);

  console.log('Done! Database seeded successfully.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
