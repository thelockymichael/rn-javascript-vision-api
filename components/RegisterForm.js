import React, {
  useContext,
  useState,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Alert,
} from 'react-native'
import {AuthContext} from '../contexts/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import FormTextInput from './FormTextInput'
import useSignUpForm from '../hooks/RegisterHooks'
import {postRegistration, postLogIn} from '../hooks/APIhooks'
import {
  Button,
  Text,
  Form,
} from 'native-base'

const RegisterForm = ({navigation}) => {
  const [error, setError] = useState()
  const {setUser, setIsLoggedIn} = useContext(AuthContext)
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm()

  const doRegister = async () => {
    if (!validateOnSend()) {
      return
    }
    try {
      console.log('WASSUP', inputs)
      const result = await postRegistration({
        email: inputs.email,
        full_name: inputs.full_name,
        password: inputs.password,
        username: inputs.username,
      })

      console.log('new user created:', result)
      const userData = await postLogIn(inputs)
      await AsyncStorage.setItem('userToken', userData.token)
      setIsLoggedIn(true)
      setUser(userData.user)
    } catch (error) {
      Alert.alert('An Error Occurred!',
        'Username already exists.',
        [{text: 'Okay'}])
    }
  }

  console.log('RegisterForm', registerErrors)

  return (
    <Form style={styles.form}>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          checkUserAvailable(event)
          handleInputEnd('username', event)
        }}
        error={registerErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) => handleInputEnd('password', event)}
        secureTextEntry={true}
        error={registerErrors.password}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={(event) => handleInputEnd('confirmPassword', event)}
        secureTextEntry={true}
        error={registerErrors.confirmPassword}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => handleInputEnd('email', event)}
        error={registerErrors.email}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) => handleInputEnd('full_name', event)}
        error={registerErrors.full_name}
      />
      <Button style={styles.button} onPress={doRegister}>
        <Text style={{marginLeft: 25}}>Register!</Text>
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
    width: 150,
  },
  form: {
    width: 260,
    alignSelf: 'center',
  },
})

RegisterForm.propTypes = {
  navigation: PropTypes.object,
}

export default RegisterForm
