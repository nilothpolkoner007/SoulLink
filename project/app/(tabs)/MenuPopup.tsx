import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/icon-symbol'; 

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function MenuPopup({ visible, onClose }: Props) {
  const router = useRouter();

  if (!visible) return null;

  const go = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>
        <MenuItem icon='gearshape.fill' label='Settings' onPress={() => go('/settings')} />
        <MenuItem icon='person.fill' label='Personal Profile' onPress={() => go('/profile')} />
        <MenuItem icon='calendar' label='Relationship Calendar' onPress={() => go('/calendar')} />
        <MenuItem icon='creditcard.fill' label='Transactions' onPress={() => go('/transactions')} />
        <MenuItem icon='heart.slash.fill' label='Breakup' danger onPress={() => go('/breakup')} />
      </View>
    </Pressable>
  );
}

function MenuItem({
  label,
  onPress,
  danger,
  icon,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  icon: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <IconSymbol name={icon} size={18} color={danger ? '#d93737' : '#222'} />
      <Text style={[styles.text, danger && styles.danger]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 14,
    zIndex: 999,
  },
  menu: {
    width: 230,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 8,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 15,
    color: '#222',
  },
  danger: {
    color: '#d93737',
    fontWeight: '600',
  },
});
