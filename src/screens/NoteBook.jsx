import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Alert,
  Image,
  BackHandler,
  Switch,
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
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getDay, getFullYear, getMonthName} from '../modules/calculatefunctions';
import {useNavigation} from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import {secretKey} from '../modules/encryption';
const {width, height} = Dimensions.get('window');
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Image as Img} from 'react-native-compressor';
import {useGlobalContext} from '../context/Store';
const NoteBook = () => {
  const {state, setActiveTab, noteState, setNoteState, setStateObject} =
    useGlobalContext();
  const user = state.USER;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteBody, setEditNoteBody] = useState('');
  const [editID, seteditID] = useState('');
  const docId = uuid.v4();
  const [visibleItems, setVisibleItems] = useState(5);
  const [addImage, setAddImage] = useState(false);
  const [photoName, setPhotoName] = useState('');
  const [uri, setUri] = useState('');

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
  };
  const decryptData = hashtext => {
    let bytes = CryptoJS.AES.decrypt(hashtext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const addNote = async () => {
    if (noteTitle && noteBody) {
      setShowLoader(true);

      let cipherTitle = CryptoJS.AES.encrypt(noteTitle, secretKey).toString();
      let cipherBody = CryptoJS.AES.encrypt(noteBody, secretKey).toString();

      if (uri !== '') {
        const result = await Img.compress(uri, {
          progressDivider: 10,
          downloadProgress: progress => {
            console.log('downloadProgress: ', progress);
          },
        });
        const reference = storage().ref(
          `/noteImages/${docId.split('-')[0] + '-' + photoName}`,
        );
        const pathToFile = result;
        // uploads file
        await reference.putFile(pathToFile).then(async () => {
          let url = await storage()
            .ref(`/noteImages/${docId.split('-')[0] + '-' + photoName}`)
            .getDownloadURL();
          let x = [
            ...notes,
            {
              date: Date.now(),
              id: docId,
              noteTitle: cipherTitle,
              noteBody: cipherBody,
              addedBy: user.id,
              email: user.email,
              photoName: docId.split('-')[0] + '-' + photoName,
              uri: url,
              upLoadedAt: '',
              downLoadedAt: '',
              modifiedAt: '',
            },
          ].sort((a, b) => b.date - a.date);
          setNotes(x);
          setAllNotes(x);
          setNoteState(x);

          await EncryptedStorage.setItem('notes', JSON.stringify(x))
            .then(() => {
              setShowLoader(false);
              setShowAddNote(false);
              setShowNotes(true);
              showToast('success', 'Node Added Successfully');
              setPhotoName('');
              setAddImage(false);
              setUri('');
              console.log('Photo Attached Successfully');
            })
            .catch(e => {
              setShowLoader(false);
              showToast('error', e);
            });
        });
      } else {
        let x = [
          ...notes,
          {
            date: Date.now(),
            id: docId,
            noteTitle: cipherTitle,
            noteBody: cipherBody,
            addedBy: user.id,
            email: user.email,
            photoName: '',
            uri: '',
            upLoadedAt: '',
            downLoadedAt: '',
            modifiedAt: '',
          },
        ].sort((a, b) => b.date - a.date);
        setNotes(x);
        setAllNotes(x);
        setNoteState(x);
        await EncryptedStorage.setItem('notes', JSON.stringify(x))
          .then(() => {
            setShowLoader(false);
            setShowAddNote(false);
            setShowNotes(true);
            showToast('success', 'Node Added Successfully');
            console.log('Photo Not Attached');
          })
          .catch(e => {
            setShowLoader(false);
            showToast('error', e);
          });
      }
    } else {
      showToast('error', 'Invalid Data');
    }
  };

  const getNotes = async () => {
    setShowLoader(true);
    const existedNotes = JSON.parse(await EncryptedStorage.getItem('notes'));
    if (existedNotes.length > 0) {
      const newData = existedNotes.sort((a, b) => b.date - a.date);
      setShowLoader(false);
      setAllNotes(newData);
      setNotes(newData);
      setNoteState(newData);
    } else {
      setShowLoader(false);
      showToast('success', 'No Notes Added!');
    }
  };

  const showConfirmDialog = (id, photoName) => {
    return Alert.alert('Hold On!', 'Are You Sure To Delete This Note?', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showToast('success', 'Note Not Deleted!'),
      },
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          deleteData(id, photoName);
        },
      },
    ]);
  };
  const deleteData = async (id, photoName) => {
    const filteredNotes = notes
      .filter(el => el.id !== id)
      .sort((a, b) => b.date - a.date);
    setNotes(filteredNotes);
    setAllNotes(filteredNotes);
    setNoteState(filteredNotes);
    await EncryptedStorage.setItem('notes', JSON.stringify(filteredNotes))
      .then(async () => {
        try {
          await storage()
            .ref('/noteImages/' + photoName)
            .delete()
            .then(async () => {
              setShowLoader(false);
              showToast('success', 'Note Deleted Successfully');
            });
        } catch (e) {
          showToast('success', 'Note Deleted Successfully');
          setShowLoader(false);
          console.log(e);
        }
      })
      .catch(e => {
        setShowLoader(false);
        showToast('error', e);
        console.log(e);
      });
  };
  const updateData = async () => {
    if (editNoteTitle !== '' && editNoteBody !== '') {
      setShowLoader(true);
      let cipherEditTitle = CryptoJS.AES.encrypt(
        editNoteTitle,
        secretKey,
      ).toString();
      let cipherEditBody = CryptoJS.AES.encrypt(
        editNoteBody,
        secretKey,
      ).toString();

      const otherNotes = notes.filter(el => el.id !== editID);
      const filteredNotes = notes.filter(el => el.id === editID)[0];
      filteredNotes.noteTitle = cipherEditTitle;
      filteredNotes.noteBody = cipherEditBody;
      filteredNotes.modifiedAt = Date.now();
      const all = [...otherNotes, filteredNotes].sort(
        (a, b) => b.date - a.date,
      );
      setNotes(all);
      setAllNotes(all);
      setNoteState(all);
      await EncryptedStorage.setItem('notes', JSON.stringify(all))
        .then(() => {
          setShowLoader(false);
          setVisible(false);
          showToast('success', 'Details Updated Successfully');
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', 'Note Updation Failed!');
          console.log(e);
        });
    } else {
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
    if (noteState.length === 0) {
      getNotes();
    } else {
      setAllNotes(noteState);
    }
  }, [isFocused]);
  useEffect(() => {}, [notes]);

  return (
    <View>
      <ScrollView
        style={{
          marginTop: responsiveHeight(4),
          borderRadius: responsiveWidth(2),
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',

            marginBottom: responsiveHeight(1.5),
          }}
          onPress={() => {
            setShowAddNote(!showAddNote);
            setShowNotes(!showNotes);
            setNoteTitle('');
            setNoteBody('');
          }}>
          <Feather
            name={showAddNote ? 'minus-circle' : 'plus-circle'}
            size={20}
            color={THEME_COLOR}
          />
          <Text style={styles.title}>
            {showAddNote ? 'Hide Add Note' : 'Add New Note'}
          </Text>
        </TouchableOpacity>
        {showAddNote ? (
          <ScrollView
            style={{
              marginBottom: 80,
            }}>
            <CustomTextInput
              placeholder={'Enter Title'}
              value={noteTitle}
              onChangeText={text => setNoteTitle(text)}
            />
            <CustomTextInput
              placeholder={'Enter Your Note'}
              multiline={true}
              value={noteBody}
              size={'large'}
              onChangeText={text => setNoteBody(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: responsiveHeight(1),
                marginBottom: responsiveHeight(1),
              }}>
              <Text
                style={[styles.title, {paddingRight: responsiveWidth(1.5)}]}>
                Without Image
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={addImage ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setAddImage(!addImage);
                  if (addImage == true) {
                    setPhotoName('');
                    setUri('');
                  }
                }}
                value={addImage}
              />

              <Text style={[styles.title, {paddingRight: 5}]}>With Image</Text>
            </View>
            {addImage ? (
              <View style={{margin: responsiveHeight(1)}}>
                <Text style={[styles.label, {marginBottom: 5}]}>
                  Upload Note's Picture
                </Text>

                {uri == '' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={async () => {
                        await ImagePicker.openCamera({
                          // width: 400,
                          // height: 400,
                          cropping: true,
                          mediaType: 'photo',
                        })
                          .then(async image => {
                            setUri(image.path);
                            setPhotoName(
                              image.path.substring(
                                image.path.lastIndexOf('/') + 1,
                              ),
                            );
                          })
                          .catch(async e => {
                            console.log(e);
                            setUri(null);
                            await ImagePicker.clean()
                              .then(() => {
                                setShowLoader(false);
                                console.log(
                                  'removed all tmp images from tmp directory',
                                );
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          });
                      }}>
                      <Image
                        source={require('../images/camera.png')}
                        style={{
                          width: responsiveWidth(10),
                          height: responsiveWidth(10),
                          alignSelf: 'center',
                          tintColor: THEME_COLOR,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await ImagePicker.openPicker({
                          // width: 400,
                          // height: 400,
                          cropping: true,
                          mediaType: 'photo',
                        })
                          .then(async image => {
                            setUri(image.path);
                            setPhotoName(
                              image.path.substring(
                                image.path.lastIndexOf('/') + 1,
                              ),
                            );
                          })
                          .catch(async e => {
                            console.log(e);
                            setUri(null);
                            await ImagePicker.clean()
                              .then(() => {
                                setShowLoader(false);
                                console.log(
                                  'removed all tmp images from tmp directory',
                                );
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          });
                      }}
                      style={{paddingLeft: responsiveWidth(5)}}>
                      <Image
                        source={require('../images/gallery.png')}
                        style={{
                          width: responsiveWidth(12),
                          height: responsiveWidth(12),
                          alignSelf: 'center',
                          tintColor: THEME_COLOR,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: responsiveWidth(20),
                      height: responsiveHeight(3),

                      alignSelf: 'center',
                    }}
                    onPress={async () => {
                      await ImagePicker.openPicker({
                        // width: 400,
                        // height: 400,
                        cropping: true,
                        mediaType: 'photo',
                      })
                        .then(async image => {
                          setUri(image.path);
                          setPhotoName(
                            image.path.substring(
                              image.path.lastIndexOf('/') + 1,
                            ),
                          );
                        })
                        .catch(async e => {
                          console.log(e);
                          setUri(null);
                          await ImagePicker.clean()
                            .then(() => {
                              setShowLoader(false);
                              console.log(
                                'removed all tmp images from tmp directory',
                              );
                            })
                            .catch(e => {
                              console.log(e);
                            });
                        });
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Image
                          source={{uri: uri}}
                          style={{
                            width: 50,
                            height: 50,
                            alignSelf: 'center',
                            borderRadius: 5,
                          }}
                        />
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={async () => {
                            setPhotoName('');
                            setUri('');

                            setAddImage(false);
                            await ImagePicker.clean()
                              .then(() => {
                                setShowLoader(false);
                                console.log(
                                  'removed all tmp images from tmp directory',
                                );
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          }}>
                          <Text style={{color: 'red'}}>
                            <MaterialIcons name="cancel" size={20} />
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
            <View style={{marginTop: responsiveHeight(2)}}>
              <CustomButton
                title={'Add Note'}
                btnDisable={
                  noteTitle === '' || noteBody === '' || addImage
                    ? uri === ''
                    : false
                }
                onClick={addNote}
              />
              <CustomButton
                title={'Cancel'}
                color={'darkred'}
                onClick={() => {
                  setShowAddNote(false);
                  setShowNotes(true);
                  setNoteTitle('');
                  setNoteBody('');
                }}
              />
            </View>
          </ScrollView>
        ) : null}
      </ScrollView>
      <ScrollView style={{marginBottom: responsiveHeight(17)}}>
        {allNotes.length > 0 && showNotes
          ? allNotes.slice(0, visibleItems).map((el, ind) => {
              return (
                <ScrollView style={styles.itemView} key={ind}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: responsiveWidth(0.8),
                    }}
                    onPress={() => {
                      navigation.navigate('Note Details');
                      setStateObject(el);
                    }}>
                    <Image
                      source={require('../images/note.jpg')}
                      style={{
                        height: responsiveWidth(14),
                        width: responsiveWidth(14),
                        borderRadius: responsiveWidth(7),
                        paddingLeft: responsiveHeight(2),
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',

                        flexWrap: 'wrap',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={[
                          styles.label,
                          {
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            color: 'teal',
                          },
                        ]}>
                        {decryptData(el.noteTitle).toUpperCase().slice(0, 15)}
                      </Text>
                      {/* <Text
                        style={[
                          styles.label,
                          {textAlign: 'center', flexWrap: 'wrap'},
                        ]}>
                        Note: {decryptData(el.noteBody).slice(0, 20)}...
                      </Text> */}

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
                        padding: responsiveWidth(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setVisible(true);
                          seteditID(el.id);
                          setEditNoteTitle(decryptData(el.noteTitle));
                          setEditNoteBody(decryptData(el.noteBody));
                        }}>
                        <Text>
                          <FontAwesome5 name="edit" size={20} color="blue" />
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{paddingTop: responsiveHeight(2)}}
                        onPress={() => {
                          showConfirmDialog(el.id, el.photoName);
                        }}>
                        <Text>
                          <Ionicons name="trash-bin" size={20} color="red" />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              );
            })
          : null}
        {visibleItems < allNotes.length && (
          <CustomButton title={'Show More'} onClick={loadMore} />
        )}
      </ScrollView>
      <Modal animationType="slide" visible={visible} transparent>
        <View style={styles.modalView}>
          <View style={styles.mainView}>
            <Text
              style={{
                fontSize: responsiveFontSize(3),
                fontWeight: '500',
                textAlign: 'center',
                color: THEME_COLOR,
              }}>
              Edit Note
            </Text>
            <CustomTextInput
              placeholder={'Edit Note Title'}
              value={editNoteTitle}
              onChangeText={text => {
                setEditNoteTitle(text);
              }}
            />
            <CustomTextInput
              placeholder={'Edit Note'}
              size={'large'}
              value={editNoteBody}
              onChangeText={text => {
                setEditNoteBody(text);
              }}
            />

            <CustomButton title={'Update'} onClick={updateData} />
            <CustomButton
              title={'Close'}
              color={'purple'}
              onClick={() => setVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <Loader visible={showLoader} />
      <Toast />
    </View>
  );
};

export default NoteBook;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: 5,
    color: THEME_COLOR,
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '400',
    marginTop: responsiveHeight(1),
    color: THEME_COLOR,
  },
  itemView: {
    width: responsiveWidth(92),
    backgroundColor: 'white',

    alignSelf: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(0.5),
    padding: 5,
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
    height: responsiveWidth(80),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dropDownText: {
    fontSize: responsiveFontSize(1.8),
    color: 'royalblue',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
