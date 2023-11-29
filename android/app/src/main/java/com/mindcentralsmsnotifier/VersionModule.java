package com.mindcentralsmsnotifier;

import java.util.ArrayList;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class VersionModule extends ReactContextBaseJavaModule {

    VersionModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "VersionModule";
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        WritableMap result = Arguments.createMap();

        result.putString("versionName", BuildConfig.VERSION_NAME);
        result.putInt("versionCode", BuildConfig.VERSION_CODE);

        promise.resolve(result);
    }
}
