import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  featured: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'P-1001',
    name: 'Organic Turmeric Powder',
    sku: 'TG-001',
    price: 249,
    stock: 120,
    category: 'Grocery',
    image: '',
    featured: true,
  },
  {
    id: 'P-1002',
    name: 'Stainless Bottle 750ml',
    sku: 'ST-750',
    price: 499,
    stock: 40,
    category: 'Home',
    image: '',
    featured: false,
  },
  {
    id: 'P-1003',
    name: 'Cotton Kurta - M',
    sku: 'CK-001-M',
    price: 899,
    stock: 15,
    category: 'Fashion',
    image: '',
    featured: false,
  },
  {
    id: 'P-1004',
    name: 'Herbal Tea Mix',
    sku: 'HT-035',
    price: 199,
    stock: 200,
    category: 'Grocery',
    image: '',
    featured: true,
  },
];

const ManageProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filterCategory && p.category !== filterCategory) return false;
      if (!q) return true;
      return `${p.name} ${p.sku} ${p.id}`.toLowerCase().includes(q);
    });
  }, [products, query, filterCategory]);

  const remove = (id: string) => {
    Alert.alert('Confirm', 'Delete this product?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => setProducts((prev) => prev.filter((p) => p.id !== id)) },
    ]);
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const saveEdit = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  };

  const startCreate = () => {
    const id = 'P-' + (Math.floor(Math.random() * 9000) + 1000);
    const newProd: Product = {
      id,
      name: 'New product',
      sku: '',
      price: 0,
      stock: 0,
      category: '',
      image: '',
      featured: false,
    };
    setProducts((prev) => [newProd, ...prev]);
    setEditing(id);
  };

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Products</Text>
        <Text style={styles.subtitle}>View, edit, feature or remove products</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.controls}>
          <View style={styles.left}>
            <TextInput
              style={styles.input}
              placeholder='Search name, sku or id...'
              value={query}
              onChangeText={setQuery}
            />
            <TextInput
              style={styles.input}
              placeholder='Filter category'
              value={filterCategory}
              onChangeText={setFilterCategory}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnGhost}
              onPress={() => {
                setQuery('');
                setFilterCategory('');
              }}
            >
              <Text>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={startCreate}>
              <Text style={{ color: '#fff' }}>+ New Product</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filtered.length === 0 && <Text style={styles.empty}>No products found</Text>}

        <View style={styles.grid}>
          {filtered.map((p) => (
            <View key={p.id} style={styles.cardItem}>
              <View style={styles.thumb}>
                {p.image ? (
                  <Image source={{ uri: p.image }} style={styles.thumbImage} />
                ) : (
                  <Text style={styles.thumbText}>{p.name[0]}</Text>
                )}
              </View>

              <View style={styles.info}>
                <View style={styles.top}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.sku}>{p.sku || p.id}</Text>
                </View>

                <View style={styles.meta}>
                  <Text style={styles.price}>₹{p.price}</Text>
                  <Text style={styles.stock}>{p.stock} in stock</Text>
                  <Text style={[styles.featured, !p.featured && styles.featuredOff]}>
                    {p.featured ? 'Featured' : '—'}
                  </Text>
                </View>

                <View style={styles.bottom}>
                  <TouchableOpacity style={styles.btnSmall} onPress={() => setEditing(p.id)}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSmall} onPress={() => toggleFeatured(p.id)}>
                    <Text>{p.featured ? 'Unfeature' : 'Feature'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSmall, styles.btnDanger]}
                    onPress={() => remove(p.id)}
                  >
                    <Text style={{ color: '#fff' }}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {editing === p.id && (
                  <ProductEditor product={p} onSave={saveEdit} onCancel={() => setEditing(null)} />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

interface EditorProps {
  product: Product;
  onSave: (updated: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<EditorProps> = ({ product, onSave, onCancel }) => {
  const [state, setState] = useState<Product>({ ...product });

  return (
    <View style={styles.editOverlay}>
      <View style={styles.editor}>
        {['name', 'sku', 'category'].map((field) => (
          <View key={field} style={styles.editorRow}>
            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
            <TextInput
              style={styles.editorInput}
              value={(state as any)[field]}
              onChangeText={(val) => setState((prev) => ({ ...prev, [field]: val }))}
            />
          </View>
        ))}
        {['price', 'stock'].map((field) => (
          <View key={field} style={styles.editorRow}>
            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
            <TextInput
              style={styles.editorInput}
              value={String((state as any)[field])}
              onChangeText={(val) => setState((prev) => ({ ...prev, [field]: Number(val) }))}
              keyboardType='numeric'
            />
          </View>
        ))}
        <View style={styles.editorActions}>
          <TouchableOpacity style={styles.btnGhost} onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => onSave(state)}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 6 },
  card: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  left: { flexDirection: 'row', flex: 1, gap: 12 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    backgroundColor: '#fff',
  },
  actions: { flexDirection: 'row', gap: 8 },
  btnPrimary: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#E6E9EE',
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDanger: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 16 },
  cardItem: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00000005',
    alignItems: 'stretch',
    marginBottom: 12,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: '#F3F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  thumbText: { fontWeight: '800', fontSize: 20, color: '#2563EB' },
  thumbImage: { width: 96, height: 96, borderRadius: 10 },
  info: { flex: 1, flexDirection: 'column', gap: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  name: { fontWeight: '800', fontSize: 15, color: '#0f172a' },
  sku: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  meta: { flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 },
  price: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  stock: { fontSize: 13, color: '#6B7280' },
  featured: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    color: '#065F46',
  },
  featuredOff: { backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: '600' },
  bottom: { flexDirection: 'row', gap: 8, marginTop: 'auto' },
  btnSmall: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E6E9EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { padding: 22, color: '#6B7280', textAlign: 'center' },
  editOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 10,
    padding: 14,
    zIndex: 12,
  },
  editor: { width: '100%', maxWidth: 620, flexDirection: 'column', gap: 10 },
  editorRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  label: { width: 90, fontWeight: '700', fontSize: 13, color: '#6B7280' },
  editorInput: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    backgroundColor: '#fff',
  },
  editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default ManageProduct;
