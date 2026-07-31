package com.focusbloom

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * FocusBloomBootReceiver — Re-applies blocks after device reboot.
 *
 * When the device reboots, all blocks are cleared by the system.
 * This receiver re-applies the blocks from the saved preferences,
 * ensuring that the user cannot bypass blocks by simply rebooting.
 */
class FocusBloomBootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {

            Log.d("FocusBloom", "Boot completed — re-applying blocks")

            // Re-apply blocks from SharedPreferences
            val prefs = context.getSharedPreferences("focusbloom_prefs", Context.MODE_PRIVATE)
            val blockedApps = prefs.all.filter { it.key.startsWith("blocked_") }

            // Restart the blocking service
            val serviceIntent = Intent(context, AppBlockerService::class.java)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        }
    }
}
