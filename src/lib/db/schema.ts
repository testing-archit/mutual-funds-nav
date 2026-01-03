import { pgTable, text, timestamp, uuid, integer, uniqueIndex } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Favorites table
export const favorites = pgTable('favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    fundSerialNumber: integer('fund_serial_number').notNull(),
    fundName: text('fund_name').notNull(),
    fundHouse: text('fund_house').notNull(),
    addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
    uniqueUserFund: uniqueIndex('unique_user_fund').on(table.userId, table.fundSerialNumber),
}));

// Search history table
export const searchHistory = pgTable('search_history', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    searchTerm: text('search_term').notNull(),
    searchedAt: timestamp('searched_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type SearchHistory = typeof searchHistory.$inferSelect;
