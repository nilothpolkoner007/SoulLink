import React from 'react';
import { Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
};

/**
 * IconSymbol
 * - Uses Ionicons by default
 * - Falls back to MaterialIcons on web if needed
 * - Accepts SF-style names like "house.fill"
 */
export function IconSymbol({ name, size = 24, color = '#222' }: IconSymbolProps) {
  // Convert SF Symbol style names to Ionicons equivalents
  const mapName = (n: string) => {
    const mapping: Record<string, string> = {
      'house.fill': 'home',
      'paperplane.fill': 'paper-plane',
      'heart.fill': 'heart',
      'person.circle.fill': 'person-circle',
      'bubble.left.and.bubble.right.fill': 'chatbubbles',
      'gearshape.fill': 'settings',
      calendar: 'calendar',
      'creditcard.fill': 'card',
      'heart.slash.fill': 'heart-dislike',
      'bell.fill': 'notifications',
      'gift.fill': 'gift',
      ellipsis: 'ellipsis-horizontal',
    };

    return mapping[n] ?? n;
  };

  const iconName = mapName(name) as any;

  // Web sometimes prefers MaterialIcons
  if (Platform.OS === 'web') {
    return <MaterialIcons name={iconName} size={size} color={color} />;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}
