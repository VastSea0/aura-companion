import React from "react";
import { StyleSheet, Alert, FlatList, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AvatarEngine} from '../../components/AvatarEngine';
import {notify} from '@/components/eventManager';

import { useAppContext } from '../AppContext';

// Move data array outside component as a constant
const ACTIVITY_DATA = [
  {key: '1', value: 'Artistic Activities', aura: 200},
  {key: '2', value: 'Playing Games', aura: -100},
  {key: '3', value: 'Watching Videos', aura: -75},
  {key: '4', value: 'Scrolling Photos on Social Media', aura: -100},
  {key: '5', value: 'Short Video Streaming', aura: -200},
  {key: '6', value: 'Outdoor Activities', aura: 150},
  {key: '7', value: 'Focus Required Activities', aura: 250},
  {key: '8', value: 'Social Activities', aura: 100},
  {key: '9', value: 'Reading Books', aura: 100},
  {key: '10', value: 'Meditation', aura: 150},
  {key: '11', value: 'Cooking', aura: 50},
  {key: '12', value: 'Learning a New Skill', aura: 200},
  {key: '13', value: 'Exercising', aura: 150},
  {key: '14', value: 'Listening to Music', aura: 50},
  {key: '15', value: 'Gardening', aura: 100},
  {key: '16', value: 'Volunteering', aura: 200}
];

