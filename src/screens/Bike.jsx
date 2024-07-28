import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  View,
  Modal,
  Dimensions,
  Alert,
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
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getDay, getFullYear, getMonthName} from '../modules/calculatefunctions';
const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import {useGlobalContext} from '../context/Store';
const Bike = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {state, setActiveTab, setStateObject} = useGlobalContext();
  const user = state.USER;
  const [disable, setDisable] = useState(true);
  const [visible, setVisible] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [showAddBike, setShowAddBike] = useState(false);
  const [bikeDetails, setBikeDetails] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [bikeName, setBikeName] = useState('');
  const [run, setRun] = useState('');
  const [petrolAdded, setPetrolAdded] = useState('');
  const [milage, setMilage] = useState('');
  const [editVehicle, setEditVehicle] = useState({});
  const [editBikeName, setEditBikeName] = useState('');
  const [editRun, setEditRun] = useState('');
  const [editPetrolAdded, setEditPetrolAdded] = useState('');
  const [editMilage, setEditMilage] = useState('');
  const [allBike, setAllBike] = useState([]);
  const docId = uuid.v4();
  const [editID, seteditID] = useState('');
  const [visibleItems, setVisibleItems] = useState(5);

  const [servicedAtDistance, setServicedAtDistance] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [oilChangedAt, setOilChangedAt] = useState('');
  const [nextOilChangeDistance, setNextOilChangeDistance] = useState('');

  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const calculateDate = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setDate(currentSelectedDate);

    setFontColor('black');
  };
  const [editservicedAtDistance, seteditServicedAtDistance] = useState('');
  const [editserviceCost, seteditServiceCost] = useState('');
  const [editoilChangedAt, seteditOilChangedAt] = useState('');
  const [editnextOilChangeDistance, seteditNextOilChangeDistance] =
    useState('');

  const [editfontColor, seteditFontColor] = useState(THEME_COLOR);
  const [editdate, seteditDate] = useState(new Date());
  const [editopen, seteditOpen] = useState(false);

  const editcalculateDate = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || editdate;
    seteditOpen('');
    seteditDate(currentSelectedDate);

    seteditFontColor('black');
  };

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
  };
  const getVehicle = async () => {
    setShowLoader(true);
    const existedVehicle = JSON.parse(
      await EncryptedStorage.getItem('vehicles'),
    );
    if (existedVehicle.length > 0) {
      let newData = existedVehicle.sort((a, b) => b.date - a.date);
      setShowLoader(false);
      setAllBike(newData);
      setVehicle(newData);
    } else {
      setShowLoader(false);
      showToast('error', 'No Vehicle is Added');
    }
  };
  const AddBike = async () => {
    if (bikeName !== '' && run !== '' && petrolAdded !== '' && milage !== '') {
      setShowLoader(true);
      let x = [
        ...vehicle,
        {
          id: docId,
          date: Date.now(),
          FirstDate: Date.now(),
          bikeName: bikeName,
          addedBy: state.USER.id,
          vehicleType: parseFloat(milage) > 30 ? 'Bike' : 'Car',
          url: '',
          photoName: '',
          totalRun: parseFloat(run),
          FirstTotalRun: parseFloat(run),
          petrolAdded: parseFloat(petrolAdded),
          FirstPetrolAdded: parseFloat(petrolAdded),
          milage: parseFloat(milage),
          FirstMilage: parseFloat(milage),
          servicedAtDistance:
            parseInt(servicedAtDistance) !== NaN
              ? parseInt(servicedAtDistance)
              : 0,
          FirstServicedAtDistance:
            parseInt(servicedAtDistance) !== NaN
              ? parseInt(servicedAtDistance)
              : 0,
          serviceCost:
            parseFloat(serviceCost) !== NaN ? parseFloat(serviceCost) : 0,
          FirstServiceCost:
            parseFloat(serviceCost) !== NaN ? parseFloat(serviceCost) : 0,
          serviceDate: Date.parse(date),
          FirstServiceDate: Date.parse(date),
          oilChangedAt:
            parseInt(oilChangedAt) !== NaN ? parseInt(oilChangedAt) : 0,
          FirstOilChangedAt:
            parseInt(oilChangedAt) !== NaN ? parseInt(oilChangedAt) : 0,
          nextOilChangeDistance:
            parseInt(nextOilChangeDistance) !== NaN
              ? parseInt(nextOilChangeDistance)
              : 0,
          FirstNextOilChangeDistance:
            parseInt(nextOilChangeDistance) !== NaN
              ? parseInt(nextOilChangeDistance)
              : 0,
          upLoadedAt: '',
          downLoadedAt: '',
          modifiedAt: '',
        },
      ].sort((a, b) => b.date - a.date);
      setVehicle(x);
      setAllBike(x);
      await EncryptedStorage.setItem('vehicles', JSON.stringify(x))
        .then(() => {
          setShowLoader(false);
          showToast('success', 'Vehicle Added Successfully');
          setShowAddBike(false);
          setBikeName('');
          setServicedAtDistance('');
          setServiceCost('');
          setOilChangedAt('');
          setNextOilChangeDistance('');
          setDate(new Date());
          setMilage('');
          setPetrolAdded('');
          setRun('');
          setBikeDetails(true);
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', e);
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

  const showConfirmDialog = id => {
    return Alert.alert('Hold On!', 'Are You Sure To Delete This Vehicle?', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showToast('success', 'Vehicle Not Deleted!'),
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
      let filteredVehicle = vehicle
        .filter(el => el.id !== id)
        .sort((a, b) => b.date - a.date);
      setVehicle(filteredVehicle);
      setAllBike(filteredVehicle);
      await EncryptedStorage.setItem(
        'vehicles',
        JSON.stringify(filteredVehicle),
      );

      let fueling = JSON.parse(await EncryptedStorage.getItem('fueling'));
      if (fueling.length > 0) {
        let filteredFueling = fueling.filter(el => el.bikeID !== id);
        if (filteredFueling.length > 0) {
          try {
            await EncryptedStorage.setItem(
              'fueling',
              JSON.stringify(filteredFueling),
            )
              .then(() => {
                setShowLoader(false);
                showToast('success', 'Vehicle Deleted Successfully');
              })
              .catch(e => {
                setShowLoader(false);
                showToast('error', 'Vehicle Deletation Failed');
                console.log(e);
              });
          } catch (e) {
            setShowLoader(false);
            showToast('error', 'Vehicle Deletation Failed');
            console.log(e);
          }
        } else {
          setShowLoader(false);
          showToast('success', 'Vehicle Deleted Successfully');
        }
      } else {
        setShowLoader(false);
        showToast('success', 'Vehicle Deleted Successfully');
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e);
    }
  };
  const updateData = async () => {
    if (
      editBikeName !== '' &&
      editRun !== '' &&
      editPetrolAdded !== '' &&
      editMilage !== ''
    ) {
      setShowLoader(true);

      let filteredVehicle = vehicle.filter(el => el.id !== editID);
      filteredVehicle = [
        ...filteredVehicle,
        {
          id: editID,
          vehicleType: parseFloat(editMilage) > 30 ? 'Bike' : 'Car',
          addedBy: user.id,
          email: user.email,
          bikeName: editBikeName,
          totalRun: parseFloat(editRun),
          milage: parseFloat(editMilage),
          petrolAdded: parseFloat(editPetrolAdded),
          date: Date.parse(editdate),
          servicedAtDistance:
            parseInt(editservicedAtDistance) !== NaN
              ? parseInt(editservicedAtDistance)
              : 0,
          serviceCost:
            parseFloat(editserviceCost) !== NaN
              ? parseFloat(editserviceCost)
              : 0,
          serviceDate: Date.parse(editdate),
          oilChangedAt:
            parseInt(editoilChangedAt) !== NaN ? parseInt(editoilChangedAt) : 0,
          nextOilChangeDistance: parseInt(editnextOilChangeDistance),
          upLoadedAt: editBikeName.upLoadedAt,
          downLoadedAt: editBikeName.downLoadedAt,
          modifiedAt: Date.now(),
        },
      ].sort((a, b) => b.date - a.date);
      setAllBike(filteredVehicle);
      setVehicle(filteredVehicle);

      await EncryptedStorage.setItem(
        'vehicles',
        JSON.stringify(filteredVehicle),
      ).catch(e => console.log(e));

      setShowLoader(false);
      setVisible(false);

      showToast('success', 'Details Updated Successfully');
    } else {
      showToast('error', 'Invalid Data');
    }
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
    getVehicle();
  }, [isFocused]);
  useEffect(() => {}, [isFocused]);
  useEffect(() => {}, [vehicle, allBike]);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{marginBottom: 80, marginTop: 20}}>
        {!visible && (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom: responsiveHeight(2),
            }}
            onPress={() => {
              setShowAddBike(!showAddBike);
              setBikeDetails(!bikeDetails);
              setBikeName('');
              setMilage('');
              setRun('');
              setPetrolAdded('');
              setServicedAtDistance('');
              setServiceCost('');
              setOilChangedAt('');
              setNextOilChangeDistance('');
              setDate(new Date());
            }}>
            <Feather
              name={showAddBike ? 'minus-circle' : 'plus-circle'}
              size={20}
              color={THEME_COLOR}
            />
            <Text style={styles.title}>
              {showAddBike ? 'Hide Add Vehicle' : 'Add New Vehicle'}
            </Text>
          </TouchableOpacity>
        )}
        {!visible && showAddBike && (
          <ScrollView
            style={{
              marginTop: responsiveHeight(1),
              marginBottom: responsiveHeight(1),
            }}>
            <Text style={styles.label}>Enter Vehicle Name</Text>
            <CustomTextInput
              placeholder={'Enter Vehicle Name'}
              value={bikeName}
              onChangeText={text => setBikeName(text)}
            />
            <Text style={styles.label}>Enter Current Run in KM e.g. 5000</Text>
            <CustomTextInput
              placeholder={'Enter Current Run in KM e.g. 5000'}
              type={'number-pad'}
              value={run}
              onChangeText={text => setRun(text.replace(/\s/g, ''))}
            />
            <Text style={styles.label}>Enter Current Run in KM e.g. 5000</Text>
            <CustomTextInput
              placeholder={'Enter Fuel Added in Litre e.g. 5.2'}
              type={'number-pad'}
              value={petrolAdded}
              onChangeText={text => setPetrolAdded(text.replace(/\s/g, ''))}
            />
            <Text style={styles.label}>Enter Apporx Milage in KM e.g 57</Text>
            <CustomTextInput
              placeholder={'Enter Apporx Milage in KM e.g 57'}
              type={'number-pad'}
              value={milage}
              onChangeText={text => setMilage(text.replace(/\s/g, ''))}
            />
            <Text style={styles.label}>Enter Previous Service Distance</Text>
            <CustomTextInput
              placeholder={'Enter Previous Service Distance'}
              type={'number-pad'}
              value={servicedAtDistance}
              onChangeText={text =>
                setServicedAtDistance(text.replace(/\s/g, ''))
              }
            />
            <Text style={styles.label}>Enter Previous Service Cost</Text>
            <CustomTextInput
              placeholder={'Enter Previous Service Cost'}
              type={'number-pad'}
              value={serviceCost}
              onChangeText={text => setServiceCost(text.replace(/\s/g, ''))}
            />
            <Text style={styles.label}>Enter Previous Oil Change Distance</Text>
            <CustomTextInput
              placeholder={'Enter Previous Oil Change Distance'}
              type={'number-pad'}
              value={oilChangedAt}
              onChangeText={text => setOilChangedAt(text.replace(/\s/g, ''))}
            />
            <Text style={styles.label}>Oil Validity In KM</Text>
            <CustomTextInput
              placeholder={'Oil Validity In KM'}
              type={'number-pad'}
              value={nextOilChangeDistance}
              onChangeText={text =>
                setNextOilChangeDistance(text.replace(/\s/g, ''))
              }
            />
            <View>
              <Text style={styles.label}>Enter Previous Service Date</Text>
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
                  {date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-
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
                  minimumDate={new Date(`01-01-${new Date().getFullYear()}`)}
                  display="default"
                  onChange={calculateDate}
                />
              )}
            </View>
            <CustomButton title={'Add Vehicle'} onClick={AddBike} />

            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => {
                setShowAddBike(false);
                setBikeName('');
                setMilage('');
                setRun('');
                setPetrolAdded('');
                setServicedAtDistance('');
                setServiceCost('');
                setOilChangedAt('');
                setNextOilChangeDistance('');
                setDate(new Date());
                setBikeDetails(true);
              }}
            />
          </ScrollView>
        )}
        <ScrollView>
          {!visible && bikeDetails && allBike.length
            ? allBike.slice(0, visibleItems).map((el, ind) => {
                return (
                  <ScrollView style={styles.itemView} key={ind}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: responsiveWidth(1),
                      }}
                      onPress={() => {
                        navigation.navigate('Bike Details');
                        setStateObject(el);
                      }}>
                      <Image
                        source={
                          el.milage > 30
                            ? require('../images/bike.png')
                            : require('../images/car.png')
                        }
                        style={{
                          width: responsiveWidth(30),
                          height: responsiveWidth(20),
                          borderRadius: responsiveWidth(2),
                        }}
                      />
                      <View
                        style={{
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          paddingLeft: responsiveWidth(2),
                          flexWrap: 'wrap',
                        }}>
                        <Text
                          style={[
                            styles.label,
                            {textAlign: 'center', flexWrap: 'wrap'},
                          ]}>
                          {`Vehicle Name: \n ${el.bikeName
                            .toUpperCase()
                            .slice(0, 15)}`}
                        </Text>
                        <Text style={styles.label}>
                          Total Run: {el.totalRun} KM
                        </Text>
                        <Text style={styles.label}>
                          Milage: {el.milage} KM/Ltr
                        </Text>
                        <Text style={styles.label}>
                          Last Fueled: {el.petrolAdded} Ltr
                        </Text>
                        <Text style={styles.label}>
                          Next Fuel: {el.totalRun + el.petrolAdded * el.milage}{' '}
                          KM
                        </Text>
                        <Text style={styles.label}>
                          Next Oil Change:{' '}
                          {el.nextOilChangeDistance + el.oilChangedAt} KM
                        </Text>
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
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(true);
                            setEditBikeName(el.bikeName);
                            setEditVehicle(el);
                            setEditRun(el.totalRun.toString());
                            setEditPetrolAdded(el.petrolAdded.toString());
                            setEditMilage(el.milage.toString());

                            seteditID(el.id);
                            seteditServicedAtDistance(
                              el.servicedAtDistance
                                ? el.servicedAtDistance.toString()
                                : '',
                            );
                            seteditServiceCost(
                              el.serviceCost ? el.serviceCost.toString() : '',
                            );
                            seteditOilChangedAt(
                              el.oilChangedAt ? el.oilChangedAt.toString() : '',
                            );
                            seteditNextOilChangeDistance(
                              el.nextOilChangeDistance
                                ? el.nextOilChangeDistance.toString()
                                : '',
                            );
                            seteditDate(
                              el.serviceDate
                                ? new Date(el.serviceDate)
                                : new Date(),
                            );
                          }}>
                          <Text>
                            <FontAwesome5 name="edit" size={25} color="blue" />
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{paddingTop: responsiveHeight(5)}}
                          onPress={() => {
                            showConfirmDialog(el.id, el.photoName);
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
          {bikeDetails
            ? visibleItems < allBike.length && (
                <CustomButton title={'Show More'} onClick={loadMore} />
              )
            : null}
        </ScrollView>
        {visible && (
          <ScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <CustomButton
              title={'Close'}
              color={'purple'}
              size={'small'}
              onClick={() => setVisible(false)}
            />
            <Text
              style={{
                fontSize: responsiveFontSize(3),
                fontWeight: '500',
                textAlign: 'center',
                color: THEME_COLOR,
              }}>
              Edit Vehicle Details
            </Text>

            <Text style={styles.label}>Enter Vehicle Name</Text>
            <CustomTextInput
              placeholder={'Enter Vehicle Name'}
              value={editBikeName}
              onChangeText={text => {
                setDisable(false);
                setEditBikeName(text);
              }}
            />
            <Text style={styles.label}>Enter Current Run</Text>
            <CustomTextInput
              placeholder={'Enter Current Run e.g. 5600'}
              type={'number-pad'}
              value={editRun}
              onChangeText={text => {
                setDisable(false);
                setEditRun(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>
              Enter Petrol Added in Litre e.g. 5.8
            </Text>
            <CustomTextInput
              placeholder={'Enter Petrol Added in Litre e.g. 5.8'}
              type={'number-pad'}
              value={editPetrolAdded}
              onChangeText={text => {
                setDisable(false);
                setEditPetrolAdded(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>Enter Apporx Milage in KM e.g. 52</Text>
            <CustomTextInput
              placeholder={'Enter Apporx Milage in KM e.g. 52'}
              type={'number-pad'}
              value={editMilage}
              onChangeText={text => {
                setDisable(false);
                setEditMilage(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>Enter Previous Service Distance</Text>
            <CustomTextInput
              placeholder={'Enter Previous Service Distance'}
              type={'number-pad'}
              value={editservicedAtDistance}
              onChangeText={text => {
                setDisable(false);
                seteditServicedAtDistance(text.replace(/\s/g, ''));
                seteditOilChangedAt(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>Enter Previous Service Cost</Text>
            <CustomTextInput
              placeholder={'Enter Previous Service Cost'}
              type={'number-pad'}
              value={editserviceCost}
              onChangeText={text => {
                setDisable(false);
                seteditServiceCost(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>Enter Previous Oil Change Distance</Text>
            <CustomTextInput
              placeholder={'Enter Previous Oil Change Distance'}
              type={'number-pad'}
              value={editoilChangedAt}
              onChangeText={text => {
                setDisable(false);
                seteditOilChangedAt(text.replace(/\s/g, ''));
              }}
            />
            <Text style={styles.label}>Oil Validity In KM</Text>
            <CustomTextInput
              placeholder={'Oil Validity In KM'}
              type={'number-pad'}
              value={editnextOilChangeDistance}
              onChangeText={text => {
                setDisable(false);
                seteditNextOilChangeDistance(text.replace(/\s/g, ''));
              }}
            />
            <View>
              <Text style={styles.label}>Enter Previous Service Date</Text>
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
                onPress={() => seteditOpen(true)}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    color: editfontColor,
                    paddingLeft: 14,
                  }}>
                  {editdate.getDate() < 10
                    ? '0' + editdate.getDate()
                    : editdate.getDate()}
                  -
                  {editdate.getMonth() + 1 < 10
                    ? `0${editdate.getMonth() + 1}`
                    : editdate.getMonth() + 1}
                  -{editdate.getFullYear()}
                </Text>
              </TouchableOpacity>

              {editopen && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={editdate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  minimumDate={new Date(`01-01-${new Date().getFullYear()}`)}
                  display="default"
                  onChange={editcalculateDate}
                />
              )}
            </View>

            <CustomButton
              title={'Update'}
              btnDisable={disable}
              onClick={updateData}
            />
            <CustomButton
              title={'Close'}
              color={'purple'}
              onClick={() => setVisible(false)}
            />
          </ScrollView>
        )}
      </ScrollView>
      <Loader visible={showLoader} />
      <Toast />
    </View>
  );
};

export default Bike;

const styles = StyleSheet.create({
  uploadPic: {
    borderColor: THEME_COLOR,
    borderWidth: 1,
    borderRadius: 20,
    width: responsiveHeight(44),
    height: responsiveHeight(25),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(1),
    color: THEME_COLOR,
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.2),
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
    fontSize: responsiveFontSize(1.2),
    color: 'darkred',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
