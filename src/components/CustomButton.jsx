import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {THEME_COLOR} from '../utils/Colors';

const CustomButton = ({
  title,
  btnDisable,
  onClick,
  color,
  size,
  fontSize,
  fontColor,
  marginBottom,
  marginTop,
}) => {
  return (
    <TouchableOpacity
      disabled={btnDisable}
      style={[
        styles.btn,
        {
          backgroundColor: btnDisable ? 'red' : color ? color : THEME_COLOR,
          width:
            size === 'xsmall'
              ? 70
              : size === 'small'
              ? 90
              : size === 'medium'
              ? 110
              : Dimensions.get('window').width - 100,
          height: size === 'xsmall' ? 35 : size === 'small' ? 40 : 50,
          paddingLeft: size === 'xsmall' ? 2 : size === 'small' ? 2.5 : 10,
          paddingRight: size === 'xsmall' ? 2 : size === 'small' ? 2.5 : 10,
          marginRight: size === 'small' ? 5 : 0,
          marginBottom: marginBottom ? marginBottom : 5,
          marginTop: marginTop ? marginTop : 5,
        },
      ]}
      onPress={() => onClick()}>
      <Text
        style={{
          color: fontColor ? fontColor : 'white',
          fontSize: fontSize ? fontSize : 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    width: Dimensions.get('window').width - 100,
    height: 50,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
});
