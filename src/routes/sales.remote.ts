import { query } from '$app/server';
import { object, optional, number } from 'valibot';
import { db } from '$lib/server/db';
import { salesTransaction } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const getSalesData = query(
	object({
		limit: optional(number()),
		offset: optional(number())
	}),
	async ({ limit = 1000, offset = 0 }) => {
		const data = await db
			.select()
			.from(salesTransaction)
			.orderBy(desc(salesTransaction.orderDate))
			.limit(limit)
			.offset(offset);

		return data;
	}
);
