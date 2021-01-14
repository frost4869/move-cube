/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VerticalSlider from 'rn-vertical-slider';

const WIDTH = Dimensions.get('screen').width;

const SQUARE_SIZE = 50;
const MAX_DURATION = 2000; // 2s
const STEPS = MAX_DURATION / 4;
const SLIDER_WIDTH = WIDTH * 0.8;
const SLIDER_HEIGHT = 70;
const SETTING_BUTTON_SIZE = 40;
const SPEED_INDICATOR_WIDTH = 90;

const SPEEDS = {
  0: 'Fastest',
  1: 'Fast',
  2: 'Medium',
  3: 'Slow',
  4: 'Slowest',
};

const App: () => React$Node = () => {
  const coord = useRef(new Animated.ValueXY({x: 200, y: 200})).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = useRef(new Animated.Value(0)).current; // slider hiding

  const [speed, setSpeed] = useState(MAX_DURATION / 2);
  const speedAnimatedValue = useRef(new Animated.Value(speed)).current;
  const [isOpenSlider, setIsOpenSlider] = useState(false);

  const handleTouch = (event) => {
    const {locationX: x, locationY: y} = event.nativeEvent;
    Animated.parallel([
      Animated.timing(coord, {
        duration: speed,
        toValue: {x, y},
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotate.setValue(0);
    });
  };

  const handleSliderValueChanged = (value) => {
    setSpeed(value);
    speedAnimatedValue.setValue(value);
  };

  const handleToggleSpeedSlider = () => {
    Animated.timing(sliderAnimatedValue, {
      toValue: isOpenSlider ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpenSlider(!isOpenSlider);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          {/* TOUCH ZONE */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleTouch}
            style={styles.touchZone}>
            <Animated.View
              style={{
                ...styles.square,
                position: 'absolute',
                transform: [
                  {translateX: coord.x},
                  {translateY: coord.y},
                  {translateX: -SQUARE_SIZE / 2},
                  {translateY: -SQUARE_SIZE / 2},
                  {
                    rotate: rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            />
          </TouchableOpacity>

          {/* SPEED SETTING SLIDER FROM EDGE */}
          <Animated.View
            style={{
              ...styles.sliderSettingContainer,
              ...styles.shadow,
              transform: [
                {
                  translateX: sliderAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-SLIDER_HEIGHT, 0],
                  }),
                },
              ],
            }}>
            {/* SLIDER */}
            <VerticalSlider
              value={speed}
              min={0}
              max={MAX_DURATION}
              onChange={handleSliderValueChanged}
              width={SLIDER_HEIGHT}
              height={SLIDER_WIDTH}
              step={STEPS}
              minimumTrackTintColor={'gray'}
              maximumTrackTintColor={'tomato'}
              showBallIndicator={false}
              ballIndicatorPosition={0}
              borderRadius={0}
            />

            {/* <View
              style={{
                width: SPEED_INDICATOR_WIDTH,
                overflow: 'hidden',
                marginLeft: 8,
              }}>
              <Animated.View
                style={{
                  flexDirection: 'row',
                  transform: [
                    {
                      translateX: (speed / STEPS) * -SPEED_INDICATOR_WIDTH,
                    },
                  ],
                }}>
                {Object.values(SPEEDS).map((e, i) => (
                  <Text key={i} style={styles.stepIndicator}>
                    {e}
                  </Text>
                ))}
              </Animated.View>
            </View> */}
            {/* SETTING BUTTON */}
            <Pressable
              style={styles.settingBtn}
              onPress={handleToggleSpeedSlider}>
              <Icon name="settings" size={24} />
            </Pressable>
          </Animated.View>
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
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    backgroundColor: '#fff',
    transform: [
      {rotate: '-90deg'},
      {
        translateY: -(
          SLIDER_WIDTH / 2 +
          SLIDER_HEIGHT / 2 +
          SETTING_BUTTON_SIZE
        ),
      },
      {
        translateX: -(SLIDER_WIDTH / 2 - SLIDER_HEIGHT / 2),
      },
    ],
  },
  stepIndicator: {
    letterSpacing: 1.2,
    height: 20,
    fontWeight: 'bold',
    width: SPEED_INDICATOR_WIDTH,
    textAlign: 'center',
    backgroundColor: 'red',
  },
  settingBtn: {
    backgroundColor: '#fff',
    width: SETTING_BUTTON_SIZE,
    height: SETTING_BUTTON_SIZE,

    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderSettingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});

export default App;
