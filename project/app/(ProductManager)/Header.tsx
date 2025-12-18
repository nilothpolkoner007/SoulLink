import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, LogOut, User } from 'lucide-react-native';

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState<number>(3);

  const notifications = [
    { id: 1, message: 'New order received', time: '2 min ago' },
    { id: 2, message: 'Product out of stock', time: '15 min ago' },
    { id: 3, message: 'New negotiation request', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <View style={styles.headerContainer}>
      {/* LEFT - Manager Panel */}
      <View style={styles.headerLeft}>
        <Text style={styles.managerTitle}>👤 Manager Panel</Text>
      </View>

      {/* RIGHT ICONS */}
      <View style={styles.headerRight}>
        {/* Notification */}
        <View style={styles.notificationWrapper}>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} color='#6B7280' />

            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Dropdown */}
          {showNotifications && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownHeader}>Notifications</Text>

              {notifications.map((notif) => (
                <View key={notif.id} style={styles.notificationItem}>
                  <Text style={styles.notificationMessage}>{notif.message}</Text>
                  <Text style={styles.notificationTime}>{notif.time}</Text>
                </View>
              ))}

              <TouchableOpacity>
                <Text style={styles.viewAll}>View All Notifications</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* User Profile */}
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <User size={20} color='white' />
          </View>
          <View>
            <Text style={styles.profileName}>John Manager</Text>
            <Text style={styles.profileRole}>Admin</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={22} color='#EF4444' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },

  headerLeft: {
    flex: 1,
  },

  managerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  /* Notifications */
  notificationWrapper: {
    position: 'relative',
  },

  notificationBtn: {
    padding: 8,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },

  dropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 260,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 6,
    zIndex: 100,
  },

  dropdownHeader: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },

  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  notificationMessage: {
    fontSize: 13,
    color: '#111827',
  },

  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  viewAll: {
    textAlign: 'center',
    color: '#3B82F6',
    marginTop: 10,
    fontWeight: '600',
  },

  /* User Profile */
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F0F9FF',
  },

  avatar: {
    width: 36,
    height: 36,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileName: {
    fontSize: 13,
    fontWeight: '600',
  },

  profileRole: {
    fontSize: 11,
    color: '#6B7280',
  },

  /* Logout */
  logoutBtn: {
    padding: 8,
  },
});
