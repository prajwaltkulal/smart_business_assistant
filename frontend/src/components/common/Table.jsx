/**
 * Component: Table
 * Purpose: Reusable tabular data presentation component
 * Owner: Shared
 */

import React from 'react';

export default function Table({ columns = [], data = [] }) {
  return (
    <table className="common-table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center' }}>No records found</td>
          </tr>
        ) : (
          data.map((row, rIdx) => (
            <tr key={rIdx}>
              {columns.map((col, cIdx) => (
                <td key={cIdx}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
