import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';

export default class ClickedPhoto extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {photo} = this.props.route.params;

    return (
      <View style={styles.container}>
        <Image
          style={styles.imageHolder}
          resizeMode="center"
          source={photo === 'empty' ? require('../assets/icon.png') : photo}
          width={width}
          height={height}
        />
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
  imageHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
