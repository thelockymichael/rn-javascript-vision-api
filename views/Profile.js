import React, {useContext, useState, useEffect} from 'react'
import {Image, StyleSheet} from 'react-native'
import {AuthContext} from '../contexts/AuthContext'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import Colors from '../constants/Colors'
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Body,
  Button,
  Right,
  Left,
} from 'native-base'
import {getAvatar} from '../hooks/APIhooks'

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/'

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(AuthContext)
  const [avatar, setAvatar] = useState([{filename: ''}])

  const fetchAvatar = async () => {
    setAvatar(await getAvatar())
  }

  useEffect(() => {
    fetchAvatar()
  }, [])

  console.log('Profile.js', avatar[0].filename)

  console.log('logged in user data:', user)
  const logout = async () => {
    setIsLoggedIn(false)
    await AsyncStorage.clear()
    navigation.navigate('Authentication')
  }
  return (
    <Container >
      <Content padder>
        {user &&
          <Card >
            <CardItem header bordered>
              <Icon name='person' />
              <Text>{user.username}</Text>
            </CardItem>
            <CardItem bordered>
              <Left>
                {user.full_name != null ? <Text>{user.full_name}</Text> : <Text style={{color: Colors.redColor}}>No name set</Text>}
              </Left>
              <Right>
                <Button style={styles.changeButton}
                  onPress={() => {
                    navigation.navigate('ChangeName')
                  }}>
                  <Text>Change</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text style={{fontSize: 14}}>{user.email}</Text>
              </Left>
              <Right>
                <Button style={styles.changeButton}
                  onPress={() => {
                    navigation.navigate('ChangeEmail')
                  }}>
                  <Text>Change</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Button
                  style={styles.passwordButton}
                  onPress={() => {
                    navigation.navigate('ChangePassword')
                  }}>
                  <Text style={{marginLeft: 15}}>Change password</Text>
                </Button>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Button
                  style={styles.logoutButton}
                  onPress={logout}>
                  <Text style={{marginLeft: 22}}>Logout</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        }
      </Content>
    </Container>
  )
}
const styles = StyleSheet.create({
  passwordButton: {
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    width: 200,
  },
  logoutButton: {
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: 20,
    width: 130,
  },
  changeButton: {
    textAlign: 'center',
    backgroundColor: Colors.accentColor,
    borderRadius: 20,
    width: 90,
  },
  centeredText: {
    alignSelf: 'center',
  },
})

Profile.propTypes = {
  navigation: PropTypes.object,
}

export default Profile
