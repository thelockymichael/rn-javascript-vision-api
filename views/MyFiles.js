import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native'
import List from '../components/List'
import PropTypes from 'prop-types'
import {FloatingAction} from 'react-native-floating-action'
import {
  Icon,
} from 'native-base'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

const actions = [
  {
    text: 'Take Photo',
    icon: <Icon name='camera' />,
    name: 'btn_camera',
    position: 2,
  },
  {
    text: 'Choose from gallery',
    icon: <Icon name='image' />,
    name: 'btn_gallery',
    position: 1,
  },
]

const MyFiles = ({navigation}) => {
  const getPermissionAsync = async (cameraPermissions) => {
    if (Platform.OS !== 'web') {
      let response
      if (cameraPermissions) {
        response = await Permissions.askAsync(Permissions.CAMERA_ROLL,
          cameraPermissions,
        )
      } else {
        response = await Permissions.askAsync(Permissions.CAMERA_ROLL,
        )
      }

      const {status} = response

      console.log('status', status)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }

      return status
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      })
      if (!result.cancelled) {
        return result
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  const takeImageHandler = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      })
      if (!result.cancelled) {
        return result
      }

      console.log('TAKEN IMAGE', result)
    } catch (err) {
      throw new Error(err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} all={false} />
      <FloatingAction
        actions={actions}
        onPressItem={async (name) => {
          console.log(`selected button: ${name}`)
          let hasPermission
          let image

          switch (name) {
            case 'btn_gallery':
              hasPermission = await getPermissionAsync()
              if (hasPermission) {
                image = await pickImage()
              }
              break
            case 'btn_camera':
              hasPermission = await getPermissionAsync(Permissions.CAMERA)
              if (hasPermission) {
                image = await takeImageHandler()
              }
              break
          }
          navigation.navigate('NewDocument',
            {newImage: image},
          )
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
})

MyFiles.propTypes = {
  navigation: PropTypes.object,
}


export default MyFiles
