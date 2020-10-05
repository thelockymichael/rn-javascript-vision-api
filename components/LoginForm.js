import React,
{
  useContext,
  useState,
  useEffect,
} from 'react'
import {
  Button,
  Text,
  Form,
} from 'native-base'
import {
  StyleSheet,
  Alert,
} from 'react-native'
import PropTypes from 'prop-types'
import {AuthContext} from '../contexts/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import {postLogIn} from '../hooks/APIhooks'
import FormTextInput from './FormTextInput'
import useLoginForm from '../hooks/LoginHooks'

const LoginForm = ({navigation}) => {
  const [error, setError] = useState()
  const {setIsLoggedIn, setUser} = useContext(AuthContext)
  const {
    handleInputChange, validateOnSend,
    inputs, loginErrors} = useLoginForm()

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!',
        error,
        [{text: 'Okay'}])
    }
  }, [error])

  const doLogin = async () => {
    if (!validateOnSend()) {
      return
    }
    try {
      const userData = await postLogIn(inputs)

      setIsLoggedIn(true)
      setUser(userData.user)
      await AsyncStorage.setItem('userToken', userData.token)
    } catch (error) {
      console.log('error.message', error.message)
      setError(error.message)
    }
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
