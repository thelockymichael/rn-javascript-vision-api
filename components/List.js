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

const List = ({navigation, all}) => {
  const [searchText, setSearchText] = useState(null)
  // console.log(user);
  const {
    mediaArray,
    loadMedia,
    isRefreshing,
  } = useLoadMedia(all)

  const filteredMedia = mediaArray.filter((item) => {
    let search = ''
    if (searchText) search = searchText.toLowerCase().trim()

    if (item.title.toLowerCase().trim().includes(search)) {
      return item
    }
  })


  return (
    <>
      <Header
        searchBar
        rounded
        style={{

          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <Item>
          <Icon
            style={{
              color: Colors.primaryColor,
            }}
            name="ios-search" />
          <Input
            placeholder="Search"
            autoCapitalize="none"
            value={searchText}
            onChangeText={(txt) =>
              setSearchText(txt)
            }
          />
        </Item>
        <Button transparent>
        </Button>
      </Header>
      {isRefreshing ?
        <View
          style={{flex: 1}}
        >
          <Spinner />
        </View> :
        <FlatList
          data={filteredMedia}
          onRefresh={loadMedia}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListItem
              singleMedia={item}
              navigation={navigation}
              editable={!all}
            />
          }
        />
      }
    </>
  )
}

List.propTypes = {
  navigation: PropTypes.object,
  all: PropTypes.bool,
}

export default List
