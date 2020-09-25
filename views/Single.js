/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Left,
  Icon,
  Text,
  Content,
  Container,
} from 'native-base';
import {Video} from 'expo-av';
import {getUser} from '../hooks/APIhooks';
import AsyncStorage from '@react-native-community/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Single = ({route}) => {
  const [error, setError] = useState(false);
  const [owner, setOwner] = useState({});
  const [videoRef, setVideoRef] = useState(null);
  const {file} = route.params;

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    // console.log('svifs', videoRef);
    try {
      await videoRef.presentFullscreenPlayer();
    } catch (e) {
      console.log('svifs error', e.message);
    }
  };

  const unlock = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const lock = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  const fetchOwner = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    setOwner(await getUser(file.user_id, userToken));
  };

  useEffect(() => {
    unlock();
    fetchOwner();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  console.log('kuva', mediaUrl + file.filename);
  return (
    <Container>
      <Content padder>
        <Card>
          <CardItem>
            <Left>
              <Icon name={'image'} />
              <Text>{file.title}</Text>
            </Left>
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
                    console.log('video error', err);
                    setError(true);
                  }}
                />
              }
            </>
          </CardItem>
          <CardItem style={{flexDirection: 'column'}}>
            <Text>
              {file.description}
            </Text>
            <Text>
              By: {owner.username}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container>

  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
