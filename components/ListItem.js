import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem as NBListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Right,
  Button,
  Icon,
} from 'native-base';
import {deleteFile} from '../hooks/APIhooks';
import AsyncStorage from '@react-native-community/async-storage';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = ({navigation, singleMedia, editable}) => {
  const doDelete = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await deleteFile(singleMedia.file_id, userToken);
      console.log('delete a file', result);
      navigation.replace('MyFiles');
      // TODO: prompt user before deleting
      // https://reactnative.dev/docs/alert
    }
    catch (e) {
      console.error(e);
    }
  };

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
            navigation.navigate('Single', {file: singleMedia});
          }}>
          <Icon name={'eye'}></Icon>
          <Text>View</Text>
        </Button>
        {editable && <>
          <Button success transparent onPress={
            () => {
              navigation.navigate('Modify', {file: singleMedia});
            }}>
            <Icon name={'create'}></Icon>
            <Text>Modify</Text>
          </Button>
          <Button danger transparent onPress={doDelete}>
            <Icon name={'trash'}></Icon>
            <Text>Delete</Text>
          </Button>
        </>
        }
      </Right>
    </NBListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  editable: PropTypes.bool,
};

export default ListItem;
