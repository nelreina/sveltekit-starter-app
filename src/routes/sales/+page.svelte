<script lang="ts">
	import AgGrid from '$lib/components/AgGrid.svelte';
	import type { ColDef } from 'ag-grid-community';
	import { getSalesData } from '../sales.remote';

	let data = $state([]);
	let loading = $state(true);

	const columnDefs: ColDef[] = [
		{ field: 'orderId', headerName: 'Order ID' },
		{ field: 'customerName', headerName: 'Customer' },
		{ field: 'customerEmail', headerName: 'Email' },
		{ field: 'product', headerName: 'Product' },
		{ field: 'category', headerName: 'Category' },
		{ field: 'quantity', headerName: 'Qty', filter: 'agNumberColumnFilter', width: 80 },
		{
			field: 'unitPrice',
			headerName: 'Unit Price',
			filter: 'agNumberColumnFilter',
			valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`
		},
		{
			field: 'totalAmount',
			headerName: 'Total',
			filter: 'agNumberColumnFilter',
			valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`
		},
		{ field: 'orderDate', headerName: 'Date', filter: 'agDateColumnFilter' },
		{ field: 'region', headerName: 'Region' },
		{ field: 'country', headerName: 'Country' },
		{
			field: 'status',
			headerName: 'Status',
			cellStyle: (params) => {
				const statusColors: Record<string, string> = {
					Completed: '#22c55e',
					Pending: '#eab308',
					Shipped: '#3b82f6',
					Processing: '#8b5cf6',
					Cancelled: '#ef4444'
				};
				return { color: statusColors[params.value] || '#000' };
			}
		},
		{ field: 'paymentMethod', headerName: 'Payment' }
	];

	$effect(() => {
		getSalesData({}).then((result) => {
			data = result;
			loading = false;
		});
	});
</script>

<svelte:head>
	<title>Sales Transactions - AG Grid</title>
</svelte:head>

<div class="container">
	<h1>Sales Transactions {data.length}</h1>
	<p class="subtitle">Displaying 1000 records with AG Grid</p>

	{#if loading}
		<div class="loading">Loading sales data...</div>
	{:else}
		<AgGrid rowData={data} {columnDefs} />
	{/if}
</div>

<style>
	.container {
		padding: 1rem;
		max-width: 100%;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 1rem;
	}

	.loading {
		padding: 2rem;
		text-align: center;
		color: #666;
	}
</style>
