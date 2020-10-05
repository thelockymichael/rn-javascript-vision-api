import {StatusBar} from 'expo-status-bar'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {useLoadMedia} from '../hooks/APIhooks'
import {
  SafeAreaView, StyleSheet,
} from 'react-native'
import {
  Spinner,
  Header,
  Item,
  Input,
  Icon,
  Button,
} from 'native-base'
import List from '../components/List'
import Colors from '../constants/Colors'

const Search = ({navigation}) => {
  const [searchText, setSearchText] = useState(null)

  const {
    mediaArray,
    loadMedia,
    isRefreshing,
  } = useLoadMedia('ALL')

  const filteredMedia = mediaArray.filter((item) => {
    let search = ''
    if (searchText) search = searchText.toLowerCase().trim()

    if (item.title.toLowerCase().trim().includes(search)) {
      return item
    }
  })


  return (
    <SafeAreaView style={styles.container}>
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
      <List
        navigation={navigation}
        mediaArray={filteredMedia}
        loadMedia={loadMedia}
        isRefreshing={isRefreshing}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
})

Search.propTypes = {
  navigation: PropTypes.object,
}


export default Search
