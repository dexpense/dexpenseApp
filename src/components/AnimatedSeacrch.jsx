import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {THEME_COLOR} from '../utils/Colors';
const AnimatedSeacrch = ({
  placeholder,
  value,
  onChangeText,
  type,
  secure,
  onClick,
  multiline,
  bgcolor,
  editable,
  func,
}) => {
  const animation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value === 1
          ? withTiming(300, {duration: 500})
          : withTiming(0, {duration: 500}),
    };
  });
  const [animationValue, setAnimationValue] = useState(0);
  return (
    <View style={{flex: 1, marginTop: responsiveHeight(0.5)}}>
      <Animated.View
        style={[
          {
            width: responsiveWidth(85),
            height: responsiveHeight(5),
            backgroundColor: '#E7E7E7',
            borderRadius: responsiveWidth(2),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          },
          animatedStyle,
        ]}>
        <TextInput
          placeholder={placeholder}
          value={value}
          editable={editable ? true : editable}
          onChangeText={text => onChangeText(text)}
          keyboardType={type ? type : 'default'}
          secureTextEntry={secure ? secure : false}
          multiline={multiline ? true : false}
          numberOfLines={10}
          textAlignVertical={'top'}
          placeholderTextColor={'chocolate'}
          style={{
            color: 'black',
            backgroundColor: bgcolor ? bgcolor : 'transparent',
            width: '85%',
            paddingLeft: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (animation.value === 1) {
              animation.value = 0;
              setAnimationValue(0);
              if (func) {
                func();
              }
            } else {
              animation.value = 1;
              setAnimationValue(1);
              if (onClick) {
                onClick();
              }
            }
          }}>
          <Image
            source={
              animationValue === 1
                ? require('../assets/images/clear.png')
                : require('../assets/images/search.png')
            }
            style={{
              width: responsiveWidth(5),
              height: responsiveWidth(5),
              tintColor: THEME_COLOR,
            }}
          />
        </TouchableOpacity>
      </Animated.View>
      <Text
        style={{
          color: 'chocolate',
          fontSize: responsiveFontSize(1.2),
          alignSelf: 'center',
          textAlign: 'center',
          marginTop: responsiveHeight(0.2),
        }}>
        {placeholder}
      </Text>
    </View>
  );
};

export default AnimatedSeacrch;

const styles = StyleSheet.create({});
