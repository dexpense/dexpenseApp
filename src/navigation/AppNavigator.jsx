import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';

import Home from '../screens/Home';
import BikeDetails from '../screens/BikeDetails';
import AccountDetails from '../screens/AccountDetails';

import NoteDetails from '../screens/NoteDetails';
import ChangeUP from '../screens/ChangeUP';

const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Bike Details"
          component={BikeDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Account Details"
          component={AccountDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Note Details"
          component={NoteDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Change UP"
          component={ChangeUP}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
