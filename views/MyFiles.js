import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native'
import MyDocumentList from '../components/MyDocumentList'
import PropTypes from 'prop-types'
import {
  Icon,
  Fab,
  Button, Container, Content
} from 'native-base'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

const MyFiles = ({navigation}) => {
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

  const buttonHandler = async (name) => {
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
  }

  return (
    <Container>
      <Content padder>
        <MyDocumentList navigation={navigation} all={false} />
      </Content>
      <Fab
          active={active}
          direction="up"
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => setActive(!active)}
        >
          <Icon name="add" />
          <Button
            style={{backgroundColor: '#34A34F'}}
            onPress={() => buttonHandler('btn_camera')}
          >
            <Icon name='camera' />
          </Button>
          <Button
            style={{backgroundColor: '#34A34F'}}
            onPress={() => buttonHandler('btn_gallery')}
          >
            <Icon name='image' />
          </Button>
        </Fab>
    </Container>
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
