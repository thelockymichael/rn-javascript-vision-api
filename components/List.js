import React, {useContext, useEffect, useState} from 'react'
import {
  FlatList,
  View,
} from 'react-native'
import ListItem from './ListItem'
import PropTypes from 'prop-types'
import {useLoadMedia} from '../hooks/APIhooks'
import {
  Spinner,
  Header,
  Item,
  Input,
  Icon,
  Button,
} from 'native-base'
import Colors from '../constants/Colors'

const List = ({navigation, isRefreshing, mediaArray, loadMedia}) => {
  return (
    <>

      {isRefreshing ?
        <View
          style={{flex: 1}}
        >
          <Spinner />
        </View> :
        <FlatList
          data={mediaArray}
          onRefresh={loadMedia}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListItem
              singleMedia={item}
              navigation={navigation}
            />
          }
        />
      }
    </>
  )
}

List.propTypes = {
  navigation: PropTypes.object,
}

export default List
