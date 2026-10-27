/**
 * Page: ProductsPage
 * Purpose: Product catalogue management (search, filter, add, edit, archive)
 * Owner: Member 1
 * Section: Products
 */

import React from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductImport from './components/ProductImport';

export default function ProductsPage() {
  return (
    <div className="page-container">
      <h2>Product Catalogue</h2>
      <ProductForm />
      <ProductImport />
      <ProductList />
    </div>
  );
}
