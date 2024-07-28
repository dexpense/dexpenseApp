import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CustomTextInput = ({
  defaultValue,
  placeholder,
  value,
  onChangeText,
  type,
  secure,
  size,
  multiline,
  bgcolor,
  editable,
  maxLength,
  title,
  color,
  numberOfLines,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [isSecure, setIsSecure] = useState(secure);
  return (
    <View
      style={[
        styles.input,
        {
          width: size === 'small' ? 90 : Dimensions.get('window').width - 100,
          height:
            size === 'small'
              ? 40
              : size === 'medium'
              ? 100
              : size === 'large'
              ? 250
              : 50,
          marginRight: size === 'small' ? 5 : 0,
          borderColor: isFocused ? THEME_COLOR : '#9e9e9e',
          borderWidth: isFocused ? 1.5 : 1,
        },
      ]}>
      {title ? (
        <Text style={[styles.title, {color: color}]}>{title}</Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
          defaultValue={defaultValue ? defaultValue : value}
          placeholder={placeholder}
          value={value}
          editable={editable ? true : editable}
          onChangeText={text => onChangeText(text)}
          keyboardType={type ? type : 'default'}
          secureTextEntry={isSecure ? true : false}
          multiline={multiline ? true : false}
          numberOfLines={numberOfLines ? numberOfLines : 10}
          textAlignVertical={'top'}
          textAlign="left"
          placeholderTextColor={isFocused ? 'blueviolet' : THEME_COLOR}
          maxLength={maxLength ? maxLength : 500000}
          style={{
            color: 'black',
            backgroundColor: bgcolor ? bgcolor : 'transparent',
            width: '90%',
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => {
              setIsSecure(!isSecure);
            }}
            style={{paddingRight: 10}}>
            <Ionicons
              name={isSecure ? 'eye' : 'eye-off'}
              size={responsiveFontSize(2)}
              color={isSecure ? THEME_COLOR : 'red'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get('window').width - 100,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 10,
  },
  title: {
    alignSelf: 'flex-start',
    left: responsiveWidth(5),
    top: -responsiveHeight(1.2),
    position: 'absolute',
    backgroundColor: 'white',
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
  },
});
