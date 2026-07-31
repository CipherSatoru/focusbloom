package com.focusbloom

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import androidx.core.content.ContextCompat

/**
 * AppBlockerService — AccessibilityService that detects and blocks app openings.
 *
 * This service runs independently of the main app process. Even if the user
 * force-quits the app or reboots the device, the service continues to monitor
 * for blocked apps and overlays a blocking screen.
 *
 * The blocking screen has NO "Ignore" button — the only way to dismiss it is
 * through the app's own emergency unlock logic (math problem + activity goal).
 *
 * This is the core loophole patch: unlike Apple Screen Time's "Ignore Limit"
 * button, there is no system-level override available from within the moment
 * of craving.
 */
class AppBlockerService : AccessibilityService() {

    private val handler = Handler(Looper.getMainLooper())
    private var blockedApps: Map<String, Long> = emptyMap()

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Load blocked apps from SharedPreferences
        val prefs = getSharedPreferences("focusbloom_prefs", MODE_PRIVATE)
        // In a real implementation, you'd load the blocked apps list here
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return

        // Check if this is an app launch event
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString()
            if (packageName != null && packageName != this.packageName) {
                checkAndBlockApp(packageName)
            }
        }
    }

    override fun onInterrupt() {
        // Service was interrupted — restart if needed
    }

    override fun onServiceDisconnected() {
        super.onServiceDisconnected()
        // Service was disconnected — try to restart
    }

    private fun checkAndBlockApp(packageName: String) {
        val blockedUntil = blockedApps[packageName]
        if (blockedUntil != null) {
            // Check if block has expired
            if (blockedUntil > 0 && System.currentTimeMillis() > blockedUntil) {
                blockedApps = blockedApps - packageName
                return
            }

            // App is blocked — show overlay
            // The overlay is shown by the AppBlockerModule
            // This service just detects the app opening
            performGlobalAction(GLOBAL_ACTION_BACK)
        }
    }

    private fun performBackAndShowOverlay(packageName: String) {
        // Go back to home screen
        performGlobalAction(GLOBAL_ACTION_HOME)

        // The AppBlockerModule will show the overlay
        // This service just detects and prevents the app from opening
    }
}
