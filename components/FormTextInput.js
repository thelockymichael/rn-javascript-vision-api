import React from 'react'
import PropTypes from 'prop-types'
import {Item, Input, View, Label} from 'native-base'

const FormTextInput = ({style, error, inputLabel, ...otherProps}) => {
  return (
    <>
      <Item
        floatingLabel
      >
        <Label>
          {inputLabel}
        </Label>
        <Input
          {...otherProps}
        />
      </Item>
    </>
  )
}

FormTextInput.propTypes = {
  style: PropTypes.object,
  error: PropTypes.string,
  inputLabel: PropTypes.string,
}

export default FormTextInput
