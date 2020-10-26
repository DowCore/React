import React from 'react';
import {Alert, NativeModules, NativeEventEmitter} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
//import RNLocation from 'react-native-location';
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: null,
      lastPosition: null,
      location: null,
    };
  }
  watchID = '';
  RNLocation = null;
  eventEmitter = null;
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.sendMessage();
    });
    this.RNLocation = NativeModules.GPSModule;
    this.eventEmitter = new NativeEventEmitter(this.RNLocation);
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
    const emitterSubscription = this.eventEmitter.addListener(
      'locationUpdated',
      (locations) => {
        this.setState({location: locations[0]});
      },
    );
    this.RNLocation.startUpdatingLocation();
    /*RNLocation.configure({
      distanceFilter: 5.0,
      androidProvider: 'standard',
    }); */
    /*RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Location permission',
          message: 'We use your location to demo the library',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    }).then((granted) => {
      if (granted) {
        this._startUpdatingLocation();
      }
    }); */
  }
  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
    this._unsubscribe();
    this._stopUpdatingLocation();
  }
  onMessage(event) {
    console.log('接收到消息');
    console.log(event);
    let model = JSON.parse(event.nativeEvent.data);
    switch (model.type) {
      case 'camera':
        this.props.navigation.navigate('CameraScreen');
        break;
      case 'audio':
        this.props.navigation.navigate('AudioScreen');
        break;
      case 'geolocation':
        this.sendGeolocation();
        break;
    }
  }
  sendGeolocation() {
    console.log(this.state);
    let context = JSON.stringify({
      type: 'geolocation',
      data: {
        initialPosition: this.state.initialPosition,
        lastPosition: this.state.lastPosition,
        location: this.state.location,
      },
    });
    console.log(context);
    this.webref.postMessage(context);
  }
  sendMessage() {
    let context = '';
    if (this.props.route && this.props.route.params) {
      console.log('进入网页内容发送');
      let pars = this.props.route.params;
      switch (pars.view) {
        case 'camera':
        case 'audio':
        case 'video':
          context = JSON.stringify({type: pars.view, data: pars.data});
          break;
      }
    }
    console.log(context);
    this.webref.postMessage(context);
  }
  _startUpdatingLocation = () => {
    this.locationSubscription = this.RNLocation.subscribeToLocationUpdates(
      (locations) => {
        this.setState({location: locations[0]});
      },
    );
  };
  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    this.setState({location: null});
  };
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
        mixedContentMode={'always'}
        onShouldStartLoadWithRequest={(e) => {
          console.log('拦截', e);
          return true;
        }}
      />
    );
  }
}
