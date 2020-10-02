import {useState} from 'react';
import {validator} from '../utils/validator';
import {checkAvailable} from './APIhooks';

const constraints = {
  full_name: {
    length: {
      minimum: 3,
      message: 'minimum 3 characters',
    },
  },
};

const fullNameFrom = (callback) => {
  const [inputs, setInputs] = useState({
    full_name: '',
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
    const fullNameError = validator('full_name', inputs.full_name, constraints);

    setUpdateErrors((updateErrors) => ({
      ...updateErrors,
      full_name: fullNameError,
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

export default fullNameFrom;
