import { Image, StyleSheet, Platform, Animated, ScrollView, TextInput } from 'react-native';
import React from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { TText } from '@/components/TText';
import { TView } from '@/components/TView';
import { TButton } from '@/components/TButton';

export default function HomeScreen() {
  const [page, setPage] = React.useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = React.useState(false);
  const [selectedAvatar, setSelectedAvatar] = React.useState(null);
  const [avatarMessage, setAvatarMessage] = React.useState("Helo, you're welcome 🤠!");
  const [avatarName, onChangeText] = React.useState('Enter your avatar name');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
 


  const handleCompleteOnboarding = () => { 
    setOnboardingCompleted(true);
   
  }

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

          {
          /*

                Burada spesifik avatarlar olacak.

                Yana kaydıralabilir bir liste olabilir.

                seçilen avatarınn border'ı değişecek.

                */}
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
          borderRadius: 20, // Daha yuvarlak köşeler
          margin: 16,
          // Düşünce balonu gölgesi
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          // Düşünce balonu kuyruk pozisyonu için margin
          marginBottom: 30,
          // Pozisyon ayarı
          position: 'relative',
        }}
      >
        <TButton
          type="title" 
          style={{
            color: '#000000',
          }}
        >
          <TText
            type="title"
            style={{
              color: '#000000',
            }}
          >
         {avatarName} says: {avatarMessage},
          </TText>
        </TButton>
        
        {/* Düşünce balonu kuyrukları */}
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
          default:
            return pageOne;
        }
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