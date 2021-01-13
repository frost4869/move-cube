/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import Slider from '@react-native-community/slider';
import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const WIDTH = Dimensions.get('screen').width;

const SQUARE_SIZE = 50;
const MAX_DURATION = 2000; // 2s
const STEPS = 5;

const SPEEDS = {
  0: 'Fastest',
  1: 'Fast',
  2: 'Medium',
  3: 'Slow',
  4: 'Slowest',
};

const App: () => React$Node = () => {
  const coord = useRef(new Animated.ValueXY({x: 200, y: 200})).current;
  const [speed, setSpeed] = useState(MAX_DURATION / 2);

  const handleTouch = (event) => {
    const {locationX: x, locationY: y} = event.nativeEvent;
    Animated.timing(coord, {
      duration: speed,
      toValue: {x, y},
      useNativeDriver: true,
    }).start();
  };

  const handleSliderValueChanged = (value) => {
    setSpeed(value || 80); // fast enough to be snappy, but no so fast as instantly (0)
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleTouch}
            style={styles.touchZone}>
            <Text style={{textAlign: 'center', margin: 10}}>Touch Zone</Text>

            <Animated.View
              style={{
                ...styles.square,
                position: 'absolute',
                transform: [
                  {translateX: coord.x},
                  {translateY: coord.y},
                  {translateX: -SQUARE_SIZE / 2},
                  {translateY: -SQUARE_SIZE / 2},
                ],
              }}
            />
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <View style={styles.stepHintContainer}>
              {Array.from(Array(STEPS), (e, index) => (
                <View key={index} style={styles.dot}>
                  <Text style={styles.stepIndicator}>{SPEEDS[index]}</Text>
                </View>
              ))}
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={MAX_DURATION}
              minimumTrackTintColor="#bf0000"
              maximumTrackTintColor="#000000"
              thumbTintColor="#7b7cac"
              step={MAX_DURATION / (STEPS - 1)}
              tapToSeek={true}
              value={speed}
              onValueChange={handleSliderValueChanged}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchZone: {
    flex: 1,
    width: '100%',
    backgroundColor: 'whitesmoke',
  },
  square: {
    backgroundColor: '#bf0000',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 5,
  },
  slider: {
    width: WIDTH * 0.8,
    height: 40,
  },
  sliderContainer: {
    marginTop: 20,
  },
  stepHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...StyleSheet.absoluteFill,
    bottom: 60,
  },
  dot: {
    height: 40,
    width: (WIDTH * 0.8) / 6,
  },
  stepIndicator: {
    color: '#000',
    textAlign: 'center',
  },
});

export default App;
