import React from 'react';
import {View, Text} from 'react-native';
export function HomeScreen({ navigation }) {
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 20,
          justifyContent: 'center',
        }}>
        <Text>这是主页</Text>
      </View>
    </>
  );
}
