/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VerticalSlider from 'rn-vertical-slider';
import ColorSelector from './colorSelector';

const WIDTH = Dimensions.get('screen').width;

const SQUARE_SIZE = 50;
const MAX_DURATION = 2000;
const MIN_DURATION = 150;
const STEPS = (MAX_DURATION - MIN_DURATION) / 4;
const SLIDER_WIDTH = 70;
const SLIDER_HEIGHT = WIDTH * 0.8;
const SETTING_BUTTON_SIZE = 50;
const TRAILS = 10; // number of after images, 4 - 10 is optimal, dont use too much

// reverse slider value
const SPEEDS = {
  4: 'Fastest',
  3: 'Fast',
  2: 'Medium',
  1: 'Slow',
  0: 'Slowest',
};

const App: () => React$Node = () => {
  // create array of cubes animation value to implement trails effect
  const animatedValueArray = Array.from(
    Array(TRAILS),
    (e, i) => useRef(new Animated.ValueXY({x: 200, y: 200})).current,
  );

  const rotate = useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = useRef(new Animated.Value(0)).current;
  const zoomAnimatedValue = useRef(new Animated.Value(0)).current;

  const [speed, setSpeed] = useState(MIN_DURATION);
  const [isOpenSlider, setIsOpenSlider] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [color, setColor] = useState('#ef4f4f');

  let timer = useRef(null);

  // zoom the slider a bit when sliding
  useEffect(() => {
    if (isSliding) {
      Animated.timing(zoomAnimatedValue, {
        duration: 150,
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(zoomAnimatedValue, {
        duration: 150,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isSliding]);

  // slide in out animation
  useEffect(() => {
    Animated.timing(sliderAnimatedValue, {
      toValue: isOpenSlider ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpenSlider]);

  const handleTouch = (event) => {
    // close slider when touch out side
    clearTimeout(timer.current);
    setIsOpenSlider(false);

    // start cube animation
    const {locationX: x, locationY: y} = event.nativeEvent;

    // create array of timing animation for each after images
    const animations = animatedValueArray.map((e, index) => {
      return Animated.timing(animatedValueArray[index], {
        duration: MAX_DURATION + MIN_DURATION - speed, // reverse slider value
        toValue: {x, y},
        useNativeDriver: true,
      });
    });

    // run array of cube animations with 50ms delay to acheive trail effect
    Animated.parallel([
      Animated.stagger(50, animations).start(),
      Animated.timing(rotate, {
        toValue: 1,
        duration: MAX_DURATION + MIN_DURATION - speed,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotate.setValue(0);
    });
  };

  // called when sliding
  const handleSliderValueChanged = (value) => {
    if (!isSliding) {
      setIsSliding(true);
    }
    clearTimeout(timer.current);
    setSpeed(value);
  };
  // called when finished slide
  const onSliderCompleted = () => {
    setIsSliding(false);
    timer.current = setTimeout(() => {
      setIsOpenSlider(false);
    }, 1500); // hide slider after finished sliding
  };

  // handle toggle slider in / out
  const handleToggleSpeedSlider = () => {
    setIsOpenSlider(!isOpenSlider);
  };

  // animated values here
  const squareRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const sliderTranslateX = sliderAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SLIDER_WIDTH, 8],
  });

  const speedLevel = useMemo(
    () => ((speed - MIN_DURATION) / STEPS).toFixed(0),
    [speed],
  );

  const changeColor = (color) => {
    setColor(color);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* TOUCH ZONE */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTouch}
          style={styles.touchZone}>
          {/* CUBE */}
          {Array.from(Array(TRAILS), (e, i) => (
            <Animated.View
              key={i}
              style={{
                ...styles.square,
                width: SQUARE_SIZE * Math.pow(0.8, i),
                height: SQUARE_SIZE * Math.pow(0.8, i),
                opacity: Math.pow(0.85, i),
                backgroundColor: color,
                transform: [
                  {translateX: animatedValueArray[i].x},
                  {translateY: animatedValueArray[i].y},
                  {translateX: (-SQUARE_SIZE * Math.pow(0.8, i)) / 2},
                  {translateY: (-SQUARE_SIZE * Math.pow(0.8, i)) / 2},
                  {rotate: squareRotate},
                ],
              }}
            />
          ))}
        </TouchableOpacity>

        {/* SPEED SETTING SLIDER FROM EDGE */}
        <Animated.View
          style={{
            ...styles.sliderSettingContainer,
            transform: [
              {translateX: sliderTranslateX},
              {scale: zoomAnimatedValue},
            ],
          }}>
          {/* SLIDER */}
          <View style={{height: isOpenSlider ? '100%' : 0}}>
            <VerticalSlider
              min={MIN_DURATION}
              max={MAX_DURATION}
              step={1}
              onChange={handleSliderValueChanged}
              onComplete={onSliderCompleted}
              width={SLIDER_WIDTH}
              height={SLIDER_HEIGHT}
              minimumTrackTintColor={'#929aab'}
              maximumTrackTintColor={'#393e46'}
              showBallIndicator={false}
              borderRadius={0}
            />
            <Text style={styles.speedText}>{SPEEDS[speedLevel]}</Text>
          </View>

          {/* SETTING BUTTON */}
          <Pressable
            style={{
              ...styles.shadow,
              ...styles.settingBtn,
              ...Platform.select({android: styles.shadow}), // fix android shadow
            }}
            onPress={handleToggleSpeedSlider}>
            <Icon name="settings" size={24} />
          </Pressable>
        </Animated.View>

        {/* COLOR SELECTOR */}
        <ColorSelector handleChangeColor={changeColor} />
      </View>
      <SafeAreaView style={{backgroundColor: '#fff'}} />
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
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 5,
    position: 'absolute',
  },
  settingBtn: {
    backgroundColor: '#fff',
    width: SETTING_BUTTON_SIZE,
    height: SETTING_BUTTON_SIZE,

    borderTopEndRadius: SETTING_BUTTON_SIZE / 2,
    borderBottomEndRadius: SETTING_BUTTON_SIZE / 2,
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
  speedText: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 10,
      android: -20,
    }), // android overflow not showing bug
    fontWeight: 'bold',
    color: Platform.select({
      android: '#393e46',
      ios: '#eeeeee',
    }),
    textAlign: 'center',
    width: '100%',
  },
});

export default App;
