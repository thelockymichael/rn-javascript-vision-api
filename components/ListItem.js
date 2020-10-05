import React from 'react'
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
} from 'native-base'

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/'

const ListItem = ({navigation, singleMedia}) => {
  return (
    <NBListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
        />
      </Left>
      <Body>
        <Text>{singleMedia.title}</Text>
        <Text note numberOfLines={1}>{singleMedia.description}</Text>
      </Body>
      <Right>
        <Button transparent onPress={
          () => {
            navigation.navigate('Single', {file: singleMedia})
          }}>
          <Icon name={'eye'}></Icon>
          <Text>View</Text>
        </Button>
      </Right>
    </NBListItem>
  )
}

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  editable: PropTypes.bool,
}

export default ListItem
