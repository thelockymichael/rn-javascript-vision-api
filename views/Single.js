/* eslint-disable react/display-name */
/* eslint-disable max-len */
import {Image, Alert} from 'react-native'
import React, {useEffect, useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons'
import CustomHeaderButton from '../components/HeaderButton'
import {
  Card,
  CardItem,
  Icon,
  Text,
  Content,
  Container,
  Accordion,
} from 'native-base'
import {Video} from 'expo-av'
import {getUser, favourite, deleteFavourite} from '../hooks/APIhooks'
import AsyncStorage from '@react-native-community/async-storage'
import * as ScreenOrientation from 'expo-screen-orientation'
import {AuthContext} from '../contexts/AuthContext'

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/'

import {deleteFile} from '../hooks/APIhooks'

const Single = ({navigation, route}) => {
  const [error, setError] = useState(false)
  const [owner, setOwner] = useState({})
  const {user, setUser} = useContext(AuthContext)

  const {file, editable} = route.params

  console.log('sinkku', file)


  const doDelete = () => {
    Alert.alert('Are you sure?',
      'Do you really want to delete this file?', [
      {text: 'No', style: 'default'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            const userToken = await AsyncStorage.getItem('userToken')
            const result = await deleteFile(file.file_id, userToken)
            console.log('delete a file', result)
            navigation.popToTop()
          } catch (e) {
            console.error(e)
          }
        },
      },
    ],
    )
  }

  const doFavourite = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      const result = await favourite(userToken, {file_id: file.file_id})
      console.log('delete a file', result)
      navigation.popToTop()
    } catch (e) {
      throw new Error(e)
    }
  }

  const removeFavourite = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      const result = await deleteFavourite(userToken, file.file_id)
      console.log('delete a file', result)
      navigation.popToTop()
    } catch (e) {
      throw new Error(e)
    }
  }


  const fetchOwner = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    setOwner(await getUser(file.user_id, userToken))
  }

  useEffect(() => {
    fetchOwner()

    let isFavourite = false
    if (Array.isArray(file.favourites) || file.favourites.length) {
      // array exists, is an array, or isn't empty
      // ⇒ attempt to process array
      isFavourite = file.favourites.some(
        (file) => file.user_id === user.user_id,
      )
    }

    editable ?
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons
            HeaderButtonComponent={CustomHeaderButton}
          >
            <Item
              title="modify"
              iconName='ios-create'
              onPress={() => navigation.navigate('Modify',
                {file: file})}
            />
            <Item
              title="delete"
              iconName="ios-trash"
              onPress={doDelete}
            />
            <Item
              title="favourite"
              iconName={isFavourite ? 'ios-heart' : 'ios-heart-empty'}
              onPress={isFavourite ? removeFavourite : doFavourite}
            />
          </HeaderButtons>
        ),
      }) :
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons
            HeaderButtonComponent={CustomHeaderButton}
          >
            <Item
              title="favourite"
              iconName={isFavourite ? 'ios-heart' : 'ios-heart-empty'}
              onPress={isFavourite ? removeFavourite : doFavourite}
            />
          </HeaderButtons>
        ),
      })
  }, [navigation])

  useEffect(() => {
    navigation.setOptions({headerTitle: file.title})
  }, [navigation, route])

  console.log('kuva', mediaUrl + file.filename)
  return (
    <Container>
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Icon name='person' />
            <Text>
              {owner.username}
            </Text>
          </CardItem>
          <CardItem cardBody>
            <>
              {file.media_type === 'image' ?
                <Image
                  source={{uri: mediaUrl + file.filename}}
                  style={{height: 400, width: null, flex: 1}}
                /> :
                <Video
                  ref={handleVideoRef}
                  source={{
                    uri:
                      error ? 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' :
                        mediaUrl + file.filename,
                  }}
                  style={{height: 400, width: null, flex: 1}}
                  useNativeControls={true}
                  resizeMode="cover"
                  posterSource={{uri: mediaUrl + file.screenshot}}
                  usePoster={true}
                  posterStyle={{height: 400, width: null}}
                  onError={(err) => {
                    console.log('video error', err)
                    setError(true)
                  }}
                />
              }
            </>
          </CardItem>
        </Card>
      </Content>
      {file.description &&
        <Accordion
          dataArray={[
            {title: 'Converted Text', content: file.description},
          ]}
        />
      }
    </Container>

  )
}


export default Single
