package com.focusbloom

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * FocusBloomPackage — Registers the native modules with React Native.
 *
 * This package is registered in MainApplication.kt (or via Expo's
 * config plugin) to make the AppBlockerModule and UsageTrackerModule
 * available to the React Native JavaScript code.
 */
class FocusBloomPackage : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {
        return listOf(
            AppBlockerModule.create(reactContext),
            UsageTrackerModule.create(reactContext)
        )
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}
