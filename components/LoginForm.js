import React, {useContext} from 'react'
import {
  Button,
  Text,
  Form,
} from 'native-base'
import {
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import {AuthContext} from '../contexts/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import {postLogIn} from '../hooks/APIhooks'
import FormTextInput from './FormTextInput'
import useLoginForm from '../hooks/LoginHooks'

const LoginForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(AuthContext)
  const {
    handleInputChange, validateOnSend,
    inputs, loginErrors} = useLoginForm()

  const doLogin = async () => {
    if (!validateOnSend()) {
      console.log('validate on send failed')
      return
    }
    try {
      const userData = await postLogIn(inputs)
      console.log('user login success:', userData)
      setIsLoggedIn(true)
      setUser(userData.user)
      await AsyncStorage.setItem('userToken', userData.token)
    } catch (e) {
      console.log('login error', e.message)
    }
    // navigation.navigate('Home');
  }

  return (
    <Form style={styles.form}>
      <FormTextInput
        autoCapitalize="none"
        placeholder="Username *"
        onChangeText={(txt) => handleInputChange('username', txt)}
        error={loginErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="Password *"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        error={loginErrors.password}
      />
      <Button onPress={doLogin} style={styles.button}>
        <Text style={{marginLeft: 27}} >Login!</Text>
      </Button>
    </Form>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: '#23527c',
    borderRadius: 20,
    width: 130,
  },
  form: {
    width: 260,
    alignSelf: 'center',
  },
})

LoginForm.propTypes = {
  navigation: PropTypes.object,
}

export default LoginForm
