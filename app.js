import React, { useEffect, useState } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { LogBox } from "react-native"
import "react-native-gesture-handler"
import { theme } from "@options"
import FlashMessage from "react-native-flash-message"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { NativeBaseProvider } from "native-base"
import Navigation from "src/navigation"
import { MenuProvider } from "react-native-popup-menu"
import { StripeProvider } from '@stripe/stripe-react-native';
import {SP_KEY} from '@env'
LogBox.ignoreLogs(["Warning: ..."])
LogBox.ignoreAllLogs()

import { store } from "src/redux/store"

const App = () => {
  const persistor = persistStore(store)

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <MenuProvider>
       <StripeProvider
      publishableKey={SP_KEY}
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
            <Navigation />
      </StripeProvider>
          </MenuProvider>
          <FlashMessage />
        </NativeBaseProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
