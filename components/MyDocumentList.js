import React, {useContext} from 'react';
import {
  FlatList,
  View
} from 'react-native';
import MyDocumentItem from './MyDocumentItem';
import PropTypes from 'prop-types';
import {useLoadMedia} from '../hooks/APIhooks';
import {AuthContext} from '../contexts/AuthContext';
import {Spinner} from 'native-base'

const List = ({navigation, all}) => {
  const {user} = useContext(AuthContext);
  // console.log(user);
  const {
    mediaArray,
    loadMedia,
    isRefreshing,
  } = useLoadMedia(all, user.user_id)

  return (
    <>
      {isRefreshing ?
        <View
          style={{flex: 1}}
        >
          <Spinner />
        </View> :
        <FlatList
          numColumns={3}
          data={mediaArray}
          onRefresh={loadMedia}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <MyDocumentItem
              singleMedia={item}
              navigation={navigation}
              editable={!all}
            />
          }
        />
      }
    </>
  )


};

List.propTypes = {
  navigation: PropTypes.object,
  all: PropTypes.bool,
};

export default List;
