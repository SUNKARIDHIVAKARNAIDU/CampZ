import { useState } from 'react';

const Table = ({ columns, data, onRowClick }) => {
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const sortedData = [...data].sort((a, b) => {
if (!sortConfig.key) return 0;
const order = sortConfig.direction === 'asc' ? 1 : -1;
return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
});

return (
<table className="w-full border-collapse bg-white shadow rounded">
<thead>
<tr>
{columns.map((col) => (
<th
key={col.key}
className="p-2 border-b cursor-pointer"
onClick={() => setSortConfig({ key: col.key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
aria-sort={sortConfig.key === col.key ? sortConfig.direction : 'none'}
>
{col.label}
</th>
))}
</tr>
</thead>
<tbody>
{sortedData.map((row) => (
<tr
key={row.id}
className="hover:bg-gray-100 cursor-pointer"
onClick={() => onRowClick?.(row)}
tabIndex={0}
onKeyPress={(e) => e.key === 'Enter' && onRowClick?.(row)}
>
{columns.map((col) => (
<td key={col.key} className="p-2 border-b">
{col.render ? col.render(row) : row[col.key]}
</td>
))}
</tr>
))}
</tbody>
</table>
);
};

export default Table;