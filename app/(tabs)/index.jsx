import {
  Image,
  StyleSheet,
  Platform,
  Animated,
  TouchableOpacity,
  Alert,
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableHighlight,
  Modal,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../_layout';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '../AppContext';
import AvatarEngine from '../../components/AvatarEngine';
import { addListener, removeListener } from '../../components/eventManager';
import { Picker } from '@react-native-picker/picker';
import ConfettiCannon, { DEFAULT_COLORS, DEFAULT_EXPLOSION_SPEED, DEFAULT_FALL_SPEED } from 'react-native-confetti-cannon';


export default function HomeScreen() {
  const [showTip, setTip] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = React.useState(false);
  const [selectedAvatar, setSelectedAvatar] = React.useState(null);
  const [avatarMessage, setAvatarMessage] = React.useState("");
  const [avatarName, onChangeText] = React.useState('Enter your avatar name');
  const [visibleAvatarComponent, setVisibleAvatarComponent] = React.useState(0);
  const [isClidked, setIsClicked] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [userIsLoggedIn, setUserIsLoggedIn] = React.useState(false);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [userData, setUserData] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showToken, setShowToken] = useState(false);


  // Shared states
  const { aura, setAura, auraActivityMessage, setAuraActivityMessage } = useAppContext();

  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const handleTaskCompleted = (activityMessage) => {
      const newAuraActivityMessage = avatarEngine.getActivityMessage("Aura", aura);
      console.log(newAuraActivityMessage);
      setAuraActivityMessage(newAuraActivityMessage);
      console.log('Görev tamamlandı:', activityMessage);
      console.log('Yeni auraActivityMessage:', newAuraActivityMessage);
      messageMotor('aura-info', activityMessage);
    };

    addListener('taskCompleted', handleTaskCompleted);

    return () => {
      removeListener('taskCompleted');
    };
    console.log('Index sayfası gösteriliyor');
  }, [aura]);

  const waitingMotor = (time, callback) => {
    setTimeout(callback, time);
  };

  const avatarEngine = new AvatarEngine();
  const messageMotor = (messageType, aMessage) => {
    const mood = avatarEngine.calculateMood(aura);

    switch (messageType) {
      case "aura-info":
        const auraMessage = avatarEngine.getActivityMessage("Aura", aura);
        const dailyMessage = avatarEngine.generateDailyMessage(aura, []);
        const moodMessage = avatarEngine.getAvatarAnimation(dailyMessage);
        console.log('auraActivityMessage:', aMessage);
        console.log('dailyMessage:', dailyMessage);
        setAvatarMessage(aMessage + "," + dailyMessage);
        break;

      case "first-look":
        if (aura < 500) {
          setAvatarMessage("You need to collect more Aura!");
          setTimeout(() => {
            setAvatarMessage("Want to try some activities?");
            setVisibleAvatarComponent(1);
          }, 2000);
        } else {
          setAvatarMessage("Your aura is strong! Keep up the good work!");
        }
        break;

      case "default":
        const animation = avatarEngine.getAvatarAnimation(mood);
        setAvatarMessage("Hello! Click me to see your aura status!");
        break;
    }
  };



  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Emoji bounce animation when sleep duration changes
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sleepHours, sleepMinutes]);
  const getTotalHours = () => {

    const hours = Number(sleepHours);
    const minutes = Number(sleepMinutes);
    return hours + (minutes / 60);
  };


  const getEmoji = () => {
    const totalHours = getTotalHours();
    if (totalHours < 4) return '😫';      // critically low
    if (totalHours < 5) return '🥱';      // very low
    if (totalHours < 6) return '😔';      // low
    if (totalHours < 7) return '😐';      // below average
    if (totalHours < 8) return '😊';      // good
    if (totalHours < 9) return '😃';      // very good
    if (totalHours < 10) return '😁';     // excellent
    if (totalHours < 11) return '😴';     // slightly high
    if (totalHours < 12) return '🛌';     // high
    if (totalHours < 13) return '💤';     // very high
    return '🌙';                          // excessive
  };

  const getSleepQualityMessage = () => {
    const totalHours = getTotalHours();
    if (totalHours < 4) return 'Critically low sleep! Your health needs more rest.';
    if (totalHours < 5) return 'Very low sleep hours. Try to get more rest for better performance.';
    if (totalHours < 6) return 'Not enough sleep. You need more rest for optimal health.';
    if (totalHours < 7) return 'Below average sleep duration. Aim for 7-9 hours.';
    if (totalHours < 8) return "Good sleep duration! You're in the ideal range.";
    if (totalHours < 9) return "Perfect! You've hit the optimal sleep duration.";
    if (totalHours < 10) return 'Excellent! You should feel fully recharged.';
    if (totalHours < 11) return 'Slightly more than needed. 7-9 hours is ideal.';
    if (totalHours < 12) return 'Extended sleep. You might feel groggy during the day.';
    if (totalHours < 13) return 'Very long sleep duration. Consider reducing your sleep time.';
    return 'Excessive sleep duration. Consider consulting a sleep specialist.';
  };


  const handleAddTask = () => {
    Alert.alert(
      "Create a new task",
      "Would you like to add a new task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "default",
          onPress: () => {
            console.log('Add task button pressed');
            setIsClicked(true);
            //navigation.navigate('tasks');
            setTip(true);
            console.log(isClidked);
            waitingMotor(500, () => {
              setTip(true);
            });
          }
        }
      ]
    );

  }

  const handleCompleteOnboarding = () => {
    setOnboardingCompleted(true);
    setAura(userData.aura);
    if (aura === undefined) {
      setAura(0);
    }
    messageMotor("default");
  }




  const animate = (nextPage, direction) => {
    const initialSlide = direction === 'forward' ? 100 : -100;
    const finalSlide = direction === 'forward' ? -100 : 100;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: finalSlide,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPage(nextPage);
      slideAnim.setValue(initialSlide);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleSkipPage = () => {
    if (page >= 5) {
      animate(0, 'forward');
      return;
    }
    animate(page + 1, 'forward');
  }

  const handleBackPage = () => {
    if (page <= 0) {
      return;
    }
    animate(page - 1, 'backward');
  }



  const registerUser = async () => {
    try {
      const response = await fetch('http://192.168.1.161:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, aura: 0 })
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        setUser(data); // Kullanıcıyı state'e ekle
        alert('Başarı', 'Kayıt başarılı!');
      } else {
        alert('Hata', data.error);
      }
    } catch (error) {
      alert('Hata', 'Kayıt sırasında bir hata oluştu.');
    }
  };

  const loginUser = async () => {
    try {
      // First, authenticate with your server
      const response = await fetch('http://192.168.1.161:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        await AsyncStorage.setItem('userToken', data.token);

        // Set user data in state
        setUser(data.user);

        // alert('Başarı', 'Giriş başarılı!');
        setUserIsLoggedIn(true); // Kullanıcı girişi yapıldığı için state'e ekle
        console.log("1",data.user.aura);
        console.log("2",userData.aura);
        console.log("3",user.aura)
        setAura(data.user.aura);

      } else {
        console.log('Hata', data.error);
        alert('Hata', data.error);
      }
    } catch (error) {
      alert('Hata', 'Giriş sırasında bir hata oluştu.');
      console.log('Hata:', error);
    }
  };



  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null); // veya setUser(null)
      // Kullanıcıyı login sayfasına yönlendir
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
    }
  };


  // Welcome message
  const pageOne = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>

      <TView style={styles.titleContainer}>
        <TText
          type="title"
          style={styles.headerText}
        >
          Welcome! 👋
        </TText>
      </TView>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleSkipPage()}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >
          Get Started 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  // What we are do
  const pageTwo = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView style={styles.heroHeader}>
        <TButton style={styles.skipIcon}
          onPress={() => handleBackPage()}
        >
          <TText
            style={{
              color: '#FFFFFF',
            }}
          >
            <Ionicons name='arrow-back-outline' size={28} style={{ color: "#fff" }}></Ionicons>
          </TText>
        </TButton>
      </TView>
      <TView style={styles.container}>
        <TText
          type="title"
          style={styles.headerText}
        >
          What we are do 🤔?
        </TText>
        <TText
          type='default'
          style={styles.simpleText}
        >
          We help you stay focused and productive by tracking your daily activities and offering personalized feedback through an interactive avatar. Our system rewards good habits and motivates you to avoid distractions, making self-improvement fun and engaging!
        </TText>
      </TView>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleSkipPage()}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >
          Next 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  // How it works
  const pageThree = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView style={styles.heroHeader}>
        <TButton style={{
          position: 'absolute',
          top: 20,
          left: 0,
          padding: 16,


        }}
          onPress={() => handleBackPage()}
        >
          <TText
            style={{
              color: '#FFFFFF',

            }}
          >

            <Ionicons name='arrow-back-outline' size={28} style={{ color: "#fff" }}></Ionicons>
          </TText>
        </TButton>
      </TView>
      <TView style={styles.container}>
        <TText
          type="title"
          style={styles.headerText}
        >
          How it works 🚀?
        </TText>
        <TText
          type='default'
          style={styles.simpleText}
        >

          Our app uses machine learning to analyze your daily activities and provide personalized feedback. The more you use it, the smarter it gets! Our goal is to help you build better habits and improve your productivity over time.
        </TText>
      </TView>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleSkipPage()}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >

          Next 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  // Select your avatar
  const pageFour = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView style={styles.heroHeader}>
        <TButton style={styles.skipIcon}
          onPress={() => handleBackPage()}
        >
          <TText
            style={{
              color: '#FFFFFF',
            }}
          >
            <Ionicons name='arrow-back-outline' size={28} style={{ color: "#fff" }}></Ionicons>
          </TText>
        </TButton>
      </TView>
      <TView style={styles.container}>

        <TView
          style={{

            justifyContent: 'center',
            alignItems: 'center',
          }}

        >
          <TView
            style={{

              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TText
              type="title"
              style={styles.headerText}
            >
              Select your avatar 🤠!
            </TText>
            <TText
              type='default'
              style={styles.simpleText}
            >
              Choose an avatar that represents you! You can change it later in the settings menu.
            </TText>
          </TView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              width: '100%',

            }}

          >

            <TView
              style={{
                flexDirection: 'row',
                gap: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TView
                style={[styles.card, selectedAvatar === 1 && styles.cardHover]}
                onTouchStart={() => setSelectedAvatar(1)}
              >
                <Image
                  source={require('@/assets/images/avatar1.png')}
                  style={{
                    width: 100,
                    height: 200,
                    resizeMode: 'contain',
                  }}
                  resizeMode="contain"
                />
              </TView>
              <TView
                style={[styles.card, selectedAvatar === 2 && styles.cardHover]}
                onTouchStart={() => setSelectedAvatar(2)}
              >
                <Image
                  source={require('@/assets/images/avatar2.png')}
                  style={{
                    width: 100,
                    height: 200,
                    resizeMode: 'contain',
                  }}
                  resizeMode='contain'
                />
              </TView>
            </TView>

          </ScrollView>

          {/*
               
               Maybe we use later
               <TText>
                  Selected Avatar: {selectedAvatar === 1 ? 'Boe' : 'Jane'}
                </TText> 
                */}

        </TView>
      </TView>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleSkipPage()}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >

          Next 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  // Select your avatar name
  const pageFive = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView style={styles.heroHeader}>
        <TButton style={styles.skipIcon}
          onPress={() => handleBackPage()}
        >
          <TText
            style={{
              color: '#FFFFFF',
            }}
          >

            <Ionicons name='arrow-back-outline' size={28} style={{ color: "#fff" }}></Ionicons>
          </TText>
        </TButton>
      </TView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
        <TView
          style={styles.container}
        >

          <TText
            type="title"
            style={styles.headerText}
          >
            Select Your Avatar Name 🚀?
          </TText>
          <TText
            type='default'
            style={styles.simpleText}
          >
            Select your avatar name for the app. You can change it later in the settings menu.
          </TText>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              color: '#ffffff',
              minWidth: 100,
              textAlign: 'center',
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              margin: 8,
            }}
            onChangeText={text => onChangeText(text)}
            avatarName={avatarName}
          />
        </TView>
      </TouchableWithoutFeedback>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleSkipPage()}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >
          Next 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  useEffect(() => {
    fetchUserData();
  }, []);

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
      setAura(data.user.aura);
      console.log("4",data.user.aura);
    } catch (error) {
      console.error('Kullanıcı bilgisi alınırken hata:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
    }
  };

  const handleSleepEvent = async () => {
    try {
      console.log('Sleep duration:', sleepHours);


      // PUT isteği
      const userUpdateResponse = await fetch(`http://192.168.1.161:3000/api/collection/users/${userData.uid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dailySleepHours: sleepHours }),
      });

      // Yanıtı kontrol et
      const responseData = await userUpdateResponse.json();
      //console.log('Raw response:', userUpdateResponse);
      console.log('Response Data:', responseData);

      if (userUpdateResponse.ok) {
        console.log('User updated successfully');
        handleCompleteOnboarding(); // Başarı durumunda onboarding işlemini tamamla
      } else {
        console.log('Update failed:', responseData.error); // Hata mesajını logla
        alert('Error', responseData.error); // Hata durumunda kullanıcıya bildir
      }

    } catch (error) {
      console.error('Error occurred:', error);
      alert('Hata', 'Güncelleme sırasında bir hata oluştu.');
    }
  };


  const pageSix = (
    <Animated.View
      style={[

        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TView style={styles.heroHeader}>
        <TButton style={styles.skipIcon}
          onPress={() => handleBackPage()}
        >
          <TText
            style={{
              color: '#FFFFFF',
            }}
          >
            <Ionicons name='arrow-back-outline' size={28} style={{ color: "#fff" }}></Ionicons>
          </TText>
        </TButton>
      </TView>
      <TView
        style={
          styles.container
        }
      >

        <Text style={styles.headerText}>Sleep Duration</Text>
        <Text style={styles.subHeaderText}>
          Daily sleep duration is important for your health and well-being.
        </Text>


        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={sleepHours}
              style={styles.picker}
              onValueChange={(itemValue) => setSleepHours(itemValue)}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <Picker.Item key={i} label={`${i} Hours`} value={i} />
              ))}
            </Picker>
          </View>


        </View>

        <Animated.Text
          style={[
            styles.emoji,
            {
              transform: [{ scale: bounceAnim }],
            },
          ]}
        >
          {getEmoji()}
        </Animated.Text>

        <Text style={styles.sleepDuration}>
          {sleepHours} Hours
        </Text>
        <Text style={styles.sleepQuality}>{getSleepQualityMessage()}</Text>

      </TView>
      <TButton
        type="default"
        buttonType="opacity"
        onPress={handleSleepEvent}
        style={styles.button}
      >
        <TText
          type="default"
          style={styles.simpleText}
        >
          Next 🚀
        </TText>
      </TButton>

    </Animated.View>
  );

  const { width } = Dimensions.get('window');
  let ref;


const[ pageState, setPageState ] = useState(true);
  const toggleForm = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      //setUserIsLoggedIn(!isLogin);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    setPageState(!pageState);
  };


  const LoginPage = (
    <TView  >
      <TView  >
        {
          pageState ? (
            <Animated.View style={{ opacity: fadeAnim }}>
            <TText type="title" style={styles.formTitle}>
              Giriş Yap
            </TText>
            <TView style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#CCCCCC"
              />
            </TView>
            <TView style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#CCCCCC"
              />
            </TView>
            <TButton
              type="pressable"
              style={styles.submitButton}
              onPress={loginUser}
            >
              <TText style={styles.submitButtonText}>
                Giriş Yap
              </TText>
            </TButton>
            <TouchableOpacity onPress={toggleForm} style={styles.toggleContainer}>
              <TText style={styles.toggleText}>
                Hesabınız yok mu? Kayıt olun
              </TText>
            </TouchableOpacity>
          </Animated.View>
          ) : (  

            <Animated.View style={{ opacity: fadeAnim }}>
            <TText type="title" style={styles.formTitle}>
              Kayıt Ol
            </TText>
            <TView style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#CCCCCC"
              />
            </TView>
            <TView style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#CCCCCC"
              />
            </TView>
            <TButton
              type="pressable"
              style={styles.submitButton}
              onPress={registerUser}
            >
              <TText style={styles.submitButtonText}>
                Kayıt Ol
              </TText>
            </TButton>
            <TouchableOpacity onPress={toggleForm} style={styles.toggleContainer}>
              <TText style={styles.toggleText}>
                Zaten hesabınız var mı? Giriş yapın
              </TText>
            </TouchableOpacity>
          </Animated.View>
             
          )
        }
      </TView>
    </TView>
  );

 






  const MainPage = (
    <TView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >

      <TView
        style={{
          marginTop: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
          // Header
        }
        <TView
          style={{
            flexDirection: 'row',
            marginBottom: 28,
            height: 42,
            width: '100%',

          }}
        >
          <TView
            style={{
              height: 42,
              width: '80%',
            }}
          >

          </TView>
          <TView>
            <Modal
            
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}>
                  <View
                    style={styles.modalView}
                  >
                <View style={styles.centeredView}>
                <ScrollView  > 

                  <Text style={styles.headerModalText}>Settings</Text>

                  <View style={styles.divider} /> 
                 
                  {/* User Avatar Section */}
                  <View style={styles.settingItem}>
                  <Ionicons name="person-circle-outline" size={64} color="#666" />
                  <Text style={styles.settingLabel}>Selected Avatar: {selectedAvatar}</Text>
                  <Text style={styles.settingValue}>Avatar Name: {avatarName}</Text>
                  </View>

                   {/* Email Section */}
                   <View style={styles.settingItem}>
                  <Ionicons name="bar-chart-outline" size={24} color="#666" />
                  <Text style={styles.settingLabel}>Aura</Text>
                  <Text style={styles.settingValue}>{userData ? userData.aura : 0}</Text>
                  </View>

                  {/* Email Section */}
                  <View style={styles.settingItem}>
                  <Ionicons name="mail-outline" size={24} color="#666" />
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>{userData ? userData.email : 0}</Text>
                  </View>

                  {/* Sleep Hours Section */}
                  <View style={styles.settingItem}>
                  <Ionicons name="moon-outline" size={24} color="#666" />
                  <Text style={styles.settingLabel}>Sleep Hours</Text>
                  <Text style={styles.settingValue}>{sleepHours } hours</Text>
                  </View>

                  {/* Token Section (Hidden by default) */}
                  <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => setShowToken(!showToken)}
                  >
                  <Ionicons name="key-outline" size={24} color="#666" />
                  <Text style={styles.settingLabel}>Auth Token</Text>
                  <Text style={styles.settingValue}>
                    {showToken ? token : '••••••••••••••••'}
                  </Text>
                  <Ionicons
                    name={showToken ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                    style={styles.eyeIcon}
                  />
                  </TouchableOpacity>
                 
                  <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose, { backgroundColor: '#D63900' }]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.buttonText}>Exit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose, { backgroundColor: '#FFF470' }]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.buttonText}>Exit With Changes</Text>
                  </Pressable>
                  </View>
                  </ScrollView>
                </View>
                  </View>

              </Modal>
              
              <TouchableHighlight
                style={styles.settingsButton}
                onPress={() => {
                // Show Modal
                setModalVisible(true)
              }}

            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="settings-outline"
                  size={32}
                  color="#FFFFFF"
                />
              </View>
            </TouchableHighlight>
          </TView>


        </TView>
        <TView
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: 16,
            borderRadius: 20,
            margin: 16,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginBottom: 30,
            position: 'relative',
          }}
        >
          <TView

            style={{
              color: '#000000',
              backgroundColor: '#FFFFFF',

              padding: 15,

            }}
          >
            <TView
              style={{
                backgroundColor: '#FFFFFF',
              }}

            >
              {(() => {
                switch (visibleAvatarComponent) {
                  case 1:
                    return (
                      <TText
                        style={{
                          color: '#000000',
                        }}
                      >
                        <TText
                          style={{
                            color: '#000000',

                          }}
                        >
                          {avatarName + " says:  "}
                          <TButton
                            type="default"
                            buttonType="pressa"
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                            }}


                            onPress={() => {
                              setAura(aura + 10);
                              console.log("clicked");
                            }}
                          >

                            <TText
                              type='default'
                              style={{
                                color: '#000000',
                                fontWeight: 'bold',

                              }}

                              onPress={() => handleAddTask()}
                            >
                              Add Task?
                            </TText>

                          </TButton>
                        </TText>


                      </TText>
                    );
                  default:
                    return (
                      <TText
                        style={{
                          color: '#000000',
                        }}>
                        {avatarName} says: {avatarMessage}
                      </TText>
                    );
                }
              })()}
            </TView>
          </TView>
          <TView
            style={{
              position: 'absolute',
              bottom: -35,
              right: '45%',
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
          <TView
            style={{
              position: 'absolute',
              bottom: -50,
              right: '48%',
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#FFFFFF',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
        </TView>
        <TButton
          type="default"
          buttonType="opacity"
          onPress={() => messageMotor("aura-info")}

        >
          <Image
            source={
              selectedAvatar === 1 ? require('@/assets/images/avatar1.png') : require('@/assets/images/avatar2.png')
            }
            style={{
              width: 300,
              height: 300,
              resizeMode: 'contain',
            }}
            resizeMode='contain'
          />
        </TButton>

        <TText
          style={{
            color: '#FFFFFF',
          }}
        >
          Aura: {aura}
        </TText>


      </TView>
      <TView
        style={{
          flexDirection: 'row',
          justifyContent: 'end',
          alignItems: 'end',
        }}
      >

        <TView

          content={
            <View>
              <Text> Press Tasks Page </Text>
            </View>
          }

          placement="bottom"
          // below is for the status bar of react navigation bar
          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        >
          <TouchableOpacity
            style={{ display: 'flex', width: 250, marginTop: 20 }}

          >

          </TouchableOpacity>
        </TView>
        <Tooltip
          isVisible={showTip}
          content={
            <View>
              <Text>
                Go to tasks page
                <Ionicons size={28} style={{ color: "#000" }} name='arrow-down-outline'></Ionicons> </Text>
            </View>
          }
          onClose={() => setTip(false)}
          placement="bottom"
          // below is for the status bar of react navigation bar
          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        >
          <TouchableOpacity
            style={[{ width: '100%', marginTop: 20 }]}
            onPress={() => setTip(true)}
          >
            <Text>
              .
            </Text>
          </TouchableOpacity>
        </Tooltip>
      </TView>
    </TView>
  );


  return (
    <TView style={{
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {onboardingCompleted ? (
        <>
          {MainPage}
          <ConfettiCannon
            count={250}
            origin={{
              x: -10,
              y: -10
            }}
            explosionSpeed={DEFAULT_EXPLOSION_SPEED}
            fallSpeed={DEFAULT_FALL_SPEED}
            fadeOut={false}
            colors={DEFAULT_COLORS}
            autoStart={true}
            autoStartDelay={1000}
            onAnimationStart={() => console.log('Animation started')}
            onAnimationStop={() => console.log('Animation stopped')}
            onAnimationResume={() => console.log('Animation resumed')}
            onAnimationEnd={() => console.log('Animation ended')}
            ref={_ref => ref = _ref}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </>
      ) : (() => {
        if (!userIsLoggedIn) {
          return LoginPage;
        } else if (userIsLoggedIn) {
          switch (page) {
            case 0:
              return pageOne;
            case 1:
              return pageTwo;
            case 2:
              return pageThree;
            case 3:
              return pageFour;
            case 4:
              return pageFive;
            case 5:
              return pageSix;
            default:
              return pageOne;
          }
        }
      })()}
    </TView>
  );
}

const styles = StyleSheet.create({

  settingsButton: {
    width: 42,
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: 42,
    width: '80%',
  },
  skipIcon: {
    position: 'absolute',
    top: 20,
    left: 0,
    padding: 16,
  },

  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  card: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 8,
    height: 200,
  },
  cardHover: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  button: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#FFFFFF',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
  },
  simpleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  sleepQualityText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,

    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 150,
  },
  emoji: {
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 20,
  },
  sleepDuration: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  sleepQuality: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    height: '%100',
    alignItems: 'center',
    backgroundColor: '#FBFAF4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FBFAF4',
    borderRadius: 20,
    padding: 35,
    height: '80%',
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerModalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
  },
  settingItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
  },
  buttonModal: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    padding: 10,
    minWidth: '45%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
  },
 
 
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: '#FFF470',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});