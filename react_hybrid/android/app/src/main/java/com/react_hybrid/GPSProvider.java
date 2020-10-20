package com.react_hybrid;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

public interface GPSProvider {
    void configure(final Activity activity, final ReadableMap options, final Promise promise);
    void startUpdatingLocation();
    void stopUpdatingLocation();
}