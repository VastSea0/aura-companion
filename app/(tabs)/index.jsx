import { Image, StyleSheet, Platform, Animated, View, Text, Button, ScrollView, TextInput, Pressable } from 'react-native';
import React from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const navigator = useNavigation();
  const [page, setPage] = React.useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = React.useState(false);
  const [selectedAvatar, setSelectedAvatar] = React.useState(null);
  const [avatarMessage, setAvatarMessage] = React.useState("Helo, you're welcome 🤠!");
  const [avatarName, onChangeText] = React.useState('Enter your avatar name');
  const [aura, setAura] = React.useState(0);
  const [visibleAvatarComponent, setVisibleAvatarComponent] = React.useState(0);
  const [isClidked, setIsClicked] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState(null);



  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  
  const waitingMotor = (time, callback) => {
    setTimeout(callback, time); // setInterval yerine setTimeout kullanıyoruz
  };

  const handleAddTask = () => {
    setIsClicked(true);
    console.log(isClidked);
    waitingMotor(500, () => {
      navigator.navigate('tasks');
    });
  }

  const handleCompleteOnboarding = () => { 
    setOnboardingCompleted(true);
  }
  
  const messageMotor = (messageType) => {
    switch (messageType) {
      case "aura-info":
        setAvatarMessage("Your aura is " + aura + "!");
        waitingMotor(2000, () => {  
          if (aura < 10) {
            setAvatarMessage("You need to collect more Aura");
            waitingMotor(2000, () => { // 2 saniye bekleyip tekrar
              setAvatarMessage("Do you want to collect more Aura?");
              setVisibleAvatarComponent(1);
              if (isClidked) {
                setAura(aura + 10);
                setVisibleAvatarComponent(0);
              }
              console.log("aura" + aura);
            });
          }
        });
        break;
      case "welcome":
        setAvatarMessage("Hello, you're welcome 🤠!");
        break;
      default:
        setAvatarMessage("Hello, you're welcome 🤠!");
        break;
    }
  };
  

  const animate = (nextPage) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPage(nextPage);
      slideAnim.setValue(100);
      
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
    if (page >= 4) {
      animate(0);
      return;
    }
    animate(page + 1);
  }

 
  const registerUser = async () => {
    try {
      const response = await fetch('http://192.168.1.161:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
      
      alert('Başarı', 'Giriş başarılı!');
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
 

  const pageTwo = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
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

  const pageThree = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
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

  const pageFour = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
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
                  
                <TText>
                  Selected Avatar: {selectedAvatar}
                </TText>

                </TView>
              </TView>
              <TButton
              type="default"
              buttonType="opacity"
              onPress={() => handleSkipPage()}
              style={styles.button}
              >

              {/*

                Eğer avatar seçildiyse bu buton aktif olacak.

              */}
        <TText
          type="default"
          style={styles.simpleText}
        >
         
          Finish 🚀
        </TText>
      </TButton>
    </Animated.View>
  );

  const pageFive = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView style={styles.container}>
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
      <TButton
        type="default"
        buttonType="opacity"
        onPress={() => handleCompleteOnboarding()}
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

  const LoginPage = (
    <Animated.View style={[
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }
    ]}>
      <TView  
        style={styles.container}
     >
        <TView 
            style={{
              borderWidth: 1,
              borderColor: '#FFFFFF',
              padding: 16,
              borderRadius: 8,
            }}
        >
      {user ? (
    
        <TView>
          <TText style={{ fontSize: 18, fontWeight: 'bold' }}>Hoş geldiniz, {user.email}!</TText>
          <TText>Kullanıcı ID: {user.uid}</TText>
          <TButton   onPress={logout}>
            Çıkış Yap
          </TButton>
        </TView>
      ) : (
 
        <TView 
          style={{
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <TText  
            type='title'
            style={{
              marginBottom: 16,
            }}
          >
            Giriş/Kayıt
        </TText>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ 
              borderWidth: 1, 
              padding: 10, 
              width: 200, 
              marginBottom: 10, 
              color: '#ffffff',
              borderColor: '#ffffff',
              borderRadius: 8,
            }}
          />
          <TextInput
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ 
              borderWidth: 1, 
              padding: 10, 
              width: 200, 
              marginBottom: 10, 
              color: '#ffffff',
              borderColor: '#ffffff',
              borderRadius: 8,
            }}
          />
          <TButton type='pressable' style={{borderWidth: 1, borderColor: "#fff", borderRadius: 8 , marginBottom: 10}} title="Kayıt Ol" onPress={registerUser}>
            Kayıt Ol
          </TButton>
          <TButton type='pressable' style={{borderWidth: 1, borderColor: "#fff", borderRadius: 8 , marginBottom: 10 }} title="Giriş Yap" onPress={loginUser} >
            Giriş Yap
          </TButton>
        </TView>
      )}
    </TView>
      </TView>
 
    </Animated.View>
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
        <TButton
          type="title" 
          style={{
            color: '#000000',
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
                      {avatarName + "   "}   
                    </TText>
                   
                  <TButton
                    type="default"
                    buttonType="opacity"
                    style={
                      {
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: '#FFD700',
                        borderColor: '#FFE700',
                        borderWidth: 1,
                      }
                    }
                    onPress={() => {
                      handleAddTask();
                    }}
                  >
                    <TText
                      type='default'
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 16,      
                      }} 
                    >
                      Add Task
                    </TText>
                  </TButton>
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
        </TButton>
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
    
    </TView>
  );


  return (
    <TView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {onboardingCompleted ? MainPage : (() => {

        return LoginPage;
        /*switch (page) {
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
          default:
            return pageOne;
        }*/
      })()}
    </TView>
  );
}

const styles = StyleSheet.create({
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
});