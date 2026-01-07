<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ModuleRegistry,
		AllCommunityModule,
		createGrid,
		themeQuartz,
		type GridApi,
		type GridOptions,
		type ColDef
	} from 'ag-grid-community';
	import './ag-grid-theme-pico.css';

	// Register AG Grid modules once
	ModuleRegistry.registerModules([AllCommunityModule]);

	interface Props {
		rowData: any[];
		columnDefs: ColDef[];
		gridOptions?: Partial<GridOptions>;
		height?: string;
		onGridReady?: (api: GridApi) => void;
	}

	let { rowData, columnDefs, gridOptions = {}, height = '600px', onGridReady }: Props = $props();

	let gridContainer: HTMLDivElement;
	let gridApi: GridApi | null = null;
	let isDark = $state(false);

	// Customize the Quartz theme with CSS variable references
	const customTheme = themeQuartz.withParams({
		backgroundColor: 'var(--grid-bg)',
		foregroundColor: 'var(--grid-fg)',
		borderColor: 'var(--grid-border)',
		headerBackgroundColor: 'var(--grid-header-bg)',
		headerTextColor: 'var(--grid-header-fg)',
		rowHoverColor: 'var(--grid-row-hover)',
		selectedRowBackgroundColor: 'var(--grid-row-selected)',
		accentColor: 'var(--grid-accent)'
	});

	const defaultGridOptions: GridOptions = {
		defaultColDef: {
			flex: 1,
			minWidth: 100,
			resizable: true,
			filter: true,
			sortable: true
		},
		animateRows: true
	};

	onMount(() => {
		// Check system preference
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		isDark = mediaQuery.matches;

		if (gridContainer) {
			gridApi = createGrid(gridContainer, {
				...defaultGridOptions,
				...gridOptions,
				theme: customTheme,
				columnDefs,
				rowData
			});

			if (onGridReady && gridApi) {
				onGridReady(gridApi);
			}
		}

		// Listen for theme changes
		const handleThemeChange = (e: MediaQueryListEvent) => {
			isDark = e.matches;
		};
		mediaQuery.addEventListener('change', handleThemeChange);

		return () => {
			mediaQuery.removeEventListener('change', handleThemeChange);
			gridApi?.destroy();
		};
	});

	// Update row data when it changes
	$effect(() => {
		if (gridApi && rowData) {
			gridApi.setGridOption('rowData', rowData);
		}
	});

	// Update column definitions when they change
	$effect(() => {
		if (gridApi && columnDefs) {
			gridApi.setGridOption('columnDefs', columnDefs);
		}
	});
</script>

<div bind:this={gridContainer} class:ag-grid-dark={isDark} style:height></div>
