import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {THEME_COLOR} from '../utils/Colors';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {useGlobalContext} from '../context/Store';

const BottomBar = () => {
  const {activeTab, setActiveTab} = useGlobalContext();

  const navigation = useNavigation();
  useEffect(() => {}, [activeTab]);
  return (
    <View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            setActiveTab(0);
            navigation.navigate('Home');
          }}>
          <MaterialCommunityIcons
            name="view-dashboard"
            size={40}
            color={activeTab == 0 ? 'purple' : THEME_COLOR}
          />
          <Text
            style={[
              styles.bottomText,
              {color: activeTab == 0 ? 'purple' : THEME_COLOR},
            ]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(1);
            navigation.navigate('Home');
          }}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="fuel"
            size={40}
            color={activeTab == 1 ? 'purple' : THEME_COLOR}
          />
          <Text
            style={[
              styles.bottomText,
              {
                color: activeTab == 1 ? 'purple' : THEME_COLOR,
                textAlign: 'center',
              },
            ]}>
            Fueling
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(2);
            navigation.navigate('Home');
          }}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="account-cash"
            size={40}
            color={activeTab == 2 ? 'purple' : THEME_COLOR}
          />
          <Text
            style={[
              styles.bottomText,
              {
                color: activeTab == 2 ? 'purple' : THEME_COLOR,
                textAlign: 'center',
              },
            ]}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(3);
            navigation.navigate('Home');
          }}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <Fontisto
            name="onenote"
            size={40}
            color={activeTab == 3 ? 'purple' : THEME_COLOR}
          />
          <Text
            style={[
              styles.bottomText,
              {
                color: activeTab == 3 ? 'purple' : THEME_COLOR,
                textAlign: 'center',
              },
            ]}>
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(4);
            navigation.navigate('Home');
          }}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome6
            name="user-gear"
            size={40}
            color={activeTab == 4 ? 'purple' : THEME_COLOR}
          />
          <Text
            style={[
              styles.bottomText,
              {
                color: activeTab == 4 ? 'purple' : THEME_COLOR,
                textAlign: 'center',
              },
            ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomBar;

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
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
  },
  bottomText: {
    fontSize: responsiveFontSize(2),
    color: THEME_COLOR,
    textAlign: 'center',
  },
});
