package com.mindcentralsmsnotifier;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class PowerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    PowerModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "PowerModule";
    }

    private boolean isIgnoringBatteryOptimizations() {

        String packageName = reactContext.getPackageName();
        PowerManager pm = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
        if (!pm.isIgnoringBatteryOptimizations(packageName)) {
            // You can view these logs from the terminal by typing:
            // adb logcat -s MindCentralSMSPowerModule
            Log.d("MindCentralSMSPowerModule", "Battery optimizations are NOT ignored");
            return false;
        }

        Log.d("MindCentralSMSPowerModule", "Battery optimizations are ignored");
        return true;
    }

    @ReactMethod
    public void isBatteryOptEnabled(Promise promise) {
        promise.resolve(this.isIgnoringBatteryOptimizations());
    }

    @ReactMethod
    public void openBatteryOptimizationSettings() {
        String packageName = reactContext.getPackageName();
        if (!this.isIgnoringBatteryOptimizations()) {
            Intent intent = new Intent();
            intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + packageName));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        }
    }

}
