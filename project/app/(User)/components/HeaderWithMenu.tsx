import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HeaderWithMenu({ title }: { title: string }) {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{title}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('SideMenu')}>
        <Text style={{ fontSize: 24 }}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}
