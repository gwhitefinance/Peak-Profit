import { pgTable, varchar, timestamp, real, text, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const positions = pgTable('positions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  avgPrice: real('avg_price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  currentPrice: real('current_price'),
  quantity: real('quantity').notNull(),
  side: varchar('side').notNull(),
  symbol: varchar('symbol').notNull(),
  unrealizedPnl: real('unrealized_pnl'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  userId: varchar('user_id').notNull(),
});

export const tradeJournals = pgTable('trade_journals', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  imageUrl: text('image_url'),
  title: text('title'),
  userId: varchar('user_id'),
});

export const trades = pgTable('trades', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  commission: real('commission'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  entryPrice: real('entry_price').notNull(),
  exitPrice: real('exit_price'),
  openedAt: timestamp('opened_at', { withTimezone: true }).defaultNow().notNull(),
  pnl: real('pnl'),
  quantity: real('quantity').notNull(),
  side: varchar('side').notNull(),
  status: varchar('status').default('open').notNull(),
  symbol: varchar('symbol').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  userId: varchar('user_id').notNull(),
});

export const tradingAccounts = pgTable('trading_accounts', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  balance: real('balance').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  equity: real('equity').default(0).notNull(),
  freeMargin: real('free_margin').default(0).notNull(),
  marginUsed: real('margin_used').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  userId: varchar('user_id').notNull(),
});