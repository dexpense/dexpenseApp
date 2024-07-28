import {
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../components/Loader';
import {useIsFocused} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import uuid from 'react-native-uuid';
import {useGlobalContext} from '../context/Store';
import axios from 'axios';
const Login = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {setState} = useGlobalContext();
  const docId = uuid.v4();
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(true);
  const [inputField, setInputField] = useState({
    name: '',
    email: '',
  });
  const [errField, setErrField] = useState({
    nameErr: '',
    emailErr: '',
  });

  const validForm = () => {
    let formIsValid = true;
    setErrField({
      nameErr: '',
      emailErr: '',
    });
    if (inputField.name === '') {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        nameErr: 'Please Enter Name',
      }));
    }
    if (inputField.email === '' || !ValidateEmail(inputField.email)) {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        emailErr: 'Please Enter Email',
      }));
    }

    return formIsValid;
  };

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)) {
      return true;
    }
    // alert("You have entered an invalid email address!");
    return false;
  }

  const submitForm = async () => {
    if (validForm()) {
      setVisible(true);
      EncryptedStorage.setItem(
        'user',
        JSON.stringify({
          USER: {
            name: inputField.name.toUpperCase(),
            id: docId,
            email: inputField.email,
          },
          LOGGEDAT: Date.now(),
        }),
        setState({
          USER: {
            name: inputField.name.toUpperCase(),
            id: docId,
            email: inputField.email,
          },
          LOGGEDAT: Date.now(),
        }),
        navigation.navigate('Home'),
      );
    } else {
      showToast('error', 'Form Is Invalid');
    }
  };

  const showToast = (type, text, text2) => {
    Toast.show({
      type: type,
      text1: text,
      text2: text2,
      visibilityTime: 1500,
      position: 'top',
      topOffset: 500,
    });
  };

  const checkLogin = async () => {
    const user = await EncryptedStorage.getItem('user');
    if (user) {
      navigation.navigate('Home');
    }
  };
  useEffect(() => {}, [inputField]);
  useEffect(() => {
    checkLogin();
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold On!', 'Are You Sure To Exit App?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME_COLOR} barStyle={'light-content'} />
      <Image source={require('../images/bg.jpg')} style={styles.banner} />

      <View style={styles.card}>
        <Toast />
        <Text style={styles.title}>Login</Text>

        <CustomTextInput
          value={inputField.name}
          placeholder={'Enter Your Name'}
          onChangeText={text => {
            setInputField({...inputField, name: text});
          }}
        />
        {errField.nameErr.length > 0 && (
          <Text style={styles.textErr}>{errField.nameErr}</Text>
        )}
        <CustomTextInput
          value={inputField.email}
          placeholder={'Enter Your Email'}
          type={'email-address'}
          onChangeText={text => {
            setInputField({...inputField, email: text});
            if (inputField.name.length >= 5 && ValidateEmail(text)) {
              setDisable(false);
            } else {
              setDisable(true);
            }
          }}
        />
        {errField.emailErr.length > 0 && (
          <Text style={styles.textErr}>{errField.emailErr}</Text>
        )}

        <CustomButton
          title="Submit"
          btnDisable={disable}
          onClick={submitForm}
        />
      </View>
      <Loader visible={visible} />
      <Toast />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: responsiveWidth(100),
    height: responsiveHeight(28),
  },
  card: {
    width: responsiveWidth(90),
    height: responsiveHeight(100),
    backgroundColor: 'white',
    position: 'absolute',
    top: responsiveHeight(20),
    elevation: 5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.7,
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '500',
    marginTop: responsiveHeight(3),
    color: THEME_COLOR,
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1),
    fontWeight: '400',
    marginTop: 5,
    color: THEME_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textErr: {
    fontSize: responsiveFontSize(2),
    color: 'red',
    alignSelf: 'center',
    marginTop: responsiveHeight(4),
  },
  account: {
    marginLeft: responsiveWidth(2),
    color: THEME_COLOR,
    fontWeight: '600',
    fontSize: responsiveFontSize(2),
  },
});
