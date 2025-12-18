import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import SideMenu from './SideMenu';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MainTabs' component={BottomTabs} />
      <Stack.Screen name='SideMenu' component={SideMenu} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
