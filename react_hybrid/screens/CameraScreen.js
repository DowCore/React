import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: RNCamera.Constants.Type.back,
      isRecording: false,
    };
  }
  renderRecBtn() {
    return <Icon name="video-camera" size={25} color="#900" />;
  }

  renderStopRecBtn() {
    return <Icon name="stop-circle" size={25} color="#52c41a" />;
  }
  render() {
    const {isRecording} = this.state;
    const action = isRecording ? this.stopVideo : this.takeVideo;
    const button = isRecording ? this.renderStopRecBtn() : this.renderRecBtn();
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.cameraType}
          flashMode={RNCamera.Constants.FlashMode.auto}
          playSoundOnCapture={true}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') {
              return <Icon name="universal-access" size={30} color="#900" />;
            }
            return (
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => action()}
                  style={styles.capture}>
                  {button}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.takePicture.bind(this)}
                  style={styles.capture}>
                  <Icon name="camera" size={25} color="#900" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.switchCamera.bind(this)}
                  style={styles.capture}>
                  <Icon name="exchange" size={25} color="#900" />
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }
  switchCamera() {
    let state = this.state;
    if (state.cameraType === RNCamera.Constants.Type.back) {
      state.cameraType = RNCamera.Constants.Type.front;
    } else {
      state.cameraType = RNCamera.Constants.Type.back;
    }
    this.setState(state);
  }
  takePicture = async () => {
    console.log('开始拍照');
    let that = this;
    const options = {writeExif: true};
    this.camera
      .takePictureAsync(options)
      .then((response) => {
        ToastAndroid.show('拍照成功', ToastAndroid.SHORT);
        that.savePicture(response.uri);
      })
      .catch((error) => {
        ToastAndroid.show('拍照失败', ToastAndroid.SHORT);
        console.log(error);
      });
  };
  takeVideo = async () => {
    const {isRecording} = this.state;
    if (this.camera && !isRecording) {
      try {
        const promise = this.camera.recordAsync();
        if (promise) {
          this.setState({isRecording: true});
          const data = await promise;
          this.saveVideo(data.uri);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  stopVideo = async () => {
    const data = await this.camera.stopRecording();
    this.setState({isRecording: false});
  };
  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  savePicture = async (tag) => {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      ToastAndroid.show('无权限', ToastAndroid.SHORT);
      return;
    }
    let that = this;
    CameraRoll.save(tag, {type: 'photo', album: 'dow_album'})
      .then((result) => {
        let fileName = tag.substring(tag.lastIndexOf('/') + 1);
        let fullPath =
          'file://' + RNFS.PicturesDirectoryPath + '/dow_album/' + fileName;
        ToastAndroid.show('保存成功', ToastAndroid.SHORT);
        that.props.navigation.navigate('ClickedPhoto', {
          view: 'camera',
          data: fullPath,
        });
      })
      .catch(function (error) {
        ToastAndroid.show('保存失败', ToastAndroid.SHORT);
      });
  };
  saveVideo = async (tag) => {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      ToastAndroid.show('无权限', ToastAndroid.SHORT);
      return;
    }
    let that = this;
    CameraRoll.save(tag, {type: 'video', album: 'dow_album'})
      .then((result) => {
        let fileName = tag.substring(tag.lastIndexOf('/') + 1);
        let fullPath =
          'file://' + RNFS.PicturesDirectoryPath + '/dow_album/' + fileName;
        ToastAndroid.show('保存成功', ToastAndroid.SHORT);
        that.props.navigation.navigate('HomeScreen', {
          view: 'video',
          data: fullPath,
        });
      })
      .catch(function (error) {
        ToastAndroid.show('保存失败', ToastAndroid.SHORT);
      });
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
