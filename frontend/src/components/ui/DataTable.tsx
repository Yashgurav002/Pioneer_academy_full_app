import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title: string;
  action?: ReactNode;
}

export default function DataTable({ columns, data, title, action }: DataTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
        {action}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <th key={col.key} className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-sm text-gray-700 dark:text-gray-200">
                      {row[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
