import {View, LogBox, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import {GlobalContextProvider} from './src/context/Store';
import AppNavigator from './src/navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
LogBox.ignoreAllLogs();
const App = () => {
  return (
    <GlobalContextProvider>
      <View style={{flex: 1}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <KeyboardAvoidingView style={{flex: 1}}>
            <AppNavigator />
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </View>
    </GlobalContextProvider>
  );
};

export default App;
