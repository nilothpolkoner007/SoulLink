import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MenuPopup from'./MenuPopup'; // we'll create this

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* Top bar with logo + 3-dot menu */}
      <View style={styles.topBar}>
        <IconSymbol name='heart.circle.fill' size={35} color='#FF2E82' />
        <MenuPopup />
      </View>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name='chat'
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => (
              <IconSymbol name='bubble.left.and.bubble.right.fill' size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='memory'
          options={{
            title: 'Memories',
            tabBarIcon: ({ color }) => <IconSymbol name='photo.fill' size={28} color={color} />,
          }}
        />

        <Tabs.Screen
          name='gift'
          options={{
            title: 'Gift',
            tabBarIcon: ({ color }) => <IconSymbol name='gift.fill' size={28} color={color} />,
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <IconSymbol name='person.circle.fill' size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
});
