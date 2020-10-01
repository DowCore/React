import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'require(../assets/icon.png)',
    };
  }

  render() {
    console.log(this.props);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('CameraScreen');
          }}>
          <Icon name="id-card" size={25} color="yellow" />
          <Text style={{color: 'white', fontSize: 20, paddingVertical: 10}}>
            Take Snap
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    borderWidth: 0.5,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
  },
});
