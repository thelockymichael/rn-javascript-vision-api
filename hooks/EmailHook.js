import {useState} from 'react'
import {validator} from '../utils/validator'
import {checkAvailable} from './APIhooks'

const constraints = {
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'address is not valid',
    },
  },
}

const EmailFrom = (callback) => {
  const [inputs, setInputs] = useState({
    email: '',
  })
  const [updateErrors, setUpdateErrors] = useState({})

  const handleInputChange = (name, text) => {
    // handle just input, no validation
    // console.log('RegisterHooks.js', name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      }
    })
  }

  const handleInputEnd = (name, event) => {
    // dis is for validation
    // console.log('RegisterHooks.js', name, event.nativeEvent.text);
    const text = event.nativeEvent.text
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      }
    })
    let error
    if (name === 'confirmPassword') {
      error = validator(name, {
        password: inputs.password,
        confirmPassword: text,
      }, constraints)
    } else {
      error = validator(name, text, constraints)
    }

    setUpdateErrors((updateErrors) => {
      return {
        ...updateErrors,
        [name]: error,
      }
    })
  }

  const validateOnSend = () => {
    const emailError = validator('email', inputs.email, constraints)
    setUpdateErrors((updateErrors) => ({
      ...updateErrors,
      email: emailError,
    }))

    if (emailError !== null) {
      return false;
    } else {
      return true;
    }
  };

  return {
    handleInputChange,
    handleInputEnd,
    validateOnSend,
    inputs,
    updateErrors: updateErrors,
  }
}

export default EmailFrom
