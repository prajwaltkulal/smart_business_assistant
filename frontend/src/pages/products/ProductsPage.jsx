/**
 * Page: ProductsPage
 * Purpose: Master product catalog management (listing, live search, categories, add & edit modals)
 * Owner: Member 1 (Prajwal)
 * Section: Products
 */

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { productsApi } from '../../api/productsApi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productsApi.getAll({ search, category });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await productsApi.update(editingProduct.id, productData);
      setNotification('Product updated successfully!');
    } else {
      await productsApi.create(productData);
      setNotification('Product added successfully to catalog!');
    }
    fetchProducts();
    fetchCategories();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        setNotification('Product deleted.');
        fetchProducts();
        setTimeout(() => setNotification(null), 3000);
      } catch (err) {
        alert(err.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1a202c' }}>Product Catalog</h2>
          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
            Manage master product details, purchase costs, selling prices, and reorder levels.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          + Add Product
        </button>
      </div>

      {notification && (
        <div style={{
          backgroundColor: '#c6f6d5',
          color: '#22543d',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontWeight: '500'
        }}>
          {notification}
        </div>
      )}

      <ProductList
        products={products}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
      />
    </div>
  );
}
