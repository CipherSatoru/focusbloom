package com.focusbloom

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

/**
 * FocusBloomDeviceAdmin — Device admin receiver for anti-uninstall protection.
 *
 * When device admin is active, the user cannot uninstall the app without first
 * deactivating device admin in system settings. This adds deliberate friction
 * to the uninstall bypass.
 *
 * The user must:
 * 1. Open Settings
 * 2. Navigate to Security > Device Admin
 * 3. Deactivate FocusBloom
 * 4. Then uninstall the app
 *
 * This 30+ second process is enough to interrupt the compulsive reach for
 * the phone during a moment of craving.
 */
class FocusBloomDeviceAdmin : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Toast.makeText(
            context,
            "FocusBloom device admin enabled. Your blocks are now protected.",
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Toast.makeText(
            context,
            "FocusBloom device admin disabled. Blocks may be bypassed.",
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onPasswordChanged(context: Context, intent: Intent) {
        super.onPasswordChanged(context, intent)
    }
}
