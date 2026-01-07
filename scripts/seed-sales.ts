import { drizzle } from 'drizzle-orm/bun-sql';
import { salesTransaction } from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('DATABASE_URL environment variable is required');
	process.exit(1);
}

const db = drizzle(DATABASE_URL);

const customers = [
	{ name: 'John Smith', email: 'john.smith@email.com' },
	{ name: 'Emma Johnson', email: 'emma.johnson@email.com' },
	{ name: 'Michael Brown', email: 'michael.brown@email.com' },
	{ name: 'Sarah Davis', email: 'sarah.davis@email.com' },
	{ name: 'James Wilson', email: 'james.wilson@email.com' },
	{ name: 'Emily Taylor', email: 'emily.taylor@email.com' },
	{ name: 'Daniel Martinez', email: 'daniel.martinez@email.com' },
	{ name: 'Olivia Anderson', email: 'olivia.anderson@email.com' },
	{ name: 'William Thomas', email: 'william.thomas@email.com' },
	{ name: 'Sophia Garcia', email: 'sophia.garcia@email.com' },
	{ name: 'Alexander Lee', email: 'alex.lee@email.com' },
	{ name: 'Isabella White', email: 'isabella.white@email.com' },
	{ name: 'Benjamin Harris', email: 'ben.harris@email.com' },
	{ name: 'Mia Clark', email: 'mia.clark@email.com' },
	{ name: 'Lucas Robinson', email: 'lucas.robinson@email.com' }
];

const products = [
	{ name: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99 },
	{ name: 'Wireless Mouse', category: 'Electronics', price: 49.99 },
	{ name: 'Mechanical Keyboard', category: 'Electronics', price: 159.99 },
	{ name: 'USB-C Hub', category: 'Electronics', price: 79.99 },
	{ name: '4K Monitor 27"', category: 'Electronics', price: 549.99 },
	{ name: 'Webcam HD', category: 'Electronics', price: 89.99 },
	{ name: 'Office Chair', category: 'Furniture', price: 299.99 },
	{ name: 'Standing Desk', category: 'Furniture', price: 599.99 },
	{ name: 'Desk Lamp', category: 'Furniture', price: 45.99 },
	{ name: 'Monitor Stand', category: 'Furniture', price: 35.99 },
	{ name: 'Notebook Pack', category: 'Office Supplies', price: 12.99 },
	{ name: 'Pen Set', category: 'Office Supplies', price: 8.99 },
	{ name: 'Sticky Notes', category: 'Office Supplies', price: 5.99 },
	{ name: 'Printer Paper', category: 'Office Supplies', price: 24.99 },
	{ name: 'Headphones', category: 'Audio', price: 199.99 },
	{ name: 'Bluetooth Speaker', category: 'Audio', price: 129.99 },
	{ name: 'Microphone', category: 'Audio', price: 149.99 },
	{ name: 'Software License', category: 'Software', price: 299.99 },
	{ name: 'Cloud Storage 1TB', category: 'Software', price: 99.99 },
	{ name: 'Antivirus Suite', category: 'Software', price: 59.99 }
];

const regions = [
	{ region: 'North America', countries: ['USA', 'Canada', 'Mexico'] },
	{ region: 'Europe', countries: ['UK', 'Germany', 'France', 'Spain', 'Italy'] },
	{ region: 'Asia Pacific', countries: ['Japan', 'Australia', 'Singapore', 'South Korea'] },
	{ region: 'Latin America', countries: ['Brazil', 'Argentina', 'Chile'] }
];

const statuses = ['Completed', 'Pending', 'Shipped', 'Processing', 'Cancelled'];
const paymentMethods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Wire Transfer'];

function randomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrderId(index: number): string {
	const prefix = 'ORD';
	const year = '2024';
	return `${prefix}-${year}-${String(index).padStart(6, '0')}`;
}

function generateRandomDate(): string {
	const start = new Date('2024-01-01');
	const end = new Date('2024-12-31');
	const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return date.toISOString().split('T')[0];
}

async function seed() {
	console.log('Seeding 1000 sales transactions...');

	const transactions = [];

	for (let i = 1; i <= 1000; i++) {
		const customer = randomElement(customers);
		const product = randomElement(products);
		const regionData = randomElement(regions);
		const quantity = randomInt(1, 10);
		const unitPrice = product.price;
		const totalAmount = (quantity * unitPrice).toFixed(2);

		transactions.push({
			orderId: generateOrderId(i),
			customerName: customer.name,
			customerEmail: customer.email,
			product: product.name,
			category: product.category,
			quantity,
			unitPrice: unitPrice.toFixed(2),
			totalAmount,
			orderDate: generateRandomDate(),
			region: regionData.region,
			country: randomElement(regionData.countries),
			status: randomElement(statuses),
			paymentMethod: randomElement(paymentMethods)
		});
	}

	// Insert in batches of 100
	for (let i = 0; i < transactions.length; i += 100) {
		const batch = transactions.slice(i, i + 100);
		await db.insert(salesTransaction).values(batch);
		console.log(`Inserted ${Math.min(i + 100, transactions.length)} / 1000 records`);
	}

	console.log('Seeding complete!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('Seeding failed:', err);
	process.exit(1);
});
