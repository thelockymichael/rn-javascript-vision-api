/* eslint-disable indent */
import React, {useState} from 'react'
import {
  Platform,
} from 'react-native'
import Colors from '../constants/Colors'
import {
  Icon,
  Fab,
  Button,
} from 'native-base'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'


const AddDocumentFab = ({navigation}) => {
  const [active, setActive] = useState(false)

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

      return false
    } catch (err) {
      throw new Error(err)
    }
  }

  const buttonHandler = async (name) => {
    let hasPermission
    let image

    switch (name) {
      case 'btn_gallery':
        hasPermission = await getPermissionAsync()
        if (hasPermission) {
          image = await pickImage()
          if (!image) {
            return
          }
          navigation.navigate('NewDocument',
            {newImage: image},
          )
        }
        break
      case 'btn_camera':
        hasPermission = await getPermissionAsync(Permissions.CAMERA)
        if (hasPermission) {
          image = await takeImageHandler()

          if (!image) {
            return
          }
          navigation.navigate('NewDocument',
            {newImage: image},
          )
        }
        break
    }
  }


  const buttonStyling = {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: Platform.OS === 'android' ?
      Colors.primaryColor : 'white',
  }

  const iconStyling = {
    color: Platform.OS === 'android' ?
      'white' : Colors.primaryColor,
  }

  return (
    <Fab
      active={active}
      direction="up"
      style={buttonStyling}
      position="bottomRight"
      onPress={() => setActive(!active)}
    >
      <Icon style={iconStyling} name="add" />
      <Button
        style={buttonStyling}
        onPress={() => buttonHandler('btn_camera')}
      >
        <Icon style={iconStyling} name='camera' />
      </Button>
      <Button
        style={buttonStyling}
        onPress={() => buttonHandler('btn_gallery')}
      >
        <Icon style={iconStyling} name='image' />
      </Button>
    </Fab>
  )
}

export default AddDocumentFab
