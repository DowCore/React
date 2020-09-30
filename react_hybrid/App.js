/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//import CameraScreen from './screens/CameraScreen.js';
import HomeScreen from './screens/HomeScreen';
//import ClickedPhoto from './screens/ClickedPhoto';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'Camera',
              headerTintColor: 'black',
              headerStyle: {
                backgroundColor: '#A4B0BD',
              },
              animationEnabled: false,
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
