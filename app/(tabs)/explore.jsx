import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
 
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';

export default function TabTwoScreen() {
  
  const handleTest = () => {
    console.log('Test button pressed');
  
    const url = 'http://192.168.1.161:3000/api/collection/tasks';
  
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'TaskN', id: 25, completed: false, aura: 50 }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }

  return (
    <TView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
         
      }}  
    >
      
      <TView style={styles.titleContainer}>
        <TText type="title">Tests</TText>
      </TView>
      <TText>Egehan'ın proje komponentlerini test ederkene uygulamayı patlatdığı sayfa (ops elim kaydı)</TText>
      <TButton
        style={{
          padding: 10,
          borderRadius: 8,
          borderColor: '#ffffff',
          borderWidth: 1,
        }}
        onPress={() => handleTest()}
        type="pressable"
        >
        <TText>ADD TASK TEST BUTTON</TText>
      </TButton>
    </TView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
