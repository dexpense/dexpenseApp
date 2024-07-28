import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Loader from '../components/Loader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {getDay, getFullYear, getMonthName} from '../modules/calculatefunctions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
import {useGlobalContext} from '../context/Store';
import axios from 'axios';
const ChangeUP = () => {
  const docId = uuid.v4();
  const {state, setActiveTab} = useGlobalContext();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [myData, setMyData] = useState('');
  const [email, setEmail] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [inpPassword, setInpPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [showLoder, setShowLoder] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showUPBtn, setShowUPBtn] = useState(true);
  const [name, setName] = useState('');
  const [showDelBtn, setShowDelBtn] = useState(true);
  const [showClearBtn, setShowClearBtn] = useState(false);
  const [showBackUpBtn, setShowBackUpBtn] = useState(true);
  const [showBackUpOption, setShowBackUpOption] = useState(false);
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [acountOption, setAcountOption] = useState(true);
  const [showFindAccount, setShowFindAccount] = useState(false);
  const [showFindAccountResult, setShowFindAccountResult] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [errFindAccount, setErrFindAccount] = useState(false);
  const [date, setDate] = useState('');
  const [id, setId] = useState('');

  const [showEntry, setShowEntry] = useState(true);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [isverified, setIsverified] = useState(false);

  bcrypt.setRandomFallback(len => {
    const buf = new Uint8Array(len);

    return buf.map(() => Math.floor(isaac.random() * 256));
  });
  const getMyData = async () => {
    setShowLoder(true);
    const user = state.USER;
    if (user !== null) {
      setMyData(user);
      setShowLoder(false);
      setEmail(user.email);
      setCreateEmail(user.email);
    } else {
      setMyData({
        username: 'username',
      });
      setShowLoder(false);
    }
  };

  const nameChange = async () => {
    if (name !== '' && name !== myData.name) {
      setShowLoder(true);

      await EncryptedStorage.setItem(
        'user',
        JSON.stringify([
          {
            name: name.toUpperCase().slice(0, 15),
            id: myData.id,
            email: email,
          },
        ]),
      ).then(() => {
        setActiveTab(0);
        setShowDelBtn(!showDelBtn);
        navigation.navigate('Login');
      });
    } else {
      setShowLoder(false);
      showToast('error', 'Please Enter Valid Name');
    }
  };

  const uploadData = async () => {
    setShowLoder(true);
    const user = JSON.parse(await EncryptedStorage.getItem('user'))?.USER;
    const vehicles = JSON.parse(await EncryptedStorage.getItem('vehicles'));
    const fueling = JSON.parse(await EncryptedStorage.getItem('fueling'));
    const accounts = JSON.parse(await EncryptedStorage.getItem('accounts'));
    const transactions = JSON.parse(
      await EncryptedStorage.getItem('transactions'),
    );
    const notes = JSON.parse(await EncryptedStorage.getItem('notes'));
    try {
      if (user) {
        await firestore()
          .collection('users')
          .doc(id)
          .update({
            name: user.name,
          })
          .then(() => {
            showToast('success', 'User Data Uploaded!');
          })
          .catch(e => {
            showToast('error', 'User Data Upload Failed!');
            console.log(e);
          });
      }
      if (vehicles) {
        await delExtraCloudIds(vehicles, 'vehicles').then(async () => {
          vehicles.map(async (el, ind) => {
            if (el.modifiedAt !== '' && el.upLoadedAt !== '') {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              if (el.modifiedAt > el.upLoadedAt) {
                return await firestore()
                  .collection('vehicles')
                  .doc(el.id)
                  .set(el)
                  .then(() => {
                    showToast('success', 'Vehicle Data Uploaded!');
                  })
                  .catch(e => {
                    showToast('error', 'Vehicle Data Upload Failed!');
                    console.log(e);
                  });
              } else {
                return false;
              }
            } else if (
              el.modifiedAt === '' ||
              el.upLoadedAt === '' ||
              el.downLoadedAt === ''
            ) {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              return await firestore()
                .collection('vehicles')
                .doc(el.id)
                .set(el)
                .then(() => {
                  showToast('success', 'Vehicle Data Uploaded!');
                })
                .catch(e => {
                  showToast('error', 'Vehicle Data Upload Failed!');
                  console.log(e);
                });
            } else {
              return false;
            }
          });
        });
      }
      if (fueling) {
        await delExtraCloudIds(fueling, 'fueling').then(async () => {
          fueling.map(async (el, ind) => {
            if (el.modifiedAt !== '' && el.upLoadedAt !== '') {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              if (el.modifiedAt > el.upLoadedAt) {
                return await firestore()
                  .collection('fueling')
                  .doc(el.id)
                  .set(el)
                  .then(() => {
                    showToast('success', 'Fueling Data Uploaded!');
                  })
                  .catch(e => {
                    showToast('error', 'Fueling Data Upload Failed!');
                    console.log(e);
                  });
              } else {
                return false;
              }
            } else if (
              el.modifiedAt === '' ||
              el.upLoadedAt === '' ||
              el.downLoadedAt === ''
            ) {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              return await firestore()
                .collection('fueling')
                .doc(el.id)
                .set(el)
                .then(() => {
                  showToast('success', 'Fueling Data Uploaded!');
                })
                .catch(e => {
                  showToast('error', 'Fueling Data Upload Failed!');
                  console.log(e);
                });
            } else {
              return false;
            }
          });
        });
      }
      if (accounts) {
        await delExtraCloudIds(accounts, 'accounts').then(async () => {
          accounts.map(async (el, ind) => {
            if (el.modifiedAt !== '' && el.upLoadedAt !== '') {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              if (el.modifiedAt > el.upLoadedAt) {
                return await firestore()
                  .collection('accounts')
                  .doc(el.id)
                  .set(el)
                  .then(() => {
                    showToast('success', 'Accounts Data Uploaded!');
                  })
                  .catch(e => {
                    showToast('error', 'Accounts Data Upload Failed!');
                    console.log(e);
                  });
              } else {
                return false;
              }
            } else if (
              el.modifiedAt === '' ||
              el.upLoadedAt === '' ||
              el.downLoadedAt === ''
            ) {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              return await firestore()
                .collection('accounts')
                .doc(el.id)
                .set(el)
                .then(() => {
                  showToast('success', 'Accounts Data Uploaded!');
                })
                .catch(e => {
                  showToast('error', 'Accounts Data Upload Failed!');
                  console.log(e);
                });
            } else {
              return false;
            }
          });
        });
      }
      if (transactions) {
        await delExtraCloudIds(transactions, 'transactions').then(async () => {
          transactions.map(async (el, ind) => {
            if (el.modifiedAt !== '' && el.upLoadedAt !== '') {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              if (el.modifiedAt > el.upLoadedAt) {
                return await firestore()
                  .collection('transactions')
                  .doc(el.id)
                  .set(el)
                  .then(() => {
                    showToast('success', 'Transactions Data Uploaded!');
                  })
                  .catch(e => {
                    showToast('error', 'Transactions Data Upload Failed!');
                    console.log(e);
                  });
              } else {
                return false;
              }
            } else if (
              el.modifiedAt === '' ||
              el.upLoadedAt === '' ||
              el.downLoadedAt === ''
            ) {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              return await firestore()
                .collection('transactions')
                .doc(el.id)
                .set(el)
                .then(() => {
                  showToast('success', 'Transactions Data Uploaded!');
                })
                .catch(e => {
                  showToast('error', 'Transactions Data Upload Failed!');
                  console.log(e);
                });
            } else {
              return false;
            }
          });
        });
      }
      if (notes) {
        await delExtraCloudIds(notes, 'notes').then(async () => {
          notes.map(async (el, ind) => {
            if (el.modifiedAt !== '' && el.upLoadedAt !== '') {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              if (el.modifiedAt > el.upLoadedAt) {
                return await firestore()
                  .collection('notes')
                  .doc(el.id)
                  .set(el)
                  .then(() => {
                    showToast('success', 'Notes Data Uploaded!');
                  })
                  .catch(e => {
                    showToast('error', 'Notes Data Upload Failed!');
                    console.log(e);
                  });
              } else {
                return false;
              }
            } else if (
              el.modifiedAt === '' ||
              el.upLoadedAt === '' ||
              el.downLoadedAt === ''
            ) {
              el.upLoadedAt = Date.now();
              el.email = createEmail;
              return await firestore()
                .collection('notes')
                .doc(el.id)
                .set(el)
                .then(() => {
                  showToast('success', 'Notes Data Uploaded!');
                })
                .catch(e => {
                  showToast('error', 'Notes Data Upload Failed!');
                  console.log(e);
                });
            } else {
              return false;
            }
          });
        });
      }
      setShowLoder(false);
      showToast('success', 'All Data Uploaded!');
      setShowSaveBtn(true);
    } catch (e) {
      setShowLoder(false);
      showToast('error', 'All Data Data Upload Failed!');
      console.log(e);
    }
  };

  const sendOtp = async () => {
    const url = `https://dexpense-rust.vercel.app/api/sendVerificationEmail`;
    try {
      setShowLoder(true);
      setShowEntry(false);
      let response = await axios.post(url, {email: createEmail});
      let record = response.data;
      if (record.success) {
        setShowOtpField(true);
        setShowLoder(false);
      }
    } catch (error) {
      setShowLoder(false);
      setShowEntry(true);
      showToast('error', 'Error Occurred While Sending Email');
      console.log(error);
    }
  };
  const verifyEmail = async () => {
    const url = `https://dexpense-rust.vercel.app/api/verifyOtp`;
    try {
      setShowEntry(false);
      setShowLoder(true);
      let response = await axios.post(url, {
        code: otp,
        email: createEmail,
      });
      let record = response.data;
      if (record.success) {
        setShowOtpField(false);
        setShowSubmitBtn(true);
        setShowLoder(false);
        setIsverified(true);
      }
    } catch (error) {
      setShowLoder(false);
      showToast('error', 'Error Occurred While Sending Email');
      console.log(error);
    }
  };

  const findCloudAccount = async () => {
    setShowLoder(true);
    await firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        try {
          let userRecord = snapShot.docs[0]._data;

          setDate(userRecord.date);
          setId(userRecord.id);
          if (userRecord) {
            showToast('success', 'Account Found');
            setShowFindAccountResult(true);
            setShowLoder(false);
            setShowUploadBtn(true);
            setShowFindAccount(false);
            setShowSaveBtn(true);
            setShowCreateAccount(false);
          } else {
            showToast('error', 'Account Not Found');
            setShowLoder(false);
            setShowFindAccount(false);
            setShowUploadBtn(false);
            setShowCreateAccount(false);
            setErrFindAccount(true);
          }
        } catch (e) {
          showToast('error', 'Account Not Found');
          setShowLoder(false);
          setShowFindAccount(false);
          setShowUploadBtn(false);
          setShowCreateAccount(false);
          setErrFindAccount(true);
          console.log(e);
        }
      })
      .catch(e => {
        showToast('error', 'Some Error Occured');
        setShowLoder(false);
        console.log(e);
        setShowFindAccount(false);
        setShowUploadBtn(false);
      });
  };
  const createAccount = async () => {
    setShowLoder(true);
    await firestore()
      .collection('users')
      .where('email', '==', createEmail)
      .get()
      .then(async snapShot => {
        let userRecord = snapShot.docs[0]._data;
        if (userRecord.email === createEmail) {
          showToast('error', 'Email Already Exists');
          setShowLoder(false);
          setShowCreateAccount(true);
        } else {
          const user = JSON.parse(await EncryptedStorage.getItem('user'))?.USER;
          await firestore()
            .collection('users')
            .doc(user.id)
            .set({
              date: Date.now(),
              id: user.id,
              addedBy: user.id,
              email: createEmail,
              name: user.name,
            })
            .then(() => {
              setShowLoder(false);
              setShowCreateAccount(false);
              showToast('success', 'User Account Created!');
            })
            .catch(e => {
              setShowLoder(false);
              showToast('error', 'User Account Creation Failed!');
              console.log(e);
            });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const showConfirmDialogUpload = id => {
    return Alert.alert('Hold On!', 'Are You Sure To Upload Data to Cloud!', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showLongToast('success', 'Data Not Uploaded to Cloud!'),
      },
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          uploadData();
        },
      },
    ]);
  };
  const showConfirmDialogBackup = id => {
    return Alert.alert(
      'Hold On!',
      'Save Data to This Device? This Will Erase Your Previous Data!',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
          onPress: () =>
            showLongToast('success', 'Data Not Saved to This Device!'),
        },
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            saveData();
          },
        },
      ],
    );
  };
  const showConfirmDialogDelete = id => {
    return Alert.alert(
      'Hold On!',
      'Delete All Data from Cloud? Please Backup All Data.',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
          onPress: () =>
            showLongToast('success', 'Data Not Deleted from Cloud!'),
        },
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            delCloudData();
          },
        },
      ],
    );
  };

  const saveData = async () => {
    let arr = [];
    await firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        let userRecord = snapShot.docs[0]._data;
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('user', JSON.stringify(arr));
      })
      .catch(e => {
        console.log(e);
      });
    await firestore()
      .collection('vehicles')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('vehicles', JSON.stringify(newData))
          .then(() => {
            showToast('success', 'Vehicle Saved Successfully');
          })
          .catch(e => {
            console.log(e);
            showToast('error', 'Vehicle Save Failed');
          });
      })
      .catch(e => {
        console.log(e);
      });
    await firestore()
      .collection('fueling')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('fueling', JSON.stringify(newData))
          .then(() => {
            showToast('success', 'Fueling Saved Successfully');
          })
          .catch(e => {
            console.log(e);
            showToast('error', 'Fueling Save Failed');
          });
      })
      .catch(e => {
        console.log(e);
      });
    await firestore()
      .collection('accounts')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('accounts', JSON.stringify(newData))
          .then(() => {
            showToast('success', 'Accounts Saved Successfully');
          })
          .catch(e => {
            console.log(e);
            showToast('error', 'Accounts Save Failed');
          });
      })
      .catch(e => {
        console.log(e);
      });
    await firestore()
      .collection('transactions')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('transactions', JSON.stringify(newData))
          .then(() => {
            showToast('success', 'Transactions Saved Successfully');
          })
          .catch(e => {
            console.log(e);
            showToast('error', 'Transactions Save Failed');
          });
      })
      .catch(e => {
        console.log(e);
      });
    await firestore()
      .collection('notes')
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        let newData = userRecord.sort((a, b) => b.date - a.date);
        newData.map(data => {
          data.downLoadedAt = Date.now();
          arr.push(data);
        });
        await EncryptedStorage.setItem('notes', JSON.stringify(newData))
          .then(() => {
            showToast('success', 'Notes Saved Successfully');
            setTimeout(() => navigation.navigate('Login'), 1000);
          })
          .catch(e => {
            console.log(e);
            showToast('error', 'Notes Save Failed');
          });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const delCloudData = async () => {
    await delAllCloudIds('vehicles')
      .then(() => {
        showToast('success', 'Vehicles Data Deleted from Cloud');
      })
      .catch(e => {
        console.log(e);
        showToast('error', 'Vehicles Data Deletion Failed');
      });
    await delAllCloudIds('fueling')
      .then(() => {
        showToast('success', 'Fueling Data Deleted from Cloud');
      })
      .catch(e => {
        console.log(e);
        showToast('error', 'Fueling Data Deletion Failed');
      });
    await delAllCloudIds('accounts')
      .then(() => {
        showToast('success', 'Accounts Data Deleted from Cloud');
      })
      .catch(e => {
        console.log(e);
        showToast('error', 'Accounts Data Deletion Failed');
      });
    await delAllCloudIds('transactions')
      .then(() => {
        showToast('success', 'Transactions Data Deleted from Cloud');
      })
      .catch(e => {
        console.log(e);
        showToast('error', 'Transactions Data Deletion Failed');
      });
    await delAllCloudIds('notes')
      .then(() => {
        showToast('success', 'Notes Data Deleted from Cloud');
      })
      .catch(e => {
        console.log(e);
        showToast('error', 'Notes Data Deletion Failed');
      });
  };

  const delExtraCloudIds = async (encName, databaseName) => {
    await firestore()
      .collection(databaseName)
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (userRecord.length > 0 && encName.length > 0) {
          let cloudIds = userRecord.map(itemY => {
            return itemY.id;
          });
          let userIds = encName.map(itemY => {
            return itemY.id;
          });

          let extraCloudIds = cloudIds.filter(item => !userIds.includes(item));
          let delIds = extraCloudIds.map(
            async item =>
              await firestore().collection(databaseName).doc(item).delete(),
          );
          await Promise.all(delIds).then(() => {
            showToast('success', 'All Previous Extra Cloud Data Deleted!');
          });
        } else if (userRecord.length > 0 && encName.length == 0) {
          return Alert.alert(
            'Hold On!',
            'You Have Not Saved Any Items, So All Your Previous Saved Data Will Be lost',
            [
              // The "No" button
              // Does nothing but dismiss the dialog when tapped
              {
                text: 'No',
                onPress: () =>
                  showToast(
                    'success',
                    'Your Previous Data Not Deleted form Cloud!',
                  ),
              },
              // The "Yes" button
              {
                text: 'Yes',
                onPress: async () => {
                  let cloudIds = userRecord.map(itemY => {
                    return itemY.id;
                  });
                  let delIds = cloudIds.map(
                    async item =>
                      await firestore()
                        .collection(databaseName)
                        .doc(item)
                        .delete(),
                  );
                  await Promise.all(delIds).then(() => {
                    showToast(
                      'success',
                      'All Previous Extra Cloud Data Deleted!',
                    );
                  });
                },
              },
            ],
          );
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const delAllCloudIds = async databaseName => {
    await firestore()
      .collection(databaseName)
      .where('email', '==', email)
      .get()
      .then(async snapShot => {
        const userRecord = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (userRecord.length > 0) {
          let cloudIds = userRecord.map(itemY => {
            return itemY.id;
          });

          let delIds = cloudIds.map(
            async item =>
              await firestore().collection(databaseName).doc(item).delete(),
          );
          await Promise.all(delIds).then(() => {
            showToast('success', `All Cloud Data in ${databaseName} Deleted!`);
          });
        } else {
          showToast('error', `No Cloud Data Present in ${databaseName}!`);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 500,
      position: 'top',
      topOffset: 500,
    });
  };
  const showLongToast = (type, text) => {
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
    getMyData();
  }, [isFocused]);
  useEffect(() => {}, [email, date, id]);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(8),
          marginTop: responsiveHeight(3),
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}>
        {showUPBtn ? (
          <View>
            <CustomButton
              title={'Change Your Name'}
              onClick={() => {
                setShowName(true);
                setShowUPBtn(!showUPBtn);
                setShowDelBtn(!showDelBtn);
                setShowBackUpBtn(false);
                setShowBackUpOption(false);
              }}
            />
          </View>
        ) : null}
        {showDelBtn ? (
          <View>
            <CustomButton
              title={'Delete App Data'}
              color={'darkred'}
              onClick={() => {
                setShowName(false);
                setShowUPBtn(false);
                setShowDelBtn(false);
                setShowClearBtn(true);
                setShowBackUpBtn(false);
                setShowBackUpOption(false);
              }}
            />
          </View>
        ) : null}
        {showBackUpBtn ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: THEME_COLOR,
              height: 50,
              marginTop: 10,
              width: responsiveWidth(75),
              borderRadius: 10,
            }}
            onPress={() => {
              setShowName(false);
              setShowUPBtn(false);
              setShowDelBtn(false);
              setShowBackUpBtn(false);
              setShowBackUpOption(true);
              setAcountOption(true);
            }}>
            <View style={{paddingRight: 10}}>
              <FontAwesome5 name="cloud-upload-alt" size={40} color={'white'} />
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontWeight: '700',
                paddingRight: 10,
              }}>
              Backup Your Data
            </Text>

            <FontAwesome5 name="cloud-download-alt" size={40} color={'white'} />
          </TouchableOpacity>
        ) : null}

        {showName ? (
          <View>
            <Text style={styles.heading}>Change Your Name</Text>
            <Text style={styles.dropDownText}>
              Your Current Name: {myData.name}
            </Text>
            <CustomTextInput
              value={name}
              onChangeText={text => setName(text)}
              placeholder={'Enter Your Name'}
            />
            <CustomButton
              title={'Update Your Name'}
              color={'blue'}
              onClick={nameChange}
            />
            <CustomButton
              title={'Cancel'}
              color={'purple'}
              onClick={() => {
                setShowName(false);
                setShowUPBtn(true);
                setShowDelBtn(true);
                setShowBackUpBtn(true);
              }}
            />
          </View>
        ) : null}
        {showClearBtn ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={[styles.heading, {color: 'red'}]}>
              {`Alert!!!\nThis Will Delete\n Your Saved Data!`}
            </Text>
            <CustomButton
              title={'Delete Fuelings'}
              color={'red'}
              onClick={async () => {
                Alert.alert(
                  'Hold On!',
                  'Are You Sure To Delete Vehicle & Fuelings!',
                  [
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                      text: 'No',
                      onPress: () =>
                        showLongToast('success', 'Data Not Deleted!'),
                    },
                    // The "Yes" button
                    {
                      text: 'Yes',
                      onPress: async () => {
                        await EncryptedStorage.removeItem('vehicles');
                        await EncryptedStorage.removeItem('fueling');
                        setActiveTab(0);
                      },
                    },
                  ],
                );
              }}
            />
            <CustomButton
              title={'Delete Expense'}
              color={'red'}
              onClick={async () => {
                Alert.alert(
                  'Hold On!',
                  'Are You Sure To Delete Accounts & Transactions!',
                  [
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                      text: 'No',
                      onPress: () =>
                        showLongToast('success', 'Data Not Deleted!'),
                    },
                    // The "Yes" button
                    {
                      text: 'Yes',
                      onPress: async () => {
                        await EncryptedStorage.removeItem('accounts');
                        await EncryptedStorage.removeItem('transactions');
                        setActiveTab(0);
                      },
                    },
                  ],
                );
              }}
            />
            <CustomButton
              title={'Delete Notes'}
              color={'red'}
              onClick={async () => {
                Alert.alert('Hold On!', 'Are You Sure To Delete Notes!', [
                  // The "No" button
                  // Does nothing but dismiss the dialog when tapped
                  {
                    text: 'No',
                    onPress: () =>
                      showLongToast('success', 'Data Not Deleted!'),
                  },
                  // The "Yes" button
                  {
                    text: 'Yes',
                    onPress: async () => {
                      await EncryptedStorage.removeItem('notes');
                      setActiveTab(0);
                    },
                  },
                ]);
              }}
            />

            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={async () => {
                setShowName(false);
                setShowUPBtn(true);
                setShowClearBtn(false);
                setShowDelBtn(true);
                setShowBackUpBtn(true);
              }}
            />
          </View>
        ) : null}

        {showBackUpOption ? (
          <View>
            {acountOption && (
              <View>
                <CustomButton
                  title={'Find Cloud Account'}
                  onClick={() => {
                    setShowCreateAccount(false);
                    setShowFindAccount(true);
                    setAcountOption(false);
                    setCreateEmail(email);
                    setShowEntry(true);
                    setOtp('');
                    setShowSubmitBtn(false);
                    setShowOtpField(false);
                    setIsverified(false);
                  }}
                />
                <CustomButton
                  title={'Create Account'}
                  onClick={() => {
                    setShowCreateAccount(true);
                    setShowFindAccount(false);
                    setAcountOption(false);
                    setCreateEmail(email);
                    setShowEntry(true);
                    setOtp('');
                    setShowSubmitBtn(false);
                    setShowOtpField(false);
                    setIsverified(false);
                  }}
                />
              </View>
            )}

            {showFindAccount && (
              <View>
                <Text style={styles.heading}>
                  {`Your Current Email:\n ${email}`}
                </Text>
                {showEntry && (
                  <CustomTextInput
                    value={createEmail}
                    type={'email-address'}
                    onChangeText={text => setCreateEmail(text)}
                    placeholder={'Enter Your Email'}
                  />
                )}
                {!isverified && !showOtpField && (
                  <CustomButton title="Send OTP" onClick={sendOtp} />
                )}
                {showOtpField && (
                  <View>
                    <CustomTextInput
                      value={otp}
                      placeholder={'Enter Your OTP'}
                      type={'number-pad'}
                      onChangeText={text => {
                        setOtp(text);
                      }}
                    />
                    <CustomButton title="Verify OTP" onClick={verifyEmail} />
                  </View>
                )}
                {showSubmitBtn && (
                  <CustomButton
                    title={'Find Account'}
                    onClick={findCloudAccount}
                  />
                )}
              </View>
            )}

            {errFindAccount && (
              <View>
                <CustomButton
                  color={'darkgreen'}
                  title={'Retry'}
                  onClick={() => {
                    setShowCreateAccount(false);
                    setShowFindAccount(true);
                    setInpPassword('');
                    setErrFindAccount(false);
                  }}
                />
                <CustomButton
                  title={'Create Account'}
                  onClick={() => {
                    setShowCreateAccount(true);
                    setShowFindAccount(false);
                    setInpPassword('');
                    setErrFindAccount(false);
                  }}
                />
              </View>
            )}

            {showFindAccountResult && (
              <View>
                <Text style={styles.heading}>Account Found</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.dropDownText}>
                    Saved At: {getDay(date)}
                  </Text>
                  <Text style={styles.dropDownText}> {getMonthName(date)}</Text>
                  <Text style={styles.dropDownText}> {getFullYear(date)}</Text>
                </View>
              </View>
            )}
            {showCreateAccount && (
              <View>
                <Text
                  style={[
                    styles.dropDownText,
                    {marginBottom: responsiveHeight(2)},
                  ]}>
                  Your Email is : {email}
                </Text>
                {showEntry && (
                  <View>
                    <Text style={styles.dropDownText}>Enter Your Email</Text>
                    <CustomTextInput
                      value={createEmail}
                      type={'email-address'}
                      onChangeText={text => setCreateEmail(text)}
                      placeholder={'Enter Your Email'}
                    />
                  </View>
                )}
                {!isverified && !showOtpField && (
                  <CustomButton title="Send OTP" onClick={sendOtp} />
                )}
                {showOtpField && (
                  <View>
                    <CustomTextInput
                      value={otp}
                      placeholder={'Enter Your OTP'}
                      type={'number-pad'}
                      onChangeText={text => {
                        setOtp(text);
                      }}
                    />
                    <CustomButton title="Verify OTP" onClick={verifyEmail} />
                  </View>
                )}
                {showSubmitBtn && (
                  <CustomButton
                    title={'Create Your Account'}
                    onClick={createAccount}
                  />
                )}
              </View>
            )}
            {showUploadBtn ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: THEME_COLOR,
                  height: 50,
                  marginTop: 10,
                  width: responsiveWidth(75),
                  borderRadius: 10,
                }}
                onPress={showConfirmDialogUpload}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    fontWeight: '700',
                    paddingRight: 10,
                  }}>
                  Upload Data to Cloud
                </Text>
                <FontAwesome5
                  name="cloud-upload-alt"
                  size={40}
                  color={'white'}
                />
              </TouchableOpacity>
            ) : null}
            {showSaveBtn ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: THEME_COLOR,
                  height: 50,
                  marginTop: 10,
                  width: responsiveWidth(75),
                  borderRadius: 10,
                }}
                onPress={showConfirmDialogBackup}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    fontWeight: '700',
                    paddingRight: 10,
                  }}>
                  Save Data To Device
                </Text>
                <FontAwesome5
                  name="cloud-download-alt"
                  size={40}
                  color={'white'}
                />
              </TouchableOpacity>
            ) : null}
            {showSaveBtn ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  height: 50,
                  marginTop: 10,
                  width: responsiveWidth(75),
                  borderRadius: 10,
                }}
                onPress={showConfirmDialogDelete}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    fontWeight: '700',
                    paddingRight: 10,
                  }}>
                  Delete All Cloud Data
                </Text>
                <FontAwesome5 name="trash" size={40} color={'white'} />
              </TouchableOpacity>
            ) : null}

            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={async () => {
                setShowName(false);
                setShowUPBtn(true);
                setShowClearBtn(false);
                setShowDelBtn(true);
                setShowBackUpOption(false);
                setShowBackUpBtn(true);
                setAcountOption(false);
                setShowBackUpOption(false);
                setShowFindAccount(false);
                setShowCreateAccount(false);
                setCreateEmail('');
                setInpPassword('');
                setPassword('');
                setConfPassword('');
                setErrFindAccount(false);
                setShowUploadBtn(false);
                setShowSaveBtn(false);
                setShowFindAccountResult(false);
                setOtp('');
                setShowSubmitBtn(false);
                setShowOtpField(false);
                setIsverified(false);
              }}
            />
          </View>
        ) : null}
      </ScrollView>
      <Toast />
      <Loader visible={showLoder} />
    </View>
  );
};

export default ChangeUP;

const styles = StyleSheet.create({
  heading: {
    fontSize: responsiveFontSize(3),
    fontWeight: '800',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
    alignSelf: 'center',
    color: THEME_COLOR,
    textAlign: 'center',
  },

  dropDownText: {
    fontSize: responsiveFontSize(2),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
