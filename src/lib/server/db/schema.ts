import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable(
	'user',
	{
		id: text('id').primaryKey().notNull(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
		image: text('image'),
		createdAt: integer('createdAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: integer('updatedAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull()
	},
	(table) => [uniqueIndex('user_email_key').on(table.email)]
);

export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey().notNull(),
		expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
		token: text('token').notNull(),
		createdAt: integer('createdAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
		ipAddress: text('ipAddress'),
		userAgent: text('userAgent'),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [
		index('session_userId_idx').on(table.userId),
		uniqueIndex('session_token_key').on(table.token)
	]
);

export const account = sqliteTable(
	'account',
	{
		id: text('id').primaryKey().notNull(),
		accountId: text('accountId').notNull(),
		providerId: text('providerId').notNull(),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('accessToken'),
		refreshToken: text('refreshToken'),
		idToken: text('idToken'),
		accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
		refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
		scope: text('scope'),
		password: text('password'),
		createdAt: integer('createdAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = sqliteTable(
	'verification',
	{
		id: text('id').primaryKey().notNull(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
		createdAt: integer('createdAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: integer('updatedAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const salesTransaction = sqliteTable(
	'sales_transaction',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		orderId: text('orderId', { length: 20 }).notNull(),
		customerName: text('customerName', { length: 100 }).notNull(),
		customerEmail: text('customerEmail', { length: 150 }).notNull(),
		product: text('product', { length: 100 }).notNull(),
		category: text('category', { length: 50 }).notNull(),
		quantity: integer('quantity').notNull(),
		unitPrice: real('unitPrice').notNull(),
		totalAmount: real('totalAmount').notNull(),
		orderDate: text('orderDate').notNull(),
		region: text('region', { length: 50 }).notNull(),
		country: text('country', { length: 50 }).notNull(),
		status: text('status', { length: 20 }).notNull(),
		paymentMethod: text('paymentMethod', { length: 30 }).notNull(),
		createdAt: integer('createdAt', { mode: 'timestamp' })
			.default(sql`(unixepoch())`)
			.notNull()
	},
	(table) => [
		index('sales_transaction_order_date_idx').on(table.orderDate),
		index('sales_transaction_region_idx').on(table.region),
		index('sales_transaction_status_idx').on(table.status)
	]
);
