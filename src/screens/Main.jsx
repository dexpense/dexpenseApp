import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME_COLOR} from '../utils/Colors';
import Bike from './Bike';
import CashBook from './CashBook';
import NoteBook from './NoteBook';
import Dashboard from './Dashboard';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ChangeUP from './ChangeUP';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RNExitApp from 'react-native-exit-app';
import {useGlobalContext} from '../context/Store';
import BottomBar from './BottomBar';
const Main = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {state, activeTab, setActiveTab} = useGlobalContext();
  const [userName, setUserName] = useState('');
  const getDetails = async () => {
    const user = JSON.parse(await EncryptedStorage.getItem('user'))?.USER;
    if (user) {
      setUserName(user);
    } else {
      setUserName({
        name: 'Expense App',
      });
    }
  };
  const refresh = () => {
    setActiveTab(0);
  };

  const showConfirmDialog = () => {
    return Alert.alert(
      'Hold On!',
      'Are You Sure? This Can Delete All App Data',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Cancel',
          onPress: () => showToast('success', 'User Not Logged Out'),
        },

        {
          text: 'Yes, Only Logout',
          onPress: async () => {
            await EncryptedStorage.removeItem('user');
            navigation.navigate('Splash');
          },
        },

        // The "Yes" button
        {
          text: 'Yes, Delete All Data',
          onPress: async () => {
            await EncryptedStorage.clear();

            navigation.navigate('Splash');
          },
        },
      ],
    );
  };

  const [backPressCount, setBackPressCount] = useState(0);

  const handleBackPress = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
    } else if (backPressCount === 1) {
      RNExitApp.exitApp();
    }
    return true;
  }, [backPressCount]);

  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);
  useEffect(() => {
    getDetails();
    // refresh();
  }, [isFocused, userName]);
  useEffect(() => {}, [activeTab]);
  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 1500,
      position: 'top',
      topOffset: 500,
    });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}
          onPress={() => refresh()}>
          <Image
            source={require('../images/logo.png')}
            style={{width: 60, height: 60}}
          />
          <Text style={styles.title}>{`${state.USER?.name.slice(
            0,
            15,
          )}'s\nExpense App`}</Text>
          <TouchableOpacity
            onPress={async () => {
              showConfirmDialog();
            }}>
            <MaterialCommunityIcons name="logout" size={40} color={'red'} />
            <Text style={{color: 'red'}}>Log Out</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, marginTop: 60}}>
        {activeTab === 0 ? (
          <Dashboard />
        ) : activeTab === 1 ? (
          <Bike />
        ) : activeTab === 2 ? (
          <CashBook />
        ) : activeTab === 3 ? (
          <NoteBook />
        ) : activeTab === 4 ? (
          <ChangeUP />
        ) : null}
      </View>
      <BottomBar />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: responsiveHeight(8.5),
    width: responsiveWidth(100),
    backgroundColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
  },
  bottomText: {
    fontSize: responsiveFontSize(2),
    color: THEME_COLOR,
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    width: responsiveWidth(100),
    height: responsiveHeight(8.5),
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'black',
    borderBottomLeftRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    padding: 5,
    marginBottom: responsiveHeight(2),
  },
  title: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
    color: THEME_COLOR,
  },
});
