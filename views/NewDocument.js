import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Container, Content, Form, Spinner, Text} from 'native-base'
import FormTextInput from '../components/FormTextInput'
import {Image, Platform} from 'react-native'
import useUploadForm from '../hooks/UploadHooks'
import * as ImagePicker from 'expo-image-picker'
// eslint-disable-next-line no-unused-vars
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import {upload, postTag} from '../hooks/APIhooks'
import AsyncStorage from '@react-native-community/async-storage'
import {Video} from 'expo-av'
import {API_KEY, appIdentifier} from '../config/environment'


const Upload = ({navigation, route}) => {
  console.log('route.params', route.params)
  const [detectedText, setDetectedText] = useState()
  const newImage = route.params.newImage

  const [pickedImage, setPickedImage] = useState(newImage)
  const [isLoading, setIsLoading] = useState(false)
  const [fileType, setFileType] = useState('image')

  const doUpload = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      // lisätään tekstikentät formDataan
      formData.append('title', inputs.title)
      formData.append('description', inputs.description)

      // lisätään tiedosto formDataan
      const filename = image.split('/').pop()
      const match = /\.(\w+)$/.exec(filename)
      let type = match ? `${fileType}/${match[1]}` : fileType
      if (type === 'image/jpg') type = 'image/jpeg'


      formData.append('file', {uri: image, name: filename, type})
      const userToken = await AsyncStorage.getItem('userToken')
      const resp = await upload(formData, userToken)
      console.log('File uploaded: ', resp)

      const postTagResponse = await postTag({
        file_id: resp.file_id,
        tag: appIdentifier,
      }, userToken)
      console.log('posting tag:', postTagResponse)

      // wait for 2 secs
      setTimeout(() => {
        doReset()
        navigation.push('Home')
        setIsLoading(false)
      }, 2000)
    } catch (e) {
      console.log('upload error:', e.message)
      setIsLoading(false)
    }
    // Finally-haara toimisi muuten ookoo, mutta tässä tapauksessa asynkroninen
    // setTimeout sotkee. Eli jos halutaan piilottaa spinneri vasta asetetun
    // 2 sekunnin viiveen jälkeen, täytyy state muuttaa setTimeoutin yhteydessä
    //
    // } finally {
    //   setIsLoading(false);
    // }
  }
  /*
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!result.cancelled) {
        setImage(result.uri)
        setFileType(result.type)
      }
      console.log(result)
    } catch (err) {
      throw new Error(err)
    }
  } */
  /*
  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      console.log('status', status)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }
  useEffect(() => {
    getPermissionAsync()
  }, []) */

  useEffect(() => {
    const detectImageText = async () => {
      console.log('MAAGI', pickedImage.base64)
      /* console.log('IMAGUS BASUS', image.base64)
      const image = image.base64 */
      try {
        const body = JSON.stringify({
          requests: [
            {
              features: [
                {type: 'TEXT_DETECTION', maxResults: 1},
              ],
              image: {
                content: pickedImage.base64,
                // source: {
                //   image: image,
                // },
              },
            },
          ],
        })
        const response = await fetch(
          'https://vision.googleapis.com/v1/images:annotate?key=' +
          API_KEY,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: body,
          },
        )
        const responseJson = await response.json()
        console.log('resepos',
          responseJson
            .responses[0]
            .textAnnotations[0]
            .description)

        setDetectedText(responseJson
          .responses[0]
          .textAnnotations[0]
          .description)
      } catch (error) {
        console.log(error)
      }
    }
    detectImageText()
    // detectImageText() // Temp
  }, [pickedImage])


  const {
    handleInputChange,
    reset,
    uploadErrors,
    inputs,
  } = useUploadForm()

  const doReset = () => {
    reset()
    pickedImage(null)
    // console.log(inputs);
  }

  return (
    <Container>
      <Content padder>
        {pickedImage &&
          <>
            <Image
              source={{uri: pickedImage.uri}}
              style={{
                height: 400,
                width: null,
                flex: 1,
                resizeMode: 'contain',

              }}
            />
          </>
        }
        <Form>
          <FormTextInput
            autoCapitalize="none"
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            error={uploadErrors.title}
          />
          <FormTextInput
            autoCapitalize="none"
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            error={uploadErrors.description}
          />
          <Text>
            {detectedText}
          </Text>
        </Form>

        {isLoading && <Spinner />}
        <Button block onPress={doReset}>
          <Text>Reset</Text>
        </Button>
      </Content>
      <Button block
        disabled={(uploadErrors.title !== null ||
          uploadErrors.description !== null || pickedImage === null)}
        onPress={doUpload}>
        <Text>Upload</Text>
      </Button>
    </Container>
  )
}


Upload.propTypes = {
  navigation: PropTypes.object,
}


export default Upload