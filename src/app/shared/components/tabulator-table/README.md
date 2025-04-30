# Tabulator Table Component

An Angular component that wraps the Tabulator library, providing a flexible and customizable table solution.

## Features

- **Customizable Columns**: Define columns with various formatters, alignments, and styling
- **Data Binding**: Pass data directly to the component
- **Flexible Height**: Adjust the table height based on your needs
- **Advanced Formatting**: Support for built-in and custom formatters
- **Vertical Alignment**: Control vertical alignment of cell content
- **Header Sorting Control**: Enable or disable sorting for each column
- **Interactive Elements**: Add clickable elements within cells

## Usage

### Basic Usage

Add the component to your template with the required inputs:

```html
<app-tabulator-table 
  [data]="yourDataArray" 
  [columns]="yourColumnsDefinition"
  [height]="300">
</app-tabulator-table>
```

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `any[]` | `[]` | Array of objects to display in the table |
| `columns` | `ColumnDefinition[]` | `[]` | Array of column definitions |
| `height` | `number` | `140` | Height of the table in pixels |

## Column Definition Examples

### Basic Column

```typescript
{
  title: "Column Title",
  field: "propertyName",
  headerSort: false  // Disable sorting
}
```

### Column with Vertical Alignment

```typescript
{
  title: "Column Title",
  field: "propertyName",
  vertAlign: "middle",  // Options: "top", "middle", "bottom"
  headerSort: false
}
```

### Column with Custom Formatter

```typescript
{
  title: "Status",
  field: "status.description",
  formatter: (cell: CellComponent) => {
    const value = cell.getValue();
    // Return custom HTML for the cell
    return `<span style="color: white; background-color: green;">${value}</span>`;
  },
  headerSort: false
}
```

### Column with Click Handler

```typescript
{
  title: 'Actions',
  field: 'actions',
  formatter: (cell: CellComponent) => {
    // Return HTML with interactive elements
    return `
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <img src="assets/icon.svg" class="action-icon" data-action="someAction">
      </div>
    `;
  },
  cellClick: (e: any, cell: CellComponent) => {
    // Handle click events on cell elements
    const element = e.target as HTMLElement;
    if (element.classList.contains('action-icon')) {
      const action = element.getAttribute('data-action');
      const row = cell.getRow().getData();
      // Perform action based on clicked element
    }
  },
  headerSort: false
}
```

## Real-World Example (Current Billing Component)

Here's how the component is used in the Current Billing component:

### HTML Template

```html
<div class="table-container" *ngIf="bills">
  <app-tabulator-table [data]="bills" [columns]="columns" [height]="280"></app-tabulator-table>
</div>
```

### Column Definitions

```typescript
columns: ColumnDefinition[] = [
  { 
    title: "Legal Name", 
    field: "legalName",
    headerSort: false,
    vertAlign: "middle"
  },
  { 
    title: "Year", 
    field: "year",
    headerSort: false
  },
  { 
    title: "Month", 
    field: "month", 
    formatter: (cell: CellComponent) => {
      const value = cell.getValue();
      return this.monthAbbrPipe.transform(value);
    },
    headerSort: false
  },
  { 
    title: "Status", 
    field: "status.description", 
    formatter: (cell: CellComponent) => {
      const row = cell.getRow().getData();
      const statusId = row['status']?.id;
      const statusDescription = row['status']?.description || 'Unknown';
      
      // Define colors for different status IDs
      const statusColors: {[key: string]: {bg: string, text: string}} = {
        "PYD": { bg: "#33A02C", text: "white" },
        "OVD": { bg: "#E31A1C", text: "white" },
        "PDG": { bg: "#E5B83E", text: "white" }
      };
      
      // Get colors for this status ID (or use defaults)    
      const colors = (statusId && statusColors[statusId]) 
        ? statusColors[statusId] 
        : { bg: "#E0E0E0", text: "black" };
      
      // Create a span with the specified styling
      return `<span style="
        color: ${colors.text}; 
        background-color: ${colors.bg}; 
        border-radius: 16px; 
        padding: 4px 12px; 
        font-weight: 500;
        display: flex;
        align-items:center;
        justify-content:center;
        width: 95px;
        height: 35px
      ">${statusDescription}</span>`;
    },
    headerSort: false
  },
  // Additional columns omitted for brevity
];
```

### Data Structure

The component expects data in the following format for the Current Billing example:

```typescript
[
  {
    "billingId": "1",
    "legalName": "Company Name",
    "year": 2025,
    "month": 4,
    "status": {
      "id": "PYD",
      "description": "Paid in full"
    },
    "product": "Product Name",
    "amount": 1500
  },
  // More items...
]
```

## Advanced Features

### Complex Object Properties

You can access nested properties using dot notation in the `field` property:

```typescript
{
  title: "Status",
  field: "status.description"  // Accesses the description property of the status object
}
```

### Custom Styling

You can return custom HTML from formatter functions to apply specific styling to cell content:

```typescript
formatter: (cell: CellComponent) => {
  return `<span style="custom-styles-here">${value}</span>`;
}
```

### Row Data Access

Within a formatter or cellClick function, you can access the entire row data:

```typescript
formatter: (cell: CellComponent) => {
  const row = cell.getRow().getData();
  // Use row data to determine formatting
}
```

### Interactive Elements

You can add interactive elements like buttons or icons with data attributes:

```typescript
formatter: (cell: CellComponent) => {
  return `<img src="icon.svg" data-action="someAction">`;
}
```

And handle clicks on these elements:

```typescript
cellClick: (e: any, cell: CellComponent) => {
  const action = e.target.getAttribute('data-action');
  // Handle the action
}
```
