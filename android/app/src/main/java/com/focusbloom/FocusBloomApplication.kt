package com.focusbloom

import android.app.Application
import android.util.Log

/**
 * FocusBloomApplication — Main application class.
 *
 * Initializes the app and sets up crash reporting.
 */
class FocusBloomApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        Log.d("FocusBloom", "Application created")
    }
}
