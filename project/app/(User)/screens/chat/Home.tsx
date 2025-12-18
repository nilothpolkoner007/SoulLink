import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  // Dimensions is unused, so we remove the import.
  // Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// ChatScreen is only used by the router, not here. We remove the import.
// import ChatScreen from './ChatScreen';

// Dimensions is unused. We remove the declaration.
// const { width, height } = Dimensions.get('window');

const Home = () => {
  // Assuming navigation is correctly set up in a router file
  const navigation = useNavigation<any>();

  // Fade + scale animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 1. Animate the 'SoulLink' card into view
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4, // Controls the bounciness
        tension: 40, // Controls the speed
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Redirect to ChatScreen after the animation completes and holds
    const timer = setTimeout(() => {
      // FIX: Ensure 'ChatScreen' is the correct name used in your navigator setup
      navigation.replace('ChatScreen');
    }, 2500);

    // Cleanup function for when the component unmounts
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    // NOTE: Gradient Background Fix
    // We use a solid color here. For a gradient, you must install
    // 'react-native-linear-gradient' and wrap the content with it.
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            // Combine scale with other potential transforms
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.heart}>💖</Text>
        <Text style={styles.title}>SoulLink</Text>
        <Text style={styles.subtitle}>Where two hearts stay connected</Text>
      </Animated.View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // FIX: Removed invalid CSS 'backgroundImage'. Using solid background color.
    // For a gradient, install and use a library like 'react-native-linear-gradient'
    backgroundColor: '#FFDEE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    padding: 40, // Slightly more padding
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', // Slightly less transparent
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  heart: {
    fontSize: 60, // Slightly larger
    marginBottom: 10,
  },
  title: {
    fontSize: 38, // Slightly larger
    fontWeight: '800', // Bolder
    color: '#FF6F91',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12, // More margin
    color: '#555',
    textAlign: 'center',
  },
});
