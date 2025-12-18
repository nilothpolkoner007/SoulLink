import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // use a heart animation file

export default function TwoHeartsConnecting({ route, navigation }: any) {
  const { partnerId } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainApp'); // navigate into main tabs
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* <LottieView
        source={require('@/assets/Gif/twoheart.mp4')} // Changed 'twoheaart.mp4' to 'twohearts.mp4'
        autoPlay
        loop={false}
        style={{ width: 300, height: 300 }}
      /> */}
      <Text style={styles.text}>SoulLink Established ❤️‍🔥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '700',
  },
});
