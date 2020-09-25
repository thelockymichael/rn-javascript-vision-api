import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
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
    name: 'bt_camera',
    position: 2,
  },
  {
    text: 'Choose from gallery',
    icon: <Icon name='image' />,
    name: 'bt_gallery',
    position: 1,
  },
]
const Home = ({navigation}) => {
  // const [image, setImage] = useState(null)

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
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
        // setImage(result.uri)

        return result
      }

      console.log('Home image', result)
    } catch (err) {
      throw new Error(err)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} all />
      <FloatingAction
        actions={actions}
        onPressItem={async (name) => {
          console.log(`selected button: ${name}`)
          switch (name) {
            case 'bt_gallery':
              const hasPermission = await getPermissionAsync()
              if (hasPermission) {
                const image = await pickImage()

                navigation.navigate('NewDocument',
                  {newImage: image},
                )
              }
              break
          }
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
})

Home.propTypes = {
  navigation: PropTypes.object,
}


export default Home
