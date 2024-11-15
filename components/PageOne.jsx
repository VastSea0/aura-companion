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