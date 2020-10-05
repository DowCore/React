/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Alert, Platform, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CameraScreen from './screens/CameraScreen.js';
import HomeScreen from './screens/HomeScreen';
import ClickedPhoto from './screens/ClickedPhoto';
const Stack = createStackNavigator();

export default class App extends React.Component {
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid = () => {
    Alert.alert(
      '提示',
      '是否确定退出',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return true;
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            return false;
          },
        },
      ],
      {cancelable: false},
    );
    return true;
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
