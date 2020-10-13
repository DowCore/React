import React from 'react';
import {Alert, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
    };
  }
  watchID = '';
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.sendMessage();
    });
    Geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      () => () => {
        Alert.alert(
          '提示',
          '获取位置信息出错',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }
  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
    this._unsubscribe();
  }
  onMessage(event) {
    let model = JSON.parse(event.nativeEvent.data);
    switch (model.type) {
      case 'camera':
        this.props.navigation.navigate('CameraScreen');
        break;
      case 'geolocation':
        this.sendGeolocation();
        break;
    }
  }
  sendGeolocation() {
    let context = JSON.stringify({
      type: 'test',
      data: '位置' + this.state.initialPosition,
    });
    let js = `onMessage('${context}');true;`;
    this.webref.injectJavaScript(js);
  }
  sendMessage() {
    let context = '';
    if (this.props.route && this.props.route.params) {
      console.log('进入网页内容发送');
      let pars = this.props.route.params;
      switch (pars.view) {
        case 'camera':
          context = JSON.stringify({type: pars.view, data: pars.data});
          break;
      }
    }
    console.log('接收返回值');
    console.log(context);
    let js = `onMessage('${context}');true;`;
    this.webref.injectJavaScript(js);
  }
  render() {
    let source =
      // eslint-disable-next-line no-undef
      (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
      'web/index.html';
    return (
      <WebView
        ref={(r) => (this.webref = r)}
        source={{uri: source}}
        sharedCookiesEnabled={true}
        onMessage={this.onMessage.bind(this)}
      />
    );
  }
}
