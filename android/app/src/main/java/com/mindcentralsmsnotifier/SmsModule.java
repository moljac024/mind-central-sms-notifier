package com.mindcentralsmsnotifier;

import java.util.ArrayList;

import android.telephony.SmsManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class SmsModule extends ReactContextBaseJavaModule {

    SmsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SmsModule";
    }

    @ReactMethod
    public void sendSms(String phoneNumber, String message, Promise promise) {
        try {
            SmsManager smsManager = SmsManager.getDefault();

            ArrayList<String> parts = smsManager.divideMessage(message);
            smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null);

            // if (message.length() > 160) {
            // Log.d("MindCentralSMS", "Sending multipart message");

            // } else {
            // Log.d("MindCentralSMS", "Sending single part message");
            // smsManager.sendTextMessage(phoneNumber, null, message, null, null);
            // }

            promise.resolve("SMS Sent Successfully");
        } catch (Exception e) {
            promise.reject("SMS Failed", e.getMessage());
        }
    }
}
