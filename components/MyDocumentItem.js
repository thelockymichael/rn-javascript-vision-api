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
  Card, Container
} from 'native-base';
import {StyleSheet, } from 'react-native';
import {deleteFile} from '../hooks/APIhooks';
import AsyncStorage from '@react-native-community/async-storage';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const MyDocumentItem = ({navigation, singleMedia, editable}) => {
  const doDelete = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await deleteFile(singleMedia.file_id, userToken);
      console.log('delete a file', result);
      navigation.replace('MyFiles');
    }
    catch (e) {
      console.error(e);
    }
  };
  return (
    <NBListItem thumbnail style={{height: 125, padding: '1%'}}>
      <Card style={{borderRadius: 10}}>
        <Container style={styles.container}>
          <Button onPress={
            () => {
              navigation.navigate('Single', {file: singleMedia});
            }}>
            <Thumbnail
              square
              source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
            />
          </Button>
        </Container>
        <Text numberOfLines={1} style={styles.title}>{singleMedia.title}</Text>
      </Card>
    </NBListItem>
  );
};
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
    backgroundColor: 'grey',
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 3,
    paddingBottom: 7
  }
});

/**      <Right>
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
      </Right> */
MyDocumentItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  editable: PropTypes.bool,
};


export default MyDocumentItem;
