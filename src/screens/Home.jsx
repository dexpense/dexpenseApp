import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Main from './Main';
import {useIsFocused} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const checkData = async () => {
    const accounts = JSON.parse(await EncryptedStorage.getItem('accounts'));
    if (accounts === null) {
      await EncryptedStorage.setItem('accounts', JSON.stringify([]));
    }
    const transactions = JSON.parse(
      await EncryptedStorage.getItem('transactions'),
    );
    if (transactions === null) {
      await EncryptedStorage.setItem('transactions', JSON.stringify([]));
    }
    const vehicles = JSON.parse(await EncryptedStorage.getItem('vehicles'));
    if (vehicles === null) {
      await EncryptedStorage.setItem('vehicles', JSON.stringify([]));
    }
    const fueling = JSON.parse(await EncryptedStorage.getItem('fueling'));
    if (fueling === null) {
      await EncryptedStorage.setItem('fueling', JSON.stringify([]));
    }
    const notes = JSON.parse(await EncryptedStorage.getItem('notes'));
    if (notes === null) {
      await EncryptedStorage.setItem('notes', JSON.stringify([]));
    }
  };

  useEffect(() => {
    checkData();
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <Main navigation={navigation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
