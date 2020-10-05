import AsyncStorage from '@react-native-community/async-storage'
import {Button, Container, Content, Icon, Text, Title, View, Card} from 'native-base'
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native'
import PropTypes from 'prop-types'
import React, {useContext, useEffect, useState} from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import {AuthContext} from '../contexts/AuthContext'
import {checkToken} from '../hooks/APIhooks'

const Login = ({navigation}) => { // props is needed for navigation
  const {setIsLoggedIn, setUser, user} = useContext(AuthContext)
  const [showRegistration, setShowRegistration] = useState(true)

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    console.log('token', userToken)
    if (userToken) {
      try {
        const userData = await checkToken(userToken)
        console.log('token valid', userData)
        setIsLoggedIn(true)
        setUser(userData)
      } catch (e) {
        console.log('token check failed', e.message)
      }
    }
  }
  useEffect(() => {
    getToken()
  }, [])

  console.log('Login.js', user)
  // Card element
  return (
    <Container >
      <Content padder >
        <Card style={styles.card}>
          {showRegistration ?
            <LoginForm navigation={navigation} /> :
            <RegisterForm navigation={navigation} />
          }
          <View style={{alignItems: 'center'}}>
            <Text onPress={() => {
              setShowRegistration(!showRegistration)
            }} style={{
              color: '#ff6666',
              marginTop: 15,
              marginBottom: 10,
            }}>
              {showRegistration ?
                'Switch to sign up' :
                'Back to sign in'}
            </Text>
          </View>
        </Card>
      </Content>
    </Container>
  )
}

// style={showRegistration ? styles.container : styles.registerContainer}>
const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    shadowColor: '#000',
    elevation: 6,
    width: 320,
    alignSelf: 'center',
  },
  registerContainer: {
    borderRadius: 30,
    shadowColor: '#000',
    elevation: 6,
  },
})


Login.propTypes = {
  navigation: PropTypes.object,
}

export default Login
