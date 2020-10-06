import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {
  ListItem as NBListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Right,
  Button,
  Icon,
  Card,
  Container,
} from 'native-base'
import {StyleSheet} from 'react-native'
import {deleteFile} from '../hooks/APIhooks'
import AsyncStorage from '@react-native-community/async-storage'

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/'

const MyDocumentItem = ({navigation, singleMedia, editable}) => {
  return (
    // poista kosketus efekti tästä
      <NBListItem
        onPress={() => {
          navigation.navigate('Single', {file: singleMedia, editable})
        }}
        thumbnail
        style={{height: 125, padding: '1%'}}
      >
        <Card style={{borderRadius: 10}}>
          <Container style={styles.container}>
            <Thumbnail
              square
              source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
            />
          </Container>
          <Text numberOfLines={1} style={styles.title}>
            {singleMedia.title}
          </Text>
        </Card>
    </NBListItem>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 96,
    backgroundColor: '#cfcfcf',
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 3,
    paddingBottom: 7,
  },
})

MyDocumentItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  editable: PropTypes.bool,
}

export default MyDocumentItem
