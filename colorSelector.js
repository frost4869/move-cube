import BottomSheet from '@gorhom/bottom-sheet';
import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity as NativeTouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const HEIGHT = Dimensions.get('screen').height;

const random_rgba = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')'
  );
};
const RANDOM_COLORS = Array.from(Array(10), (e, i) => random_rgba());
RANDOM_COLORS.unshift('#ef4f4f');

const CubeComponent = Platform.select({
  ios: NativeTouchableOpacity,
  android: TouchableOpacity,
});

const ColorSelector = ({handleChangeColor}) => {
  const snapPoints = useMemo(() => ['2%', '20%'], []);

  const [selectedColor, setColor] = useState(RANDOM_COLORS[0]);
  const onColorChange = (color) => {
    setColor(color);
    handleChangeColor(color);
  };
  return (
    <BottomSheet index={0} snapPoints={snapPoints}>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RANDOM_COLORS.map((color, index) => (
            <CubeComponent
              key={index}
              activeOpacity={0.8}
              style={{
                ...styles.cube,
                backgroundColor: color,
                borderWidth: color === selectedColor ? 5 : 0,
              }}
              onPress={() => onColorChange(color)}
            />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  cube: {
    width: HEIGHT * 0.1,
    height: HEIGHT * 0.1,
    borderRadius: 5,
    marginHorizontal: 16,
    borderColor: '#000',
  },
});

export default ColorSelector;
