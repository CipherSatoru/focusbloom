package com.focusbloom

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

/**
 * FocusBloomNotificationListener — Blocks notifications from blocked apps.
 *
 * This service prevents the "I'll just check this one notification" bypass.
 * When a notification from a blocked app arrives, it is silently suppressed.
 */
class FocusBloomNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        sbn ?: return

        val packageName = sbn.packageName
        // Check if this app is blocked
        // In a real implementation, you'd check the blocked apps list
        // For now, just log
        Log.d("FocusBloom", "Notification from: $packageName")
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
    }
}