// Extract TaskCard component
const TaskCard = React.memo(({ item, onComplete }) => {
  return (
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
            ? onComplete(item) 
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
});

// Extract FilterButtons component
const FilterButtons = React.memo(({ filterMode, setFilterMode }) => {
  return (
    <TView style={styles.filterContainer}>
      <TButton
        type={filterMode === 'all' ? 'highlight' : 'pressable'}
        style={styles.filterButton}
        onPress={() => setFilterMode('all')}
      >
        Tümü
      </TButton>
      <TButton
        type={filterMode === 'completed' ? 'highlight' : 'pressable'}
        style={styles.filterButton}
        onPress={() => setFilterMode('completed')}
      >
        Bitti
      </TButton>
      <TButton
        type={filterMode === 'incomplete' ? 'highlight' : 'pressable'}
        style={styles.filterButton}
        onPress={() => setFilterMode('incomplete')}
      >
        Devam Ediyor
      </TButton>
    </TView>
  );
});

export default function Tasks() {
  const { aura, setAura } = useAppContext(); // Component seviyesinde context'i alalım

  const [state, setState] = React.useState({
    tasks: [],
    loading: false,
    viewMode: 'personal',
    filterMode: 'all',
    selectedAuraEvent: '',
    userData: null,
    token: null
  });

  // Fetch user data with better error handling
  const fetchUserData = React.useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const storedToken = await AsyncStorage.getItem('userToken');
      console.log('Stored token:', storedToken); // Debug log

      if (!storedToken) {
        console.log('No token found'); // Debug log
        // Navigate to login if needed
        // navigation.navigate('Login');
        return;
      }

      setState(prev => ({ ...prev, token: storedToken }));

      const response = await fetch('http://192.168.1.161:3000/api/user', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          // navigation.navigate('Login');
          throw new Error('Oturum süresi dolmuş');
        }
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const userData = await response.json();
      console.log('User data received:', userData); // Debug log

      setState(prev => ({ 
        ...prev, 
        userData,
        loading: false 
      }));

    } catch (error) {
      console.error('Kullanıcı bilgisi alınırken hata:', error);
      Alert.alert('Hata', error.message);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Initialize data on mount
  React.useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch tasks when user data is available
  React.useEffect(() => {
    if (state.userData && state.token) {
      fetchTasks();
    }
  }, [state.userData, state.token]);

  const handleAddTask = React.useCallback(async () => {
    if (!state.userData || !state.token) {
      console.log('Current state:', state); // Debug log
      Alert.alert("Hata", "Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      // navigation.navigate('Login');
      return;
    }

    const selectedCategory = ACTIVITY_DATA.find(item => item.value === state.selectedAuraEvent);
    if (!selectedCategory) {
      Alert.alert("Hata", "Lütfen bir aktivite tipi seçin");
      return;
    }

    try {
      const newTask = {
        title: selectedCategory.value,
        userId: state.userData.uid,
        completed: false,
        aura: selectedCategory.aura,
        createdAt: new Date().toISOString(),
        priority: selectedCategory.value
      };

      const response = await fetch('http://192.168.1.161:3000/api/collection/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görev eklenirken bir hata oluştu');
      }

      await fetchTasks();
      setState(prev => ({ ...prev, selectedAuraEvent: '' }));
      Alert.alert("Başarılı", "Görev başarıyla eklendi");

    } catch (error) {
      console.error('Add task error:', error);
      Alert.alert("Hata", error.message);
    }
  }, [state.userData, state.token, state.selectedAuraEvent]);

  // Memoize filtered tasks
  const filteredTasks = React.useMemo(() => {
    if (state.filterMode === 'completed') {
      return state.tasks.filter(task => task.completed);
    } else if (state.filterMode === 'incomplete') {
      return state.tasks.filter(task => !task.completed);
    }
    return state.tasks;
  }, [state.tasks, state.filterMode]);

  // Memoize callbacks
  const handleCompleteTask = React.useCallback((task) => {
    if (!state.token) {
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
              const response = await fetch(`http://192.168.1.161:3000/api/collection/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${state.token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: true })
              });

              if (!response.ok) {
                throw new Error('Görev güncellenirken bir hata oluştu');
              }

              setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                  t.id === task.id ? { ...t, completed: true } : t
                )
              }));

              // Avatar engine mesajı oluşturma
              const avatarEngine = new AvatarEngine();
              const activityMessage = avatarEngine.getActivityMessage(task.title, task.aura);
              notify('taskCompleted', activityMessage);

              // Aura güncellemesi
              const newAura = aura + task.aura;
              setAura(newAura);

              // Kullanıcı belgesini güncelle
              const userUpdateResponse = await fetch(`http://192.168.1.161:3000/api/collection/users/${state.userData.uid}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${state.token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ aura: newAura })
              });

              if (!userUpdateResponse.ok) {
                throw new Error('Kullanıcı belgesi güncellenirken bir hata oluştu');
              }

            } catch (error) {
              Alert.alert("Hata", error.message);
            }
          }
        }
      ]
    );
  }, [state.token, state.userData, aura, setAura]);

  // Optimize fetch tasks with AbortController
  const fetchTasks = React.useCallback(async () => {
    if (!state.userData) return;

    setState(prev => ({ ...prev, loading: true }));
    const controller = new AbortController();

    try {
      const baseUrl = 'http://192.168.1.161:3000/api/collection';
      
      const userId = state.userData.uid;
      
      let response;
      if (state.viewMode === 'personal') {
      
        response = await fetch(`${baseUrl}/tasks/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.token}`,
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
          }),
          signal: controller.signal
        });
      } else {
        response = await fetch(`${baseUrl}/tasks`, {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Görevler alınırken hata oluştu');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setState(prev => ({ ...prev, tasks: data }));
      } else {
        console.log('Unexpected data format:', data);
        setState(prev => ({ ...prev, tasks: [] }));
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Fetch error:', error);
        setState(prev => ({ ...prev, tasks: [] }));
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }

    return () => controller.abort();
  }, [state.userData, state.viewMode]);

  // Optimize list rendering
  const keyExtractor = React.useCallback((item) => item.id.toString(), []);
  const renderItem = React.useCallback(({ item }) => (
    <TaskCard item={item} onComplete={handleCompleteTask} />
  ), [handleCompleteTask]);

  if (state.loading) {
    return (
      <TView style={styles.container}>
        <ActivityIndicator color="#FFFFFF" />
      </TView>
    );
  }

  return (
    <TView style={[styles.container, { paddingTop: 30, overflow: 'hidden' }]}>
      <SafeAreaView />
      
      <TView style={styles.header}>
        <TText type="title">Görevler</TText>
      {/*<TView style={styles.viewModeContainer}>
          <TButton
            type={state.viewMode === 'personal' ? 'highlight' : 'pressable'}
            style={styles.viewModeButton}
            onPress={() => setState(prev => ({ ...prev, viewMode: 'personal' }))}
          >
            Kişisel
          </TButton>
          <TButton
            type={state.viewMode === 'all' ? 'highlight' : 'pressable'}
            style={styles.viewModeButton}
            onPress={() => setState(prev => ({ ...prev, viewMode: 'all' }))}
          >
            Tümü
          </TButton>
        </TView> */}
      </TView>

      <FilterButtons 
        filterMode={state.filterMode} 
        setFilterMode={(mode) => setState(prev => ({ ...prev, filterMode: mode }))} 
      />

      <TView style={styles.controlPanel}>
        <SelectList 
          inputStyles={styles.selectInput}
          boxStyles={styles.selectBox}
          dropdownStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
          setSelected={(value) => setState(prev => ({ ...prev, selectedAuraEvent: value }))}
          arrowicon={<AntDesign name="downcircle" size={24} color="white" />}
          searchicon={<AntDesign name="search1" size={24} color="white" />}
          data={ACTIVITY_DATA}
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
        data={filteredTasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  filterButton: {
    flex: 1,
  
  },
});