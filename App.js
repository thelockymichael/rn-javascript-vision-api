import React, {useState, useEffect} from 'react'
import Navigator from './navigators/Navigator'
import {AuthProvider} from './contexts/AuthContext'
import * as Expo from 'expo'
import * as Font from 'expo-font'
import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/variable01'
import {StyleProvider} from 'native-base'

const App = () => {
  const [fontReady, setFontReady] = useState(false)
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
    setFontReady(true)
  }
  useEffect(() => {
    loadFonts()
  }, [])

  if (!fontReady) {
    console.log('Waiting for fonts...')
    return (
      <Expo.AppLoading />
    )
  }
  return (
    <AuthProvider>
      <StyleProvider style={getTheme(material)}>

        <Navigator />
      </StyleProvider>

    </AuthProvider>
  )
}

export default App
