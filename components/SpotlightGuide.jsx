// SpotlightGuide.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';

const SpotlightGuide = ({ targetRef, onPress, message }) => {
  const [spotlightPosition] = useState(new Animated.Value(0));
  const [targetMeasures, setTargetMeasures] = useState(null);

  useEffect(() => {
    if (targetRef?.current) {
      targetRef.current.measureInWindow((x, y, width, height) => {
        setTargetMeasures({ x, y, width, height });
      });
    }

    Animated.sequence([
      Animated.timing(spotlightPosition, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [targetRef]);

  if (!targetMeasures) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <Animated.View
        style={[
          styles.spotlight,
          {
            top: targetMeasures.y - 10,
            left: targetMeasures.x - 10,
            width: targetMeasures.width + 20,
            height: targetMeasures.height + 20,
            opacity: spotlightPosition,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchableArea}
          onPress={onPress}
        >
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  spotlight: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  touchableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    position: 'absolute',
    bottom: -60,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  message: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SpotlightGuide;