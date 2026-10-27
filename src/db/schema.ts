import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "processing",
  "packed",
  "dispatched",
  "delivered",
  "returned",
]);

export const movementTypeEnum = pgEnum("movement_type", [
  "restock",
  "reservation",
  "sale",
  "release",
  "return",
]);

const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(1536)";
  },
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  priceKes: numeric("price_kes", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  weightGrams: integer("weight_grams").notNull(),
  imageUrl: varchar("image_url", { length: 512 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  role: varchar("role", { length: 20 }).default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  buyerName: varchar("buyer_name", { length: 255 }).notNull(),
  buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
  buyerPhone: varchar("buyer_phone", { length: 20 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  deliveryStatus: deliveryStatusEnum("delivery_status")
    .default("processing")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
  productNameSnapshot: varchar("product_name_snapshot", {
    length: 255,
  }).notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  gateway: varchar("gateway", { length: 20 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  providerReference: varchar("provider_reference", { length: 100 })
    .notNull()
    .unique(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  rawPayload: text("raw_payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  orderId: uuid("order_id").references(() => orders.id),
  quantityChange: integer("quantity_change").notNull(),
  type: movementTypeEnum("type").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productEmbeddings = pgTable("product_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  embedding: vector("embedding").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const inventoryMovementsRelations = relations(
  inventoryMovements,
  ({ one }) => ({
    product: one(products, {
      fields: [inventoryMovements.productId],
      references: [products.id],
    }),
    order: one(orders, {
      fields: [inventoryMovements.orderId],
      references: [orders.id],
    }),
  }),
);
