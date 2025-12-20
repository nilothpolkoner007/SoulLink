import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        router.replace('(tabs)/index');
      } else {
        router.replace('(login)/login');
      }
    }

    checkLogin();
  }, []);
}
