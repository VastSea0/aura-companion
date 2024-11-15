import React from "react";
import { StyleSheet, Alert, FlatList, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Tasks() {
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('personal');
  const [selectedAuraEvent, setSelectedAuraEvent] = React.useState("");
  const [userData, setUserData] = React.useState(null);
  const [token, setToken] = React.useState(null);

  const data = [
    {key: '1', value: 'Sanatsal Aktiviteler (+200 aura)', aura: 200},
    {key: '2', value: 'Oyun Oynama (+100/-100 aura)', aura: 100},
    {key: '3', value: 'Video İzleme (-50/-100 aura)', aura: -75},
    {key: '4', value: 'Sosyal Medyada Fotoğraf Akışı (-100 aura)', aura: -100},
    {key: '5', value: 'Kısa Video Akışı (-200 aura)', aura: -200},
    {key: '6', value: 'Dış Mekan Aktiviteleri (+150 aura)', aura: 150},
    {key: '7', value: 'Odak Gerektiren Etkinlikler (+250 aura)', aura: 250},
    {key: '8', value: 'Sosyal Aktiviteler (+100 aura)', aura: 100},
  ];

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        Alert.alert('Hata', 'Oturum bulunamadı');
        return;
      }

      setToken(storedToken);

      const response = await fetch('http://192.168.1.161:3000/api/user', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          // Burada navigation.navigate('Login') eklenebilir
          return;
        }
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Kullanıcı bilgisi alınırken hata:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchTasks = async () => {
    if (!userData) return;

    setLoading(true);
    try {
      const baseUrl = 'http://192.168.1.161:3000/api/collection';
      
      // userId'yi userData.uid'den alalım
      const userId = userData.uid;
      
      let response;
      if (viewMode === 'personal') {
        // Direkt olarak POST request ile filtreleme yapalım
        response = await fetch(`${baseUrl}/tasks/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filters: [
              {
                field: 'userId',
                operator: '==',
                value: userId
              }
            ]
          })
        });
      } else {
        response = await fetch(`${baseUrl}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görevler alınırken hata oluştu');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.log('Unexpected data format:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Fetch error details:', error);
      setTasks([]); // Hata durumunda boş array set edelim
      Alert.alert("Hata", "Görevler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (userData) {
      fetchTasks();
    }
  }, [viewMode, userData]);

 

  const handleCompleteTask = (taskId) => {
    if (!token) {
      Alert.alert("Hata", "Oturum bulunamadı");
      return;
    }

    Alert.alert(
      "Görevi Tamamla",
      "Bu görevi tamamladığınızdan emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Tamamla",
          style: "default",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.161:3000/api/collection/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: true })
              });

              if (!response.ok) {
                throw new Error('Görev güncellenirken bir hata oluştu');
              }

              setTasks(currentTasks =>
                currentTasks.map(task =>
                  task.id === taskId ? { ...task, completed: true } : task
                )
              );
            } catch (error) {
              Alert.alert("Hata", error.message);
            }
          }
        }
      ]
    );
  };

  const handleAddTask = async () => {
    if (!userData || !token) {
      Alert.alert("Hata", "Oturum bilgisi bulunamadı");
      return;
    }

    const selectedCategory = data.find(item => item.value === selectedAuraEvent);
    if (!selectedCategory) {
      Alert.alert("Hata", "Lütfen bir aktivite tipi seçin");
      return;
    }

    const newTask = {
      title: selectedCategory.value,
      userId: userData.uid, // uid kullanıyoruz
      completed: false,
      aura: selectedCategory.aura,
      createdAt: new Date().toISOString(),
      priority: selectedCategory.value
    };

    try {
      const response = await fetch('http://192.168.1.161:3000/api/collection/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görev eklenirken bir hata oluştu');
      }

      await fetchTasks(); // Görevleri yeniden yükle
      setSelectedAuraEvent("");
    } catch (error) {
      console.error('Add task error:', error);
      Alert.alert("Hata", error.message);
    }
  };

  const renderTask = ({ item }) => (
    <TView style={[styles.card, item.completed && styles.completedCard]}>
      <TView style={styles.taskHeader}>
        <TText style={[
          styles.taskTitle,
          item.completed && styles.completedTaskTitle
        ]}>
          {item.title}
        </TText>
        <TView style={[
          styles.priorityBadge,
          item.completed && styles.completedPriorityBadge,
          { backgroundColor: getPriorityColor(item.priority) }
        ]}>
          <TText style={styles.priorityText}>{item.priority}</TText>
        </TView>
      </TView>
  
      <TView style={styles.taskInfo}>
        <TText style={[
          styles.auraText,
          item.completed && styles.completedAuraText
        ]}>
          Aura: {item.aura}
        </TText>
        <TText style={[
          styles.statusText,
          item.completed && styles.completedStatusText
        ]}>
          {item.completed ? "Tamamlandı ✓" : "Devam Ediyor"}
        </TText>
      </TView>
  
      <TView style={[
        styles.buttonContainer,
        item.completed && styles.completedButtonContainer
      ]}>
        <TButton
          type={!item.completed ? "highlight" : "disabled"}
          style={[styles.button, styles.completeButton]}
          onPress={() => !item.completed 
            ? handleCompleteTask(item.id) 
            : Alert.alert("Bu görev zaten tamamlandı")}
        >
          {item.completed ? "Tamamlandı" : "Tamamla"}
        </TButton>
        
        <TButton
          type="pressable"
          style={[styles.button, styles.detailsButton]}
        >
          Detaylar
        </TButton>
      </TView>
    </TView>
  );

  if (loading) {
    return (
      <TView style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </TView>
    );
  }

  return (
    <TView style={styles.container}>
      <SafeAreaView />
      <TView style={styles.header}>
        <TText type="title">Görevler</TText>
        <TView style={styles.viewModeContainer}>
          <TButton
            type={viewMode === 'personal' ? 'highlight' : 'pressable'}
            style={styles.viewModeButton}
            onPress={() => setViewMode('personal')}
          >
            Kişisel
          </TButton>
          <TButton
            type={viewMode === 'all' ? 'highlight' : 'pressable'}
            style={styles.viewModeButton}
            onPress={() => setViewMode('all')}
          >
            Tümü
          </TButton>
        </TView>
      </TView>

      <TView style={styles.controlPanel}>
        <SelectList 
          inputStyles={styles.selectInput}
          boxStyles={styles.selectBox}
          dropdownStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
          setSelected={setSelectedAuraEvent}
          arrowicon={<AntDesign name="downcircle" size={24} color="white" />}
          searchicon={<AntDesign name="search1" size={24} color="white" />}
          data={data}
          save="value"
          placeholder="Tip seçiniz"
        />
          
        <TButton
          type="highlight"
          style={styles.addButton}
          onPress={handleAddTask}
        >
          Görev Ekle
        </TButton>
      </TView>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </TView>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Yüksek Öncelik':
      return '#FF4444';
    case 'Orta Öncelik':
      return '#FFB544';
    case 'Düşük Öncelik':
      return '#44AA44';
    default:
      return '#FFB544';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
     
  },
  completedCard: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
    opacity: 0.85,
    overlayColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.05)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  completedTaskTitle: {
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#999',
  },
  completedAuraText: {
    color: '#999',
  },
  completedStatusText: {
    color: '#87d987',
    fontWeight: '500',
  },
  completedPriorityBadge: {
    opacity: 0.7,
    backgroundColor: '#e0e0e0',
  },
  completedButtonContainer: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  controlPanel: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingBottom: 20,
  },
  selectInput: {
    color: '#ffffff',
    fontHeight: 24,
    fontSize: 16,
    padding: 4,
  },
  selectBox: {
    borderColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
  },
  dropdown: {
    fontStyle: 'normal',
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  dropdownText: {
    color: '#fff',
  },
  addButton: {
    marginTop: 16,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 6,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  completedCard: {
 
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  auraText: {
    color: '#fff',
    fontSize: 14,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    color: '#000',
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});