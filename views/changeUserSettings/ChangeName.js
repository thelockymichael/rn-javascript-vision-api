import React, {useContext, useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {AuthContext} from '../../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../constants/Colors'
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
    Form
} from 'native-base';
import FormTextInput from '../../components/FormTextInput';
import fullNameFrom from '../../hooks/FullNameHook';
import {updateUserInfo, checkToken} from '../../hooks/APIhooks';


const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ChangeName = ({navigation}) => {
    const {setUser, setIsLoggedIn, user} = useContext(AuthContext);

    const {
        inputs,
        handleInputChange,
        handleInputEnd,
        updateErrors,
        validateOnSend,
    } = fullNameFrom();


    const doUpdate = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        if (!validateOnSend()) {
            console.log('validate on send failed');
            return;
        }
        try {
            console.log(inputs)
            const result = await updateUserInfo(inputs, userToken);
            console.log('updated info:', result);
            const userData = await checkToken(userToken)
            setUser(userData)
            navigation.goBack();
        } catch (e) {
            console.log('registeration error', e.message);
        }
    };
    return (
        <Form style={styles.form}>
            <FormTextInput
                autoCapitalize="none"
                placeholder={user.full_name}
                onChangeText={(txt) => handleInputChange('full_name', txt)}
                onEndEditing={(event) => handleInputEnd('full_name', event)}
                error={updateErrors.full_name}
            />
            <Button style={styles.button} onPress={doUpdate}>
                <Text style={{marginLeft: 30}}>Update</Text>
            </Button>
        </Form>
    );
};
const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        textAlign: 'center',
        backgroundColor: '#23527c',
        borderRadius: 20,
        width: 150
    },
    form: {
        width: 260,
        alignSelf: 'center'
    }
})

ChangeName.propTypes = {
    navigation: PropTypes.object,
};

export default ChangeName;
