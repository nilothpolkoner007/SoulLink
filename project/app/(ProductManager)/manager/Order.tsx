import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

interface Order {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    customer: 'Rafi',
    items: 3,
    amount: 1250,
    status: 'pending',
    date: '2025-12-07',
  },
  {
    id: 'ORD-1002',
    customer: 'Maya',
    items: 1,
    amount: 540,
    status: 'delivered',
    date: '2025-12-06',
  },
  {
    id: 'ORD-1003',
    customer: 'Salma',
    items: 5,
    amount: 3200,
    status: 'shipped',
    date: '2025-12-05',
  },
  {
    id: 'ORD-1004',
    customer: 'Jamal',
    items: 2,
    amount: 760,
    status: 'cancelled',
    date: '2025-12-04',
  },
  {
    id: 'ORD-1005',
    customer: 'Nadia',
    items: 4,
    amount: 1999,
    status: 'pending',
    date: '2025-12-03',
  },
];

const statuses: string[] = ['all', 'pending', 'shipped', 'delivered', 'cancelled'];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => (filter === 'all' ? true : o.status === filter))
      .filter((o) => !q || `${o.id} ${o.customer}`.toLowerCase().includes(q));
  }, [orders, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleCancel = (id: string) => {
    updateStatus(id, 'cancelled');
  };

  const handleMarkDelivered = (id: string) => {
    updateStatus(id, 'delivered');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSub}>Manage orders — search, filter and update status.</Text>
      </View>

      <View style={styles.card}>
        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.leftControls}>
            <TextInput
              placeholder='Search order id or customer...'
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                setPage(1);
              }}
              style={styles.input}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterBtn, filter === s && styles.filterActive]}
                  onPress={() => {
                    setFilter(s);
                    setPage(1);
                  }}
                >
                  <Text style={[styles.filterText, filter === s && styles.filterTextActive]}>
                    {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Text style={styles.summary}>Showing {filtered.length} orders</Text>
        </View>

        {/* Orders List */}
        <ScrollView horizontal>
          <View style={{ minWidth: 800 }}>
            {pageItems.length === 0 ? (
              <Text style={styles.empty}>No orders found</Text>
            ) : (
              pageItems.map((o) => (
                <View key={o.id} style={styles.row}>
                  <Text style={[styles.cell, styles.mono]}>{o.id}</Text>
                  <Text style={styles.cell}>{o.customer}</Text>
                  <Text style={styles.cell}>{o.items}</Text>
                  <Text style={styles.cell}>₹{o.amount.toLocaleString()}</Text>
                  <View style={[styles.badge, statusStyles[o.status]]}>
                    <Text style={styles.badgeText}>{o.status}</Text>
                  </View>
                  <Text style={styles.cell}>{o.date}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => alert(JSON.stringify(o, null, 2))}
                    >
                      <Text style={styles.btnText}>View</Text>
                    </TouchableOpacity>
                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                      <>
                        <TouchableOpacity
                          style={[styles.btn, styles.btnPrimary]}
                          onPress={() => handleMarkDelivered(o.id)}
                        >
                          <Text style={styles.btnText}>Mark Delivered</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btn, styles.btnGhost]}
                          onPress={() => handleCancel(o.id)}
                        >
                          <Text style={[styles.btnText, { color: '#6B7280' }]}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Pager */}
        <View style={styles.pager}>
          <Text>
            Page {page} / {totalPages}
          </Text>
          <View style={styles.pagerControls}>
            <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))} style={styles.btn}>
              <Text style={styles.btnText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const statusStyles = StyleSheet.create({
  pending: { backgroundColor: '#FEF3C7', borderColor: '#92400E' },
  shipped: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  delivered: { backgroundColor: '#DCFCE7', borderColor: '#065F46' },
  cancelled: { backgroundColor: '#FEE2E2', borderColor: '#9A1C1C' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 6 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftControls: { flex: 1, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E9EE',
  },
  filterActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterText: { color: '#6B7280', fontSize: 12 },
  filterTextActive: { color: '#fff' },

  summary: { color: '#6B7280', fontWeight: '600' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  cell: { width: 100, fontSize: 14, paddingHorizontal: 6 },
  mono: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginHorizontal: 6 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E6E9EE',
    marginHorizontal: 2,
  },
  btnPrimary: { backgroundColor: '#3B82F6' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E6E9EE' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  pager: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pagerControls: { flexDirection: 'row', gap: 6 },

  empty: { padding: 12, textAlign: 'center', color: '#6B7280' },
});

export default Orders;
