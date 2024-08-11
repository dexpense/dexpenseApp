import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Alert,
  Switch,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader';
import {useIsFocused} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  INR,
  IndianFormat,
  getDay,
  getFullYear,
  getMonthName,
  round2dec,
} from '../modules/calculatefunctions';
const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const CashBook = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {
    state,
    setActiveTab,
    accountState,
    setAccountState,
    transactionState,
    setTransactionState,
    fuelingState,
    setFuelingState,
    setStateObject,
  } = useGlobalContext();
  const user = state.USER;
  const [visible, setVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAccounts, setShowAccounts] = useState(true);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('Bank');
  const [amount, setAmount] = useState('');
  const [editAccountName, setEditAccountName] = useState('');
  const [editAccountType, setEditAccountType] = useState('Bank');
  const [editAmount, setEditAmount] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [transferingAdmin, setTransferingAdmin] = useState({});
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [receivingAdmin, setReceivingAdmin] = useState({});
  const [showData, setShowData] = useState(false);
  const [showTransferData, setShowTransferData] = useState(false);
  const [showTranferSelector, setShowTranferSelector] = useState(false);
  const [isclicked, setIsclicked] = useState(false);
  const [isTransferClicked, setIsTransferClicked] = useState(false);
  const [showTransferBtn, setShowTransferBtn] = useState(true);
  const [showTransferView, setShowTransferView] = useState(false);
  const [transferingAmount, setTransferingAmount] = useState('');
  const [transferingPurpose, setTransferingPurpose] = useState('');
  const docId = uuid.v4();
  const [isEnabled, setIsEnabled] = useState(false);
  const [editIsEnabled, setEditIsEnabled] = useState(false);

  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setDate(currentSelectedDate);
    setOpen(false);

    setFontColor('black');
  };

  const [editID, seteditID] = useState('');
  const [visibleItems, setVisibleItems] = useState(5);
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
  };
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      setAccountType('Bank');
    } else {
      setAccountType('Cash');
    }
  };
  const editToggleSwitch = () => {
    setEditIsEnabled(!editIsEnabled);
    if (editIsEnabled) {
      setEditAccountType('Bank');
    } else {
      setEditAccountType('Cash');
    }
  };
  const addAccount = async () => {
    if (accountName !== '' && accountType !== '' && amount !== '') {
      setShowLoader(true);
      const x = [
        ...accountState,
        {
          date: Date.now(),
          id: docId,
          accountName: accountName,
          accountType: accountType,
          addedBy: user.id,
          email: user.email,
          amount: parseFloat(amount),
          recentTransaction: parseFloat(amount),
          upLoadedAt: '',
          downLoadedAt: '',
          modifiedAt: '',
        },
      ].sort((a, b) => b.date - a.date);
      setAccountState(x);

      await EncryptedStorage.setItem('accounts', JSON.stringify(x))
        .then(() => {
          setShowLoader(false);
          showToast('success', 'Account Added Successfully');
          getAccounts();
          setShowAccounts(false);
          setAccountName('');
          setAccountType('Cash');
          setIsEnabled(false);
          setAmount('');
          setShowAddAccount(false);
          setShowAccounts(true);
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', e);
        });
    } else {
      showToast('error', 'Invalid Data');
    }
  };
  const getAccounts = async () => {
    setShowLoader(true);

    const existedAccounts = JSON.parse(
      await EncryptedStorage.getItem('accounts'),
    );
    if (existedAccounts.length > 0) {
      const newData = existedAccounts.sort((a, b) => b.date - a.date);
      setAllAccounts(newData);
      setShowLoader(false);
      setAccounts(newData);
      setAccountState(newData);
      // await EncryptedStorage.removeItem('accounts');
    } else {
      setShowLoader(false);
      showToast('success', 'No Account Added!');
    }
  };
  const getTransactions = async () => {
    setShowLoader(true);
    const transactions = JSON.parse(
      await EncryptedStorage.getItem('transactions'),
    );
    const newData = transactions.sort((a, b) => b.date - a.date);
    setShowLoader(false);
    setTransactionState(newData);
  };

  const getFueling = async () => {
    setShowLoader(true);
    const fueling = JSON.parse(await EncryptedStorage.getItem('fueling'));
    const newData = fueling.sort((a, b) => b.date - a.date);
    setShowLoader(false);
    setFuelingState(newData);
  };

  const showConfirmDialog = id => {
    return Alert.alert('Hold On!', 'Are You Sure To Delete This Account?', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showToast('success', 'Account Not Deleted!'),
      },
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          deleteData(id);
        },
      },
    ]);
  };

  const deleteData = async id => {
    setShowLoader(true);
    try {
      let filteredAccount = accounts.filter(el => el.id !== id);
      await EncryptedStorage.setItem(
        'accounts',
        JSON.stringify(filteredAccount),
      );

      if (transactionState.length > 0) {
        const filteredTransactions = transactionState.filter(
          el => el.accountID !== id,
        );
        const filteredFuelings = fuelingState.filter(el => el.accountID !== id);
        if (filteredTransactions.length > 0) {
          setTransactionState(
            transactionState.filter(item => item.accountID !== id),
          );
          try {
            await EncryptedStorage.setItem(
              'transactions',
              JSON.stringify(filteredTransactions),
            )
              .then(() => {
                setShowLoader(false);
                showToast('success', 'Account Deleted Successfully');
                getAccounts();
              })
              .catch(e => {
                setShowLoader(false);
                showToast('error', 'Account Deletation Failed');
                console.log(e);
              });
          } catch (e) {
            setShowLoader(false);
            showToast('error', 'Account Deletation Failed');
            console.log(e);
          }
        } else {
          setShowLoader(false);
          showToast('success', 'Account Deleted Successfully');
          getAccounts();
        }
        if (filteredFuelings.length > 0) {
          setFuelingState(fuelingState.filter(item => item.accountID !== id));
          try {
            await EncryptedStorage.setItem(
              'fueling',
              JSON.stringify(filteredFuelings),
            )
              .then(() => {
                setShowLoader(false);
                showToast('success', 'Account Deleted Successfully');
                getAccounts();
              })
              .catch(e => {
                setShowLoader(false);
                showToast('error', 'Account Deletation Failed');
                console.log(e);
              });
          } catch (e) {
            setShowLoader(false);
            showToast('error', 'Account Deletation Failed');
            console.log(e);
          }
        } else {
          setShowLoader(false);
          showToast('success', 'Account Deleted Successfully');
          getAccounts();
        }
      } else {
        setShowLoader(false);
        showToast('success', 'Account Deleted Successfully');
        getAccounts();
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e);
    }
  };
  const updateData = async () => {
    if (
      editAccountName !== '' &&
      editAccountType !== '' &&
      editAmount !== '' &&
      editID !== ''
    ) {
      setShowLoader(true);
      const exceptThisAccount = accountState.filter(item => item.id !== editID);
      const thisAccount = accountState.filter(item => item.id === editID)[0];
      thisAccount.accountName = editAccountName;
      thisAccount.accountType = editAccountType;
      thisAccount.amount = parseFloat(editAmount);
      thisAccount.date = Date.now();
      const x = [...exceptThisAccount, thisAccount].sort(
        (a, b) => b.date - a.date,
      );
      setAccountState(x);

      await EncryptedStorage.setItem('accounts', JSON.stringify(x));
      setShowLoader(false);
      setVisible(false);
      setEditAccountType('Bank');
      setEditIsEnabled(false);
      showToast('success', 'Details Updated Successfully');
      getAccounts();
    } else {
      showToast('error', 'Invalid Data');
    }
  };

  const removeTransferingAdmin = item => {
    let removeTransferee = allAccounts.filter(
      el => el.accountName !== item.accountName,
    );
    setFilteredAccounts(removeTransferee);
  };
  const transferAmountToAdmin = async () => {
    if (
      transferingAdmin.accountName !== '' &&
      transferingAdmin.amount !== '' &&
      receivingAdmin.accountName !== '' &&
      receivingAdmin.amount !== '' &&
      transferingAmount !== '' &&
      transferingPurpose !== '' &&
      transferingAdmin.amount > parseFloat(transferingAmount)
    ) {
      const usersID = user.id;
      if (accounts.length > 0) {
        setShowLoader(true);

        let otherThanTransferingAccount = accounts.filter(
          el => el.id !== transferingAdmin.id,
        );
        let otherThanTransferingAndReceivingAccount =
          otherThanTransferingAccount.filter(el => el.id !== receivingAdmin.id);

        let transferingAccount = accounts.filter(
          el => el.id === transferingAdmin.id,
        )[0];
        let receivingAccount = accounts.filter(
          el => el.id === receivingAdmin.id,
        )[0];

        otherThanTransferingAndReceivingAccount.push(
          {
            id: transferingAccount.id,
            accountName: transferingAccount.accountName,
            accountType: transferingAccount.accountType,
            addedBy: user.id,
            email: user.email,
            amount: round2dec(
              parseFloat(transferingAdmin.amount) -
                parseFloat(transferingAmount),
            ),
            date: Date.parse(date),
            recentTransaction: parseFloat(transferingAmount),
            upLoadedAt: transferingAccount.upLoadedAt,
            downLoadedAt: transferingAccount.downLoadedAt,
            modifiedAt: Date.now(),
          },
          {
            id: receivingAccount.id,
            accountName: receivingAccount.accountName,
            accountType: receivingAccount.accountType,
            addedBy: user.id,
            email: user.email,
            amount: round2dec(
              parseFloat(receivingAdmin.amount) + parseFloat(transferingAmount),
            ),
            date: Date.parse(date),
            recentTransaction: parseFloat(transferingAmount),
            upLoadedAt: receivingAccount.upLoadedAt,
            downLoadedAt: receivingAccount.downLoadedAt,
            modifiedAt: Date.now(),
          },
        );
        let x = otherThanTransferingAndReceivingAccount.sort(
          (a, b) => b.date - a.date,
        );
        setAccountState(x);
        await EncryptedStorage.setItem('accounts', JSON.stringify(x))
          .then(async () => {
            const transactions = transactionState;
            transactions.push(
              {
                date: Date.parse(date),
                id: docId,
                accountName: transferingAdmin.accountName,
                accountID: transferingAdmin.id,
                addedBy: usersID,
                amount: parseFloat(transferingAmount),
                purpose: transferingPurpose,
                transactionType: 'Debit',
                previousAmount: parseFloat(transferingAdmin.amount),
                currentAmount:
                  parseFloat(transferingAdmin.amount) -
                  parseFloat(transferingAmount),
                upLoadedAt: '',
                downLoadedAt: '',
                modifiedAt: '',
              },
              {
                date: Date.parse(date),
                id: docId + '-' + 'transfer',
                accountName: receivingAdmin.accountName,
                accountID: receivingAdmin.id,
                addedBy: usersID,
                amount: parseFloat(transferingAmount),
                purpose: transferingPurpose,
                transactionType: 'Credit',
                previousAmount: parseFloat(receivingAdmin.amount),
                currentAmount:
                  parseFloat(receivingAdmin.amount) +
                  parseFloat(transferingAmount),
                upLoadedAt: '',
                downLoadedAt: '',
                modifiedAt: '',
              },
            );
            let y = transactions.sort((a, b) => b.date - a.date);
            setTransactionState(y);
            await EncryptedStorage.setItem('transactions', JSON.stringify(y))
              .then(() => {
                setShowLoader(false);
                showToast('success', 'Amount Transfer Successfull!');
                getAccounts();
                setShowTransferView(false);
                setShowTransferBtn(true);
                setShowAddAccount(false);
                setShowAccounts(true);
                setIsTransferClicked(false);
                setShowTranferSelector(false);
                setTransferingAdmin(allAccounts);
                setReceivingAdmin(allAccounts);
                setShowTransferData(false);
                setTransferingAmount('');
                setTransferingPurpose('');
                setDate(new Date());
              })
              .catch(e => {
                setShowLoader(false);
                showToast('error', 'Something Went Wrong');
                console.log(e);
              });
          })
          .catch(e => {
            setShowLoader(false);
            showToast('error', 'Something Went Wrong');
            console.log(e);
          });
      } else {
        setShowLoader(false);
        showToast('error', 'Something Went Wrong');
      }
    } else {
      setShowLoader(false);
      showToast('error', 'Invalid Data');
    }
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
        setActiveTab(0);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (accountState.length === 0) {
      getAccounts();
    } else {
      setAllAccounts(accountState.sort((a, b) => b.date - a.date));
    }
    if (transactionState.length === 0) {
      getTransactions();
    }
    if (fuelingState.length === 0) {
      getFueling();
    }
  }, [isFocused]);
  useEffect(() => {}, [
    isEnabled,
    filteredAccounts,
    transferingAmount,
    transferingPurpose,
    transferingAdmin,
  ]);
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(8),
          marginTop: responsiveHeight(2),
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',
            marginBottom: responsiveHeight(1),
            marginTop: responsiveHeight(1),
          }}
          onPress={() => {
            setShowAddAccount(!showAddAccount);
            setShowAccounts(!showAccounts);
            setShowTransferView(false);
          }}>
          <Feather
            name={showAddAccount ? 'minus-circle' : 'plus-circle'}
            size={20}
            color={THEME_COLOR}
          />
          <Text style={styles.title}>
            {showAddAccount ? 'Hide Add Accounts' : 'Add New Accounts'}
          </Text>
        </TouchableOpacity>
        {showTransferBtn && !showAddAccount ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: responsiveWidth(5),
            }}
            onPress={() => {
              setShowTransferView(!showTransferView);

              setShowAddAccount(false);
              setShowAccounts(!showAccounts);
              setIsTransferClicked(false);
              setShowTranferSelector(false);
              setTransferingAdmin(allAccounts);
              setReceivingAdmin(allAccounts);
              setShowTransferData(false);
            }}>
            <FontAwesome6
              name={'money-bill-transfer'}
              size={20}
              color={THEME_COLOR}
            />
            {!showTransferView ? (
              <Text style={styles.title}>Transfer Amount</Text>
            ) : (
              <Text style={styles.title}>Hide Transfer Amount</Text>
            )}
          </TouchableOpacity>
        ) : null}

        {showAddAccount ? (
          <View>
            <CustomTextInput
              placeholder={'Enter Account Name'}
              value={accountName}
              onChangeText={text => setAccountName(text)}
            />

            <CustomTextInput
              placeholder={'Enter Amount'}
              type={'number-pad'}
              value={amount}
              onChangeText={text => setAmount(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: responsiveHeight(1),
                marginBottom: responsiveHeight(1),
              }}>
              <Text style={[styles.title, {paddingRight: 5}]}>Bank</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text
                style={[styles.title, {paddingRight: responsiveWidth(1.5)}]}>
                Cash
              </Text>
            </View>
            <CustomButton title={'Add Account'} onClick={addAccount} />

            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => {
                setShowAddAccount(false);
                setAccountType('Bank');
                setAccountType('');
                setAmount('');
                setShowAddAccount(!showAddAccount);
                setShowAccounts(true);
              }}
            />
          </View>
        ) : null}
        {showTransferView ? (
          <ScrollView
            style={{
              marginTop: responsiveHeight(2),
              marginBottom: responsiveHeight(2),
            }}>
            <View>
              <Text
                style={[
                  styles.heading,
                  {textAlign: 'center', fontSize: 15, marginTop: 5},
                ]}>
                Select From Which Account To Transfer
              </Text>

              <TouchableOpacity
                style={[styles.dropDownnSelector, {marginTop: 5}]}
                onPress={() => {
                  setIsclicked(!isclicked);
                  setTransferingAdmin(allAccounts);
                  setShowData(!showData);
                  setReceivingAdmin(allAccounts);
                  setShowTransferData(false);
                }}>
                <Text style={styles.dropDownTextTransfer}>
                  {transferingAdmin.accountName}
                </Text>

                {isclicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {isclicked ? (
                <ScrollView style={styles.dropDowArea}>
                  {allAccounts.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setTransferingAdmin(item);
                          setIsclicked(false);
                          setShowData(true);
                          setShowTranferSelector(true);
                          removeTransferingAdmin(item);
                        }}>
                        <Text style={styles.dropDownTextTransfer}>
                          {item.accountName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : null}
              {showData ? (
                transferingAdmin.accountName ? (
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text style={styles.dropDownTextTransfer}>Balance: </Text>
                    <Text style={styles.dropDownTextTransfer}>
                      ₹{IndianFormat(transferingAdmin.amount)}
                    </Text>
                  </View>
                ) : null
              ) : null}
              {showTranferSelector ? (
                <ScrollView>
                  <Text
                    style={[
                      styles.heading,
                      {textAlign: 'center', fontSize: 15, marginTop: 5},
                    ]}>
                    Select Which Account To Pay
                  </Text>

                  <TouchableOpacity
                    style={[styles.dropDownnSelector, {marginTop: 5}]}
                    onPress={() => {
                      setIsTransferClicked(!isTransferClicked);
                      setReceivingAdmin(allAccounts);
                      setShowTransferData(false);
                    }}>
                    <Text style={styles.dropDownTextTransfer}>
                      {receivingAdmin.accountName}
                    </Text>

                    {isTransferClicked ? (
                      <AntDesign name="up" size={30} color={THEME_COLOR} />
                    ) : (
                      <AntDesign name="down" size={30} color={THEME_COLOR} />
                    )}
                  </TouchableOpacity>
                  {isTransferClicked ? (
                    <ScrollView style={styles.dropDowArea}>
                      {filteredAccounts.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            style={styles.AdminName}
                            onPress={() => {
                              setReceivingAdmin(item);
                              setIsTransferClicked(false);
                              setShowTransferData(true);
                            }}>
                            <Text style={styles.dropDownTextTransfer}>
                              {item.accountName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : null}
                </ScrollView>
              ) : null}
              {showTransferData ? (
                receivingAdmin.accountName ? (
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <Text style={styles.dropDownTextTransfer}>Balance: </Text>
                    <Text style={styles.dropDownTextTransfer}>
                      ₹{IndianFormat(receivingAdmin.amount)}
                    </Text>
                  </View>
                ) : null
              ) : null}
              {showTransferData ? (
                <View style={{margin: responsiveHeight(1)}}>
                  <CustomTextInput
                    placeholder={'Enter Amount to Transfer'}
                    value={transferingAmount}
                    type={'number-pad'}
                    onChangeText={text => setTransferingAmount(text)}
                  />
                  <CustomTextInput
                    placeholder={'Enter Purpose of Transfer'}
                    value={transferingPurpose}
                    onChangeText={text => setTransferingPurpose(text)}
                  />
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

                    <DateTimePickerModal
                      isVisible={open}
                      mode="date"
                      maximumDate={new Date()}
                      minimumDate={
                        new Date(`01-01-${new Date().getFullYear()}`)
                      }
                      onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        setFontColor('black');
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </View>
                  <CustomButton
                    title={'Transfer Amount'}
                    onClick={transferAmountToAdmin}
                  />
                  <CustomButton
                    title={'Cancel'}
                    color={'darkred'}
                    onClick={() => {
                      setShowTransferView(false);
                      setShowTransferBtn(true);
                      setShowAddAccount(false);
                      setShowAccounts(true);
                      setTransferingAdmin(allAccounts);
                      setReceivingAdmin(allAccounts);
                      setShowTransferData(false);
                      setIsTransferClicked(false);
                      setTransferingAmount('');
                      setTransferingPurpose('');
                    }}
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : null}
        <ScrollView style={{marginBottom: responsiveHeight(2)}}>
          {showAccounts &&
          !showTransferView &&
          !showAddAccount &&
          allAccounts.length
            ? allAccounts.slice(0, visibleItems).map((el, ind) => {
                return (
                  <ScrollView style={styles.itemView} key={ind}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        navigation.navigate('Account Details');
                        setStateObject(el);
                      }}>
                      <Image
                        source={
                          el.accountType === 'Bank'
                            ? require('../images/bank.png')
                            : require('../images/cash.png')
                        }
                        style={{
                          width: responsiveWidth(15),
                          height: responsiveWidth(15),
                          borderRadius: responsiveWidth(2),
                        }}
                      />

                      <View
                        style={{
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          paddingLeft: 10,
                          flexWrap: 'wrap',
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={[
                            styles.label,
                            {textAlign: 'center', flexWrap: 'wrap'},
                          ]}>
                          {`Account Name: \n ${el.accountName
                            .toUpperCase()
                            .slice(0, 17)}`}
                        </Text>
                        <Text
                          style={[
                            styles.label,
                            {textAlign: 'center', flexWrap: 'wrap'},
                          ]}>
                          Account Type: {el.accountType}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <Text
                            style={[
                              styles.label,
                              {textAlign: 'center', flexWrap: 'wrap'},
                            ]}>
                            Account Balance:{' '}
                          </Text>
                          <Text
                            style={[
                              styles.label,
                              {
                                textAlign: 'center',
                                flexWrap: 'wrap',
                                color: el.amount < 0 ? 'red' : 'green',
                              },
                            ]}>
                            {el.amount >= 0
                              ? `₹${IndianFormat(el.amount)}`
                              : `-₹${IndianFormat(el.amount * -1)}`}
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
                            setEditAccountName(el.accountName);
                            setEditAccountType(el.accountType);
                            setEditAmount(el.amount.toString());

                            seteditID(el.id);

                            el.accountType === 'Bank'
                              ? setEditIsEnabled(false)
                              : setEditIsEnabled(true);
                          }}>
                          <Text>
                            <FontAwesome5 name="edit" size={25} color="blue" />
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{paddingTop: 40}}
                          onPress={() => {
                            showConfirmDialog(el.id);
                          }}>
                          <Text>
                            <Ionicons name="trash-bin" size={25} color="red" />
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                );
              })
            : null}
          {showAccounts &&
            !showAddAccount &&
            visibleItems < allAccounts.length && (
              <CustomButton title={'Show More'} onClick={loadMore} />
            )}
        </ScrollView>
        <Modal animationType="slide" visible={visible} transparent>
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: '500',
                  textAlign: 'center',
                  color: THEME_COLOR,
                }}>
                Edit Account Details
              </Text>

              <CustomTextInput
                placeholder={'Enter Account Name'}
                value={editAccountName}
                onChangeText={text => {
                  setEditAccountName(text);
                }}
              />
              <CustomTextInput
                placeholder={'Enter Amount'}
                type={'number-pad'}
                value={editAmount}
                onChangeText={text => {
                  setEditAmount(text);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text style={[styles.title, {paddingRight: 5}]}>Bank</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={editToggleSwitch}
                  value={editIsEnabled}
                />
                <Text style={[styles.title, {paddingLeft: 5}]}>Cash</Text>
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
      <Loader visible={showLoader} />
      <Toast />
    </View>
  );
};

export default CashBook;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(1),
    color: THEME_COLOR,
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
    marginTop: responsiveHeight(0.5),
    color: THEME_COLOR,
  },
  itemView: {
    width: responsiveWidth(94),
    backgroundColor: 'white',

    alignSelf: 'center',
    borderRadius: 10,
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    padding: responsiveWidth(2),
    shadowColor: 'black',
    elevation: 5,
  },
  modalView: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255,.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: responsiveWidth(80),
    height: responsiveHeight(35),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dropDownText: {
    fontSize: responsiveFontSize(2),
    color: 'darkred',
    alignSelf: 'center',
    textAlign: 'center',
  },
  dropDownTextTransfer: {
    fontSize: responsiveFontSize(1.8),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
  },
  dropDownnSelector: {
    width: responsiveWidth(90),
    height: responsiveHeight(7),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: THEME_COLOR,
    alignSelf: 'center',
    marginTop: responsiveHeight(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
  },
  dropDowArea: {
    width: responsiveWidth(90),

    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
  },
  AdminName: {
    width: responsiveWidth(90),
    height: responsiveHeight(7),
    borderBottomWidth: 0.2,
    borderBottomColor: THEME_COLOR,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    marginTop: responsiveHeight(3),
    alignSelf: 'center',
    color: THEME_COLOR,
  },
});
