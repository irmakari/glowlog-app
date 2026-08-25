import { getDb } from '../../../services/database/db';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product.types';

interface ProductRow {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  opened_at: string | null;
  pao_months: number | null;
  image_uri: string | null;
  notes: string | null;
  archived: number;
  created_at: string;
  updated_at: string;
  usage_count?: number;
  last_used_at?: string | null;
}

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category,
    openedAt: row.opened_at ?? undefined,
    paoMonths: row.pao_months ?? undefined,
    imageUri: row.image_uri ?? undefined,
    notes: row.notes ?? undefined,
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    usageCount: row.usage_count ?? 0,
    lastUsedAt: row.last_used_at ?? undefined,
  };
}

export const productService = {
  /**
   * Fetch all active (non-archived) products ordered by creation/update
   */
  async getActiveProducts(): Promise<Product[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<ProductRow>(`
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM product_usage_logs pul WHERE pul.product_id = p.id) as usage_count,
        (SELECT MAX(used_at) FROM product_usage_logs pul WHERE pul.product_id = p.id) as last_used_at
      FROM products p
      WHERE p.archived = 0
      ORDER BY p.updated_at DESC
    `);
    return rows.map(mapRowToProduct);
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<ProductRow>(
      `
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM product_usage_logs pul WHERE pul.product_id = p.id) as usage_count,
        (SELECT MAX(used_at) FROM product_usage_logs pul WHERE pul.product_id = p.id) as last_used_at
      FROM products p
      WHERE p.id = ?
    `,
      [id]
    );

    if (!row) return null;
    return mapRowToProduct(row);
  },

  /**
   * Create a new product in SQLite
   */
  async createProduct(input: CreateProductInput): Promise<Product> {
    const db = await getDb();
    const now = new Date().toISOString();
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await db.runAsync(
      `INSERT INTO products (id, name, brand, category, opened_at, pao_months, image_uri, notes, archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        input.name,
        input.brand || null,
        input.category,
        input.openedAt || null,
        input.paoMonths ?? null,
        input.imageUri || null,
        input.notes || null,
        now,
        now,
      ]
    );

    const created = await this.getProductById(id);
    if (!created) throw new Error('Failed to retrieve newly created product');
    return created;
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const db = await getDb();
    const existing = await this.getProductById(id);
    if (!existing) throw new Error(`Product not found: ${id}`);

    const now = new Date().toISOString();
    const name = input.name !== undefined ? input.name : existing.name;
    const brand = input.brand !== undefined ? input.brand : existing.brand || null;
    const category = input.category !== undefined ? input.category : existing.category;
    const openedAt = input.openedAt !== undefined ? input.openedAt : existing.openedAt || null;
    const paoMonths = input.paoMonths !== undefined ? input.paoMonths : existing.paoMonths ?? null;
    const imageUri = input.imageUri !== undefined ? input.imageUri : existing.imageUri || null;
    const notes = input.notes !== undefined ? input.notes : existing.notes || null;
    const archived = input.archived !== undefined ? (input.archived ? 1 : 0) : existing.archived ? 1 : 0;

    await db.runAsync(
      `UPDATE products 
       SET name = ?, brand = ?, category = ?, opened_at = ?, pao_months = ?, image_uri = ?, notes = ?, archived = ?, updated_at = ?
       WHERE id = ?`,
      [name, brand, category, openedAt, paoMonths, imageUri, notes, archived, now, id]
    );

    const updated = await this.getProductById(id);
    if (!updated) throw new Error('Failed to retrieve updated product');
    return updated;
  },

  /**
   * Archive a product (soft delete)
   */
  async archiveProduct(id: string): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE products SET archived = 1, updated_at = ? WHERE id = ?`,
      [now, id]
    );
  },

  /**
   * Delete a product permanently
   */
  async deleteProduct(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
  },

  /**
   * Seed sample demo products into SQLite for development testing
   */
  async seedDemoProducts(): Promise<void> {
    const demoItems: CreateProductInput[] = [
      {
        name: 'Foaming Facial Cleanser',
        brand: 'CeraVe',
        category: 'cleanser',
        openedAt: '2026-08-01',
        paoMonths: 12,
        notes: 'Daily morning cleanser.',
      },
      {
        name: 'Niacinamide 10% + Zinc 1%',
        brand: 'The Ordinary',
        category: 'serum',
        openedAt: '2026-07-20',
        paoMonths: 6,
        notes: 'Oil control serum.',
      },
      {
        name: 'Relief Sun SPF50+ PA++++',
        brand: 'Beauty of Joseon',
        category: 'sunscreen',
        openedAt: '2026-08-10',
        paoMonths: 12,
      },
      {
        name: 'Cicaplast Baume B5+',
        brand: 'La Roche-Posay',
        category: 'moisturizer',
        openedAt: '2026-06-01',
        paoMonths: 6,
        notes: 'Calming skin barrier balm.',
      },
    ];

    for (const item of demoItems) {
      await this.createProduct(item);
    }
  },
};
