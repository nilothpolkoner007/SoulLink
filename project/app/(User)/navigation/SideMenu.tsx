import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SideMenu() {
  const navigation = useNavigation<any>();

  const Item = ({ label, screen }: any) => (
    <TouchableOpacity style={{ padding: 16 }} onPress={() => navigation.navigate(screen)}>
      <Text style={{ fontSize: 18 }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Item label='⚙️ Settings' screen='Settings' />
      <Item label='👤 Advanced Profile' screen='AdvancedProfile' />
      <Item label='📅 Relationship Calendar' screen='RelationshipCalendar' />
      <Item label='💰 Transactions' screen='Transactions' />
      <Item label='💔 Breakup' screen='Breakup' />
    </View>
  );
}
