import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

type StatItem = {
  id: number;
  title: string;
  value: number;
  color: string;
  icon: string;
};

type SalesData = {
  date: string;
  iso: string;
  sales: number;
};

type Order = {
  id: string;
  customer: string;
  time: Date;
  amount: number;
  status: 'Pending' | 'Delivered';
};

const Dashboard: React.FC = () => {
  const stats: StatItem[] = [
    { id: 1, title: 'Total Orders', value: 1280, color: '#3B82F6', icon: '📦' },
    { id: 2, title: 'Pending Orders', value: 72, color: '#F59E0B', icon: '⏳' },
    { id: 3, title: 'Delivered', value: 1198, color: '#10B981', icon: '✅' },
    { id: 4, title: 'Total Earning', value: 84250, color: '#EF4444', icon: '₹' },
  ];

  const getLast7Days = (): SalesData[] => {
    const out: SalesData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({
        date: d.toLocaleDateString(undefined, { weekday: 'short' }),
        iso: d.toISOString().split('T')[0],
        sales: Math.floor(200 + Math.random() * 1200),
      });
    }
    return out;
  };

  const salesData = getLast7Days();
  const maxSales = Math.max(...salesData.map((d) => d.sales));
  const chartHeight = 180;

  const recentOrders: Order[] = [
    { id: 'ORD-1001', customer: 'Rafi', time: new Date(), amount: 1250, status: 'Delivered' },
    {
      id: 'ORD-1002',
      customer: 'Maya',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      amount: 540,
      status: 'Pending',
    },
    {
      id: 'ORD-1003',
      customer: 'Salma',
      time: new Date(Date.now() - 1000 * 60 * 60 * 8),
      amount: 3200,
      status: 'Delivered',
    },
    {
      id: 'ORD-1004',
      customer: 'Jamal',
      time: new Date(Date.now() - 1000 * 60 * 30),
      amount: 760,
      status: 'Pending',
    },
  ];

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Manager Dashboard</Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.id} style={[styles.statCard, { borderLeftColor: s.color }]}>
            <Text style={[styles.statIcon, { backgroundColor: s.color + '20', color: s.color }]}>
              {s.icon}
            </Text>
            <View>
              <Text style={styles.statTitle}>{s.title}</Text>
              <Text style={styles.statValue}>
                {s.id === 4 ? '₹' : ''}
                {s.value.toLocaleString()}
              </Text>
              <Text style={[styles.statTrend, { color: s.color }]}>↑ 12%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Sales Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Sales Chart</Text>
        <Text style={styles.cardSubtitle}>Last 7 days performance</Text>

        {/* SVG Chart */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={salesData.length * 60} height={chartHeight}>
            <Defs>
              <LinearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                <Stop offset='0%' stopColor='#3B82F6' stopOpacity={1} />
                <Stop offset='100%' stopColor='#60A5FA' stopOpacity={0.6} />
              </LinearGradient>
            </Defs>

            {salesData.map((d, i) => {
              const barHeight = (d.sales / maxSales) * (chartHeight - 40);
              return (
                <>
                  <Rect
                    key={d.iso}
                    x={i * 50 + 20}
                    y={chartHeight - barHeight - 20}
                    width={30}
                    height={barHeight}
                    fill='url(#grad)'
                    rx={6}
                  />
                  <SvgText
                    x={i * 50 + 35}
                    y={chartHeight - 5}
                    fontSize='12'
                    fill='#555'
                    textAnchor='middle'
                  >
                    {d.date}
                  </SvgText>
                </>
              );
            })}
          </Svg>
        </ScrollView>
      </View>

      {/* Recent Orders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Recent Orders</Text>
        <Text style={styles.cardSubtitle}>Latest transactions</Text>

        {recentOrders.map((o) => (
          <View key={o.id} style={styles.orderRow}>
            <View>
              <Text style={styles.orderId}>{o.id}</Text>
              <Text style={styles.orderCustomer}>{o.customer}</Text>
            </View>

            <View>
              <Text style={styles.orderAmount}>₹{o.amount.toLocaleString()}</Text>
              <Text style={styles.orderTime}>{formatTime(o.time)}</Text>
            </View>

            <Text
              style={[
                styles.orderStatus,
                o.status === 'Pending' ? styles.pending : styles.delivered,
              ]}
            >
              {o.status}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
export default Dashboard;

// ---------------------- 
// Styles
// ----------------------


export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB', // fallback for linear-gradient
    padding: 24,
  },

  managerDashboard: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },

  // Header
  dashboardHeader: {
    marginBottom: 28,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 0,
  },

  // Stats
  statsContainer: {
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // gap works in React Native >=0.70
  },
  statCard: {
    flexBasis: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#3B82F6', // default, override dynamically
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  statInfo: {
    flex: 1,
    minWidth: 0,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statTrend: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Dashboard Content
  dashboardContent: {
    flexDirection: 'row',
    gap: 20,
  },

  salesCard: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },
  ordersCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  cardBadge: {
    backgroundColor: '#DBEAFE',
    color: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
  },
  cardBadgeLive: {
    backgroundColor: '#DCFCE7',
    color: '#10B981',
  },

  // Orders
  ordersContainer: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 12,
  },
  orderLeft: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderCenter: {
    minWidth: 100,
    textAlign: 'right',
  },
  orderAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  orderRight: {},
  orderStatus: {
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  delivered: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
});
