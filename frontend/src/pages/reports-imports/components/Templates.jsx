/**
 * Component: Templates
 * Purpose: One-click download standard CSV templates for Initial Inventory and Daily Sales Reports
 * Owner: Member 2
 * Section: Reports & Imports
 */

import React from 'react';

export default function Templates() {
  const downloadTemplate = (type) => {
    let csvContent = '';
    let filename = '';

    if (type === 'sales') {
      csvContent = 'date,bill_id,product_sku,product_name,quantity,selling_price,discount\n' +
                   '2026-11-21,INV-3001,RICE-BAS-5KG,Basmati Rice 5kg,4,430,0\n' +
                   '2026-11-21,INV-3001,DAL-TOOR-1KG,Toor Dal 1kg,3,140,5\n' +
                   '2026-11-21,INV-3002,OIL-SUN-1L,Sunflower Oil 1L,2,165,0\n' +
                   '2026-11-21,INV-3002,ATTA-AASH-5KG,Aashirvaad Atta 5kg,2,260,10\n' +
                   '2026-11-21,INV-3003,SALT-TATA-1KG,Tata Salt 1kg,4,28,0\n' +
                   '2026-11-21,INV-3003,MAGGI-4PK,Maggi Noodles 4-Pack,3,60,0\n';
      filename = 'daily_sales_sample.csv';
    } else {
      csvContent = 'product_name,category,sku,purchase_cost,selling_price,opening_stock,min_stock_level,unit\n' +
                   'Basmati Rice 5kg,Grains & Rice,RICE-BAS-5KG,350,430,50,10,bag\n' +
                   'Toor Dal 1kg,Pulses & Dals,DAL-TOOR-1KG,110,140,40,10,kg\n' +
                   'Sunflower Oil 1L,Oils & Ghee,OIL-SUN-1L,130,165,30,5,bottle\n' +
                   'Aashirvaad Atta 5kg,Flour & Grains,ATTA-AASH-5KG,210,260,35,10,bag\n' +
                   'Tata Salt 1kg,Spices & Salt,SALT-TATA-1KG,20,28,60,15,packet\n' +
                   'Maggi Noodles 4-Pack,Instant Food,MAGGI-4PK,45,60,40,10,packet\n' +
                   'Fortune Mustard Oil 1L,Oils,OIL-MUST-1L,125,160,25,5,bottle\n' +
                   'Good Day Butter Biscuits,Snacks,SNK-GD-BUTTER,25,35,50,15,packet\n';
      filename = 'initial_inventory_sample.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Download Sample CSV Templates</h3>
      <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
        Download ready-to-use CSV template files to test importing into the application.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => downloadTemplate('sales')}
          style={{ backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          📥 Download Sample Daily Sales CSV
        </button>
        <button
          onClick={() => downloadTemplate('inventory')}
          style={{ backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          📥 Download Sample Initial Inventory CSV
        </button>
      </div>
    </div>
  );
}
