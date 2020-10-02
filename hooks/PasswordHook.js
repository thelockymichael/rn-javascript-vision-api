import {useState} from 'react';
import {validator} from '../utils/validator';
import {checkAvailable} from './APIhooks';

const constraints = {
  password: {
    presence: {
      message: 'Cannot be empty.',
    },
    length: {
      minimum: 5,
      message: 'needs to be at least 5 characters.',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
};

const PasswordForm = (callback) => {
  const [inputs, setInputs] = useState({
    password: '',
    confirmPassword: '',
  });
  const [updateErrors, setUpdateErrors] = useState({});

  const handleInputChange = (name, text) => {
    // handle just input, no validation
    // console.log('RegisterHooks.js', name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleInputEnd = (name, event) => {
    // dis is for validation
    // console.log('RegisterHooks.js', name, event.nativeEvent.text);
    const text = event.nativeEvent.text;
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    let error;
    if (name === 'confirmPassword') {
      error = validator(name, {
        password: inputs.password,
        confirmPassword: text,
      }, constraints);
    } else {
      error = validator(name, text, constraints);
    }

    setUpdateErrors((updateErrors) => {
      return {
        ...updateErrors,
        [name]: error,
      };
    });
  };

  const validateOnSend = () => {
    const passwordError = validator('password', inputs.password, constraints);
    const confirmError = validator('confirmPassword', {
      password: inputs.password,
      confirmPassword: inputs.confirm,
    }, constraints);
    setUpdateErrors((updateErrors) => ({
      ...updateErrors,
      password: passwordError,
      confirm: confirmError,
    }));


    for (const val of Object.values(updateErrors)) {
      console.log('validation error: ', val);
      if (val !== null) {
        return false;
      }
    }
    return true;
  };

  return {
    handleInputChange,
    handleInputEnd,
    validateOnSend,
    inputs,
    updateErrors: updateErrors,
  };
};

export default PasswordForm;
