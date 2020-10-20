package com.react_hybrid;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = GPSModule.NAME)
public class GPSModule extends ReactContextBaseJavaModule {
    public static final String NAME = "GPSModule";

    private GPSProvider locationProvider;

    public GPSModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return NAME;
    }

    // React interface

    @ReactMethod
    @SuppressWarnings("unused")
    public void configure(ReadableMap options, final Promise promise) {
        locationProvider = createStandardLocationProvider();
        // Pass the options to the location provider
        locationProvider.configure(getCurrentActivity(), options, promise);
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void startUpdatingLocation() {
        // Ensure we have a provider
        if (locationProvider == null) {
            locationProvider = createDefaultLocationProvider();
        }

        // Call the provider
        locationProvider.startUpdatingLocation();
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void stopUpdatingLocation() {
        // Ensure we have a provider
        if (locationProvider == null) {
            locationProvider = createDefaultLocationProvider();
        }

        // Call the provider
        locationProvider.stopUpdatingLocation();
    }

    // Helpers

    private ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
           
        }
    };

    private GPSProvider createDefaultLocationProvider() {
        return createStandardLocationProvider();
    }

    private GPSRealizeProvider createStandardLocationProvider() {
        return new GPSRealizeProvider(getReactApplicationContext());
    }
}

