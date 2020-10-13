/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform, BackHandler, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CameraScreen from './screens/CameraScreen.js';
import HomeScreen from './screens/HomeScreen';
import ClickedPhoto from './screens/ClickedPhoto';
const Stack = createStackNavigator();
export default class App extends React.Component {
  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  firstClick = 0;
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid = () => {
    let timestamp = new Date().valueOf();
    if (timestamp - this.firstClick > 3000) {
      this.firstClick = timestamp;
      ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
      return true;
    } else {
      return false;
    }
  };
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ClickedPhoto"
            component={ClickedPhoto}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
