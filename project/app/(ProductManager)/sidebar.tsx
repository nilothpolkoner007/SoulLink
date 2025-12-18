import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Package, MessageSquare, ShoppingCart, ClipboardList, Menu, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// ----------------------
// Types
// ----------------------

interface MenuItem {
  id: number;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  path: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigation = useNavigation<any>();

  const menuItems: MenuItem[] = [
    { id: 1, label: 'Add Product', icon: Package, path: 'AddProduct' },
    { id: 2, label: 'Negotiations', icon: MessageSquare, path: 'Negotiations' },
    { id: 3, label: 'Orders', icon: ShoppingCart, path: 'Orders' },
    { id: 4, label: 'Manage Product', icon: ClipboardList, path: 'ManageProduct' },
  ];

  return (
    <View style={[styles.sidebar, isOpen ? styles.open : styles.closed]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>📦</Text>
          {isOpen && <Text style={styles.logoText}>ShopHub</Text>}
        </View>

        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </TouchableOpacity>
      </View>

      {/* Nav Items */}
      <View style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.path)}
            >
              <Icon size={22} color='#000' />

              {isOpen && <Text style={styles.navLabel}>{item.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      {isOpen && (
        <View style={styles.footer}>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      )}
    </View>
  );
};

export default Sidebar;

// ----------------------
// Styles
// ----------------------

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#fff',
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#e3e3e3',
    paddingTop: 20,
    paddingBottom: 20,
  },

  open: {
    width: 240,
  },

  closed: {
    width: 70,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoIcon: {
    fontSize: 28,
  },

  logoText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: '600',
  },

  nav: {
    marginTop: 10,
    paddingHorizontal: 10,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },

  navLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },

  footer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
  },

  version: {
    fontSize: 14,
    color: 'gray',
  },
});
