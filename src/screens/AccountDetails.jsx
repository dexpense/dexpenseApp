import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {THEME_COLOR} from '../utils/Colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader';
import {
  round2dec,
  getDay,
  getFullYear,
  getMonthName,
  IndianFormat,
  compareObjects,
} from '../modules/calculatefunctions';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
const {width, height} = Dimensions.get('window');
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import BottomBar from './BottomBar';
const AccountDetails = () => {
  const {
    stateObject,
    setStateObject,
    fuelingState,
    setFuelingState,
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
  } = useGlobalContext();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  let data = stateObject;
  const fetchedAmount =
    data.amount < 0
      ? parseFloat(round2dec(data.amount * -1) * -1)
      : parseFloat(round2dec(data.amount));

  const docId = uuid.v4();
  const [showLoader, setShowLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [recentTransaction, setRecentTransaction] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showTransactionAdd, setShowTransactionAdd] = useState(false);
  const [transactionType, setTransactionType] = useState('Debit');
  const [isEnabled, setIsEnabled] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [totalExpense, setTotalExpense] = useState('');
  const [showTransactions, setShowTransactions] = useState(true);
  const [editAmount, setEditAmount] = useState('');
  const [editTransactionType, setEditTransactionType] = useState('Debit');
  const [editIsEnabled, setEditIsEnabled] = useState(true);
  const [editPurpose, setEditPurpose] = useState('');
  const [editID, setEditID] = useState('');
  const [originalData, setOriginalData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [prevAmount, setPrevAmount] = useState('');
  const [prevTransactionType, setPrevTransactionType] = useState('');
  const [visibleItems, setVisibleItems] = useState(5);

  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [editDate, setEditDate] = useState(new Date());
  const [editOpen, setEditOpen] = useState(false);

  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setDate(currentSelectedDate);

    setFontColor('black');
  };
  const editCalculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setEditOpen('');
    setEditDate(currentSelectedDate);
    setEditedData({...editedData, date: Date.parse(currentSelectedDate)});
    setFontColor('black');
  };

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
  };
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      setTransactionType('Debit');
    } else {
      setTransactionType('Credit');
    }
  };
  const editToggleSwitch = () => {
    setEditIsEnabled(!editIsEnabled);
    if (editIsEnabled) {
      setEditTransactionType('Debit');
      setEditedData({...editedData, transactionType: 'Debit'});
    } else {
      setEditTransactionType('Credit');
      setEditedData({...editedData, transactionType: 'Credit'});
    }
  };
  const submitData = async () => {
    if (amount > 0 && purpose !== '') {
      setShowLoader(true);
      const transactions = [
        ...transactionState,
        {
          date: Date.parse(date),
          id: docId,
          accountName: data.accountName,
          accountID: data.id,
          addedBy: data.addedBy,
          email: data.email,
          amount: round2dec(parseFloat(amount)),
          purpose: purpose,
          transactionType: transactionType,
          previousAmount: fetchedAmount,
          currentAmount:
            transactionType === 'Debit'
              ? round2dec(fetchedAmount - parseFloat(amount))
              : round2dec(fetchedAmount + parseFloat(amount)),
          upLoadedAt: '',
          downLoadedAt: '',
          modifiedAt: '',
        },
      ];
      setTransactionState(transactions);
      getTransactions();

      await EncryptedStorage.setItem(
        'transactions',
        JSON.stringify(transactions),
      ).then(async () => {
        const exceptThisAccount = accountState.filter(
          item => item.id !== data.id,
        );
        const thisAccount = accountState.filter(item => item.id === data.id)[0];
        thisAccount.date = Date.parse(date);
        thisAccount.amount =
          transactionType === 'Debit'
            ? round2dec(fetchedAmount - parseFloat(amount))
            : round2dec(fetchedAmount + parseFloat(amount));
        thisAccount.recentTransaction = round2dec(parseFloat(amount));
        const accounts = [...exceptThisAccount, thisAccount].sort(
          (a, b) => b.date - a.date,
        );
        setAccountState(accounts);
        setStateObject(thisAccount);
        await EncryptedStorage.setItem(
          'accounts',
          JSON.stringify(accounts),
        ).then(() => {
          setShowLoader(false);
          showToast('success', 'Data Added Successfully');
          // setTimeout(() => navigation.navigate('Home'), 1500);
          setDate(new Date());
        });
      });
    } else {
      showToast('error', 'Invalid Data');
    }
  };
  const getTransactions = async () => {
    setShowLoader(true);
    const thisAccountDetails = transactionState.filter(
      el => el.accountID === stateObject.id,
    );
    let newData = thisAccountDetails.sort((a, b) => b.date - a.date);
    let cost = 0;
    newData.map(el => {
      if (el.transactionType === 'Debit') {
        cost = cost - el.amount;
      } else {
        cost = cost + el.amount;
      }
      if (cost < 0) {
        cost = parseFloat(round2dec(cost * -1)) * -1;
      } else {
        cost = parseFloat(round2dec(cost));
      }
      return round2dec(cost);
    });
    setTotalExpense(cost);
    setShowLoader(false);
    setAllTransactions(newData);
    setRecentTransaction(parseFloat(data.recentTransaction));
  };

  const updateData = async () => {
    let amount = fetchedAmount;
    if (!compareObjects(originalData, editedData)) {
      setShowLoader(true);
      if (
        originalData.transactionType !== editedData.transactionType &&
        originalData.amount !== editedData.amount
      ) {
        console.log('Case 1');
        if (prevTransactionType === 'Debit') {
          if (fetchedAmount + parseFloat(editAmount) * 2 < 0) {
            amount =
              round2dec((fetchedAmount + parseFloat(editAmount) * 2) * -1) * -1;
          } else {
            amount = round2dec(fetchedAmount + parseFloat(editAmount) * 2);
          }
        } else {
          if (fetchedAmount - parseFloat(editAmount) * 2 < 0) {
            amount =
              round2dec((fetchedAmount - parseFloat(editAmount) * 2) * -1) * -1;
          } else {
            amount = round2dec(fetchedAmount - parseFloat(editAmount) * 2);
          }
        }
      } else if (
        originalData.transactionType !== editedData.transactionType &&
        originalData.amount === editedData.amount
      ) {
        console.log('Case 2');
        if (prevTransactionType === 'Debit') {
          if (fetchedAmount + parseFloat(editAmount) * 2 < 0) {
            amount =
              round2dec((fetchedAmount + parseFloat(editAmount) * 2) * -1) * -1;
          } else {
            amount = round2dec(fetchedAmount + parseFloat(editAmount) * 2);
          }
        } else {
          if (fetchedAmount - parseFloat(editAmount) * 2 < 0) {
            amount =
              round2dec((fetchedAmount - parseFloat(editAmount) * 2) * -1) * -1;
          } else {
            amount = round2dec(fetchedAmount - parseFloat(editAmount) * 2);
          }
        }
      } else if (
        originalData.transactionType === editedData.transactionType &&
        originalData.amount !== editedData.amount
      ) {
        console.log('Case 3');
        if (prevTransactionType === 'Debit') {
          if (
            fetchedAmount -
              parseFloat(originalData.amount) +
              parseFloat(editedData.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount +
                  parseFloat(originalData.amount) -
                  parseFloat(editedData.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount +
                parseFloat(originalData.amount) -
                parseFloat(editedData.amount),
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(originalData.amount) +
              parseFloat(editedData.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(originalData.amount) +
                  parseFloat(editedData.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(originalData.amount) +
                parseFloat(editedData.amount),
            );
          }
        }
      } else {
        console.log('Case 4');
        if (prevTransactionType === 'Debit') {
          if (
            fetchedAmount -
              parseFloat(originalData.amount) +
              parseFloat(editedData.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(originalData.amount) +
                  parseFloat(editedData.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(originalData.amount) +
                parseFloat(editedData.amount),
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(originalData.amount) -
              parseFloat(editedData.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(originalData.amount) -
                  parseFloat(editedData.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(originalData.amount) +
                parseFloat(editedData.amount),
            );
          }
        }
      }
      const exceptThisAccount = accountState.filter(
        item => item.id !== data.id,
      );
      const thisAccount = accountState.filter(item => item.id === data.id)[0];
      thisAccount.date = Date.parse(editDate);
      thisAccount.amount = amount;
      thisAccount.recentTransaction = parseFloat(editAmount);
      const accounts = [...exceptThisAccount, thisAccount].sort(
        (a, b) => b.date - a.date,
      );
      setAccountState(accounts);
      setStateObject(thisAccount);
      await EncryptedStorage.setItem('accounts', JSON.stringify(accounts))
        .then(async () => {
          const allTransactions = allTransactions.filter(
            item => item.id !== editID,
          );
          const thisTransaction = allTransactions.filter(
            item => item.id === editID,
          )[0];
          thisTransaction.purpose = editPurpose;
          thisTransaction.previousAmount = originalData.previousAmount;
          thisTransaction.currentAmount = amount;
          thisTransaction.amount = parseFloat(editAmount);
          thisTransaction.transactionType = editTransactionType;
          thisTransaction.date = Date.parse(editDate);
          setTransactionState(
            [...allTransactions, thisTransaction].sort(
              (a, b) => b.date - a.date,
            ),
          );
          setAllTransactions(
            [...allTransactions, thisTransaction].sort(
              (a, b) => b.date - a.date,
            ),
          );
          await EncryptedStorage.setItem(
            'transactions',
            JSON.stringify(
              [...allTransactions, thisTransaction].sort(
                (a, b) => b.date - a.date,
              ),
            ),
          )
            .then(() => {
              setShowLoader(false);
              showToast('success', 'Data Updated Successfully');
              // setTimeout(() => navigation.navigate('Home'), 1500);
              setEditDate(new Date());
            })
            .catch(e => {
              setShowLoader(false);
              showToast('error', 'Data Updation Failed');
              console.log(e);
            });
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', 'Data Updation Failed');
          console.log(e);
        });
    } else {
      showToast('error', 'Data is same');
      console.log('Data is same');
    }
  };

  const showConfirmDialog = (id, transactionType, amount, purpose) => {
    return Alert.alert('Hold On!', 'Are You Sure To Delete This Transaction?', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showToast('success', 'Transaction Not Deleted!'),
      },
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          deleteData(id, transactionType, amount, purpose);
        },
      },
    ]);
  };
  const deleteData = async (id, transactionType, amount, purpose) => {
    setShowLoader(true);
    setTransactionState(transactionState.filter(item => item.id !== id));

    await EncryptedStorage.setItem(
      'transactions',
      JSON.stringify(transactionState.filter(item => item.id !== id)),
    ).then(async () => {
      const exceptThisAccount = accountState.filter(
        item => item.id !== data.id,
      );
      const thisAccount = accountState.filter(item => item.id === data.id)[0];
      thisAccount.amount =
        transactionType === 'Debit'
          ? round2dec(parseFloat(fetchedAmount) + parseFloat(amount))
          : round2dec(parseFloat(fetchedAmount) - parseFloat(amount));
      thisAccount.date = Date.now();
      thisAccount.recentTransaction = parseFloat(amount);
      setAccountState(
        [...exceptThisAccount, thisAccount].sort((a, b) => b.date - a.date),
      );
      setStateObject(thisAccount);
      await EncryptedStorage.setItem(
        'accounts',
        JSON.stringify(
          [...exceptThisAccount, thisAccount].sort((a, b) => b.date - a.date),
        ),
      )
        .then(async () => {
          if (purpose === 'Fueling') {
            setFuelingState(fuelingState.filter(item => item.id !== id));

            await EncryptedStorage.setItem(
              'fueling',
              JSON.stringify(fuelingState.filter(item => item.id !== id)),
            )
              .then(() => {
                setShowLoader(false);
                showToast('success', 'Data Deleted Successfully');
                // setTimeout(() => navigation.navigate('Home'), 1500);
              })
              .catch(e => {
                setShowLoader(false);
                showToast('error', 'Data Deletation Failed');
              });
          } else {
            setShowLoader(false);
            showToast('success', 'Data Deleted Successfully');
            // setTimeout(() => navigation.navigate('Home'), 1500);
          }
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', 'Data Deletation Failed');
        });
    });
  };

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 1500,
      position: 'top',
      topOffset: 500,
    });
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {}, [
    isEnabled,
    editIsEnabled,
    prevTransactionType,
    originalData,
    editedData,
  ]);
  useEffect(() => {
    getTransactions();
  }, [isFocused, stateObject]);
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{marginBottom: responsiveHeight(8)}}>
        <View>
          <Image
            source={
              data.accountType === 'Bank'
                ? require('../images/bank.png')
                : require('../images/cash.png')
            }
            style={styles.accountImage}
          />

          <View style={styles.details}>
            <Text
              style={[
                styles.specText,
                {textAlign: 'center'},
              ]}>{`Account Name: \n ${data.accountName
              .toUpperCase()
              .slice(0, 15)}`}</Text>
            <Text style={styles.specText}>Type: {data.accountType}</Text>
            {fetchedAmount >= 0 ? (
              <Text style={styles.specText}>
                Amount: ₹{IndianFormat(fetchedAmount)}
              </Text>
            ) : (
              <Text style={[styles.specText, {color: 'red'}]}>
                Amount: -₹{IndianFormat(fetchedAmount * -1)}
              </Text>
            )}
            {totalExpense ? (
              totalExpense >= 0 ? (
                <Text style={styles.specText}>
                  Total Transact: ₹{IndianFormat(totalExpense)}
                </Text>
              ) : (
                <Text style={[styles.specText, {color: 'red'}]}>
                  Total Transact: -₹{IndianFormat(totalExpense * -1)}
                </Text>
              )
            ) : null}
            {recentTransaction ? (
              recentTransaction >= 0 ? (
                <Text style={styles.specText}>
                  Recent: ₹{IndianFormat(recentTransaction)}
                </Text>
              ) : (
                <Text style={[styles.specText, {color: 'red'}]}>
                  Recent: -₹{IndianFormat(recentTransaction * -1)}
                </Text>
              )
            ) : null}
          </View>
          {showTransactionAdd ? (
            <View>
              <Text style={styles.title}>Transact</Text>
              <View style={{alignSelf: 'center'}}>
                <View>
                  <Text style={styles.label}>Enter Purpose</Text>
                  <CustomTextInput
                    placeholder={'Purpose'}
                    value={purpose}
                    onChangeText={text => setPurpose(text)}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Enter Amount</Text>
                  <CustomTextInput
                    placeholder={'Amount'}
                    type={'number-pad'}
                    value={amount}
                    onChangeText={text => setAmount(text.replace(/\s/g, ''))}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Enter Transaction Date</Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      borderColor: 'skyblue',
                      borderWidth: 1,
                      width: responsiveWidth(76),
                      height: 50,
                      alignSelf: 'center',
                      borderRadius: responsiveWidth(3),
                      justifyContent: 'center',
                    }}
                    onPress={() => setOpen(true)}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.6),
                        color: fontColor,
                        paddingLeft: 14,
                      }}>
                      {date.getDate() < 10
                        ? '0' + date.getDate()
                        : date.getDate()}
                      -
                      {date.getMonth() + 1 < 10
                        ? `0${date.getMonth() + 1}`
                        : date.getMonth() + 1}
                      -{date.getFullYear()}
                    </Text>
                  </TouchableOpacity>

                  {open && (
                    <DateTimePickerAndroid
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      maximumDate={Date.parse(new Date())}
                      minimumDate={new Date('01-01-2023')}
                      display="default"
                      onChange={calculateAgeOnSameDay}
                    />
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: responsiveHeight(1),
                  marginBottom: responsiveHeight(1),
                }}>
                <Text style={[styles.title, {paddingRight: 5, color: 'red'}]}>
                  Debit{' '}
                  <Feather name={'minus-circle'} size={20} color={'red'} />
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <Text style={[styles.title, {paddingLeft: 5, color: 'green'}]}>
                  Credit{' '}
                  <Feather name={'plus-circle'} size={20} color={'green'} />
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <CustomButton
                  title={'Submit'}
                  size={'small'}
                  onClick={submitData}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'darkred'}
                  size={'small'}
                  onClick={() => {
                    setShowTransactionAdd(!showTransactionAdd);
                    setShowTransactions(!showTransactions);
                  }}
                />
              </View>
            </View>
          ) : (
            <CustomButton
              title={'Add Transaction'}
              onClick={() => {
                setShowTransactionAdd(!showTransactionAdd);
                setShowTransactions(!showTransactions);
              }}
            />
          )}
        </View>
        <ScrollView>
          {allTransactions.length > 0 && showTransactions
            ? allTransactions.slice(0, visibleItems).map((el, ind) => {
                return (
                  <ScrollView
                    style={styles.itemView}
                    key={ind}
                    contentContainerStyle={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            Clipboard.setString(el.purpose);
                            showToast('success', 'Purpose Copied to Clipboard');
                          }}>
                          <Text style={styles.label}>
                            Purpose: {el.purpose.toUpperCase().slice(0, 30)}
                          </Text>
                        </TouchableOpacity>

                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Text style={styles.label}>Transaction Type: </Text>
                          <Text
                            style={[
                              styles.label,
                              {
                                color:
                                  el.transactionType === 'Debit'
                                    ? 'red'
                                    : 'green',
                              },
                            ]}>
                            {el.transactionType}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{flexDirection: 'row', alignSelf: 'center'}}
                          onPress={() => {
                            Clipboard.setString(el.amount.toString());
                            showToast('success', 'Amount Copied to Clipboard');
                          }}>
                          <Text style={styles.label}>Transaction Amount: </Text>
                          <Text
                            style={[
                              styles.label,
                              {
                                color:
                                  el.transactionType === 'Debit'
                                    ? 'red'
                                    : 'green',
                              },
                            ]}>
                            {el.transactionType === 'Debit'
                              ? `-₹${IndianFormat(el.amount)}`
                              : `₹${IndianFormat(el.amount)}`}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Text style={styles.label}>
                            Amount Before Transaction:{' '}
                          </Text>
                          <Text
                            style={[
                              styles.label,
                              {
                                color: el.previousAmount < 0 ? 'red' : 'green',
                              },
                            ]}>
                            {el.previousAmount < 0
                              ? `-₹${IndianFormat(
                                  round2dec(el.previousAmount) * -1,
                                )}`
                              : `₹${IndianFormat(
                                  round2dec(el.previousAmount),
                                )}`}
                          </Text>
                        </View>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Text style={styles.label}>
                            Amount After Transaction:{' '}
                          </Text>
                          <Text
                            style={[
                              styles.label,
                              {
                                color: el.currentAmount < 0 ? 'red' : 'green',
                              },
                            ]}>
                            {el.currentAmount < 0
                              ? `-₹${IndianFormat(
                                  round2dec(el.currentAmount) * -1,
                                )}`
                              : `₹${IndianFormat(round2dec(el.currentAmount))}`}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          <Text style={styles.dropDownText}>
                            Transacted At: {getDay(el.date)}
                          </Text>
                          <Text style={styles.dropDownText}>
                            {' '}
                            {getMonthName(el.date)}
                          </Text>
                          <Text style={styles.dropDownText}>
                            {' '}
                            {getFullYear(el.date)}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          <Text style={styles.dropDownText}>
                            Updated At: {getDay(el.date)}
                          </Text>
                          <Text style={styles.dropDownText}>
                            {' '}
                            {getMonthName(el.date)}
                          </Text>
                          <Text style={styles.dropDownText}>
                            {' '}
                            {getFullYear(el.date)}
                          </Text>
                        </View>
                      </View>
                      {el.purpose !== 'Fueling' && (
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignSelf: 'center',
                            padding: 10,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              setVisible(true);
                              setEditID(el.id);
                              setEditDate(new Date(el.date));
                              setPrevAmount(el.amount);
                              setPrevTransactionType(el.transactionType);
                              setEditAmount(el.amount.toString());
                              setEditPurpose(el.purpose);
                              setOriginalData(el);
                              setEditedData(el);
                              setEditTransactionType(el.transactionType);
                              el.transactionType === 'Debit'
                                ? setEditIsEnabled(false)
                                : setEditIsEnabled(true);
                            }}>
                            <Text>
                              <FontAwesome5
                                name="edit"
                                size={25}
                                color="blue"
                              />
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{paddingTop: responsiveHeight(10)}}
                            onPress={() => {
                              showConfirmDialog(
                                el.id,
                                el.transactionType,
                                el.amount,
                                el.purpose,
                              );
                            }}>
                            <Text>
                              <Ionicons
                                name="trash-bin"
                                size={25}
                                color="red"
                              />
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                );
              })
            : null}
          {showTransactions && visibleItems < allTransactions.length && (
            <View style={{marginBottom: responsiveHeight(2)}}>
              <CustomButton title={'Show More'} onClick={loadMore} />
            </View>
          )}
        </ScrollView>
        <Modal animationType="slide" visible={visible} transparent>
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text
                style={{
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: '500',
                  textAlign: 'center',
                  color: THEME_COLOR,
                }}>
                Edit Transaction Details
              </Text>

              <CustomTextInput
                placeholder={'Enter Purpose'}
                value={editPurpose}
                onChangeText={text => {
                  setEditPurpose(text);
                  setEditedData({...editedData, purpose: text});
                }}
              />
              <CustomTextInput
                placeholder={'Enter Amount'}
                type={'number-pad'}
                value={editAmount}
                onChangeText={text => {
                  setEditAmount(text.replace(/\s/g, ''));
                  setEditedData({...editedData, amount: parseFloat(text)});
                }}
              />
              <View>
                <Text style={styles.label}>Enter Date of Transaction</Text>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    borderColor: 'skyblue',
                    borderWidth: 1,
                    width: responsiveWidth(76),
                    height: 50,
                    alignSelf: 'center',
                    borderRadius: responsiveWidth(3),
                    justifyContent: 'center',
                  }}
                  onPress={() => setEditOpen(true)}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.6),
                      color: fontColor,
                      paddingLeft: 14,
                    }}>
                    {editDate.getDate() < 10
                      ? '0' + editDate.getDate()
                      : editDate.getDate()}
                    -
                    {editDate.getMonth() + 1 < 10
                      ? `0${editDate.getMonth() + 1}`
                      : editDate.getMonth() + 1}
                    -{editDate.getFullYear()}
                  </Text>
                </TouchableOpacity>

                {editOpen && (
                  <DateTimePickerAndroid
                    testID="dateTimePicker"
                    value={editDate}
                    mode="date"
                    maximumDate={Date.parse(new Date())}
                    minimumDate={new Date('01-01-2023')}
                    display="default"
                    onChange={editCalculateAgeOnSameDay}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text style={[styles.title, {paddingRight: 5, color: 'red'}]}>
                  Debit{' '}
                  <Feather name={'minus-circle'} size={20} color={'red'} />
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={editIsEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={editToggleSwitch}
                  value={editIsEnabled}
                />
                <Text style={[styles.title, {paddingLeft: 5, color: 'green'}]}>
                  Credit{' '}
                  <Feather name={'plus-circle'} size={20} color={'green'} />
                </Text>
              </View>
              <CustomButton title={'Update'} onClick={updateData} />
              <CustomButton
                title={'Close'}
                color={'purple'}
                onClick={() => setVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomBar />
      <Loader visible={showLoader} />
      <Toast />
    </View>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  details: {
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(2),
    backgroundColor: 'rgba(255, 255, 255,.7)',
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
  },
  specText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    color: THEME_COLOR,
    // color: 'white',
    shadowColor: 'black',
    elevation: 5,
    shadowOpacity: 1,
  },
  accountImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(25),
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(2),
    color: THEME_COLOR,
    marginTop: responsiveHeight(1),
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    marginTop: responsiveHeight(1),
    color: THEME_COLOR,
  },
  itemView: {
    width: responsiveWidth(92),
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    padding: responsiveWidth(1),
    shadowColor: 'black',
    elevation: 5,
  },

  dropDownText: {
    fontSize: responsiveFontSize(1.5),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    marginTop: responsiveHeight(3),
    alignSelf: 'center',
    color: THEME_COLOR,
  },

  modalView: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: responsiveHeight(80),
    height: responsiveHeight(80),
    borderRadius: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
