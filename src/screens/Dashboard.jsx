import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Loader from '../components/Loader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {getSubmitDateInput} from '../modules/calculatefunctions';
const Dashboard = () => {
  const isFocused = useIsFocused();
  const {state} = useGlobalContext();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const getDetails = async () => {
    setShowLoader(true);
    const user = JSON.parse(await EncryptedStorage.getItem('user'))?.USER;
    if (user) {
      setUserName(user);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      console.log('user not found');
      await EncryptedStorage.clear();
      navigation.navigate('Splash');
    }
  };

  useEffect(() => {
    getDetails();
  }, [isFocused]);
  useEffect(() => {}, [userName]);
  return (
    <View style={{flex: 1, marginTop: responsiveHeight(1)}}>
      {showLoader ? (
        <Loader visible={showLoader} />
      ) : (
        <ScrollView style={{flex: 1, marginTop: responsiveHeight(1)}}>
          <ScrollView style={{marginBottom: responsiveHeight(10)}}>
            <Text style={styles.title}>WELCOME {state.USER?.name}!</Text>

            <Text style={styles.title}>
              Logged At{' '}
              {getSubmitDateInput(
                new Date(state.LOGGEDAT).toLocaleDateString(),
              )}{' '}
              at {new Date(state.LOGGEDAT).toLocaleString().split(',')[1]}
            </Text>
            <Text style={styles.title}>
              Using This App You Can Manage your daily Needs.
            </Text>
            <Text style={styles.title}>This App has three sections.</Text>
            <Text style={styles.title}>1. Fueling:</Text>
            <Text style={styles.title}>
              Here You Can Manage and Track your Vehicle fuelings easily. Just
              Add Your Vehicle with a few necessary details. After Entering to
              that particular Vehicle Section, Put Fuel Price and Fuel Quantity
              or Amount. You will get all details.
            </Text>
            <Text style={styles.title}>2. Expense:</Text>
            <Text style={styles.title}>
              Here You Can Manage and Track your Expense easily. Just Add Your
              Account with a few necessary details. After Entering to that
              particular Account Section, Submit desired Expenses.
            </Text>
            <Text style={styles.title}>3. Notes:</Text>
            <Text style={styles.title}>
              Here You Can Manage and Track your Daily To Do List or Important
              Notes easily.
            </Text>
            <Text style={styles.title}>
              You can easily Edit or Delete You Entered Data.
            </Text>
            <Text style={styles.title}>
              In Case Of Facing Any Difficulty Email Me
            </Text>
            <Text style={styles.title}>trackerexpense0@gmail.com</Text>
            <Text style={styles.title}>
              All Your Data Stored In App's Database is Secured in Encrypted
              Format with Strict Policy. No Personal Data will be shared to
              Anybody.
            </Text>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '500',
    padding: responsiveWidth(1),
    color: THEME_COLOR,
    marginTop: responsiveHeight(1),
    textAlign: 'center',
  },
});
