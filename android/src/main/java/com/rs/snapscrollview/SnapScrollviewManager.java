/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.rs.snapscrollview;

import android.annotation.TargetApi;
import android.graphics.Color;
import android.util.DisplayMetrics;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactClippingViewGroupHelper;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ScrollEventType;
import com.facebook.yoga.YogaConstants;
import com.reactlibrary.SnapScrollview;
import com.reactlibrary.SnapScrollviewCommandHelper;
import com.reactlibrary.SnapScrollviewHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;

import androidx.core.view.ViewCompat;

public class SnapScrollviewManager extends ViewGroupManager<SnapScrollview>
        implements SnapScrollviewCommandHelper.ScrollCommandHandler<SnapScrollview> {

    public static final String REACT_CLASS = "SnapScrollview";

    private static final int[] SPACING_TYPES = { Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP,
            Spacing.BOTTOM, };

    private @Nullable FpsListener mFpsListener = null;

    public SnapScrollviewManager() {
        this(null);
    }

    public SnapScrollviewManager(@Nullable FpsListener fpsListener) {
        mFpsListener = fpsListener;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public SnapScrollview createViewInstance(ThemedReactContext context) {
        return new SnapScrollview(context);
    }

    @ReactProp(name = "scrollEnabled", defaultBoolean = true)
    public void setScrollEnabled(SnapScrollview view, boolean value) {
        view.setScrollEnabled(value);
    }

    @ReactProp(name = "showsVerticalScrollIndicator")
    public void setShowsVerticalScrollIndicator(SnapScrollview view, boolean value) {
        view.setVerticalScrollBarEnabled(value);
    }

    @ReactProp(name = "decelerationRate")
    public void setDecelerationRate(SnapScrollview view, float decelerationRate) {
        view.setDecelerationRate(decelerationRate);
    }

    @ReactProp(name = "snapToInterval")
    public void setSnapToInterval(SnapScrollview view, float snapToInterval) {
        // snapToInterval needs to be exposed as a float because of the Javascript
        // interface.
        DisplayMetrics screenDisplayMetrics = DisplayMetricsHolder.getScreenDisplayMetrics();
        view.setSnapInterval((int) (snapToInterval * screenDisplayMetrics.density));
    }

    @ReactProp(name = "snapToOffsets")
    public void setSnapToOffsets(SnapScrollview view, @Nullable ReadableArray snapToOffsets) {
        DisplayMetrics screenDisplayMetrics = DisplayMetricsHolder.getScreenDisplayMetrics();
        List<Integer> offsets = new ArrayList<Integer>();
        for (int i = 0; i < snapToOffsets.size(); i++) {
            offsets.add((int) (snapToOffsets.getDouble(i) * screenDisplayMetrics.density));
        }
        view.setSnapOffsets(offsets);
    }

    @ReactProp(name = "snapPoints")
    public void setSnapPoints(SnapScrollview view, @Nullable ReadableArray snapPoints) {
        DisplayMetrics screenDisplayMetrics = DisplayMetricsHolder.getScreenDisplayMetrics();
        List<Integer> points = new ArrayList<Integer>();
        for (int i = 0; i < snapPoints.size(); i++) {
            points.add((int) (snapPoints.getDouble(i) * screenDisplayMetrics.density));
        }
        view.setSnapPoints(points);
    }

    @ReactProp(name = "startSnapFromY", defaultInt = 0)
    public void setStartSnapFromY(SnapScrollview view, int startSnapFromY) {
        DisplayMetrics screenDisplayMetrics = DisplayMetricsHolder.getScreenDisplayMetrics();
        view.setStartSnapFromY((int) (startSnapFromY * screenDisplayMetrics.density));
    }

    @ReactProp(name = "snapToStart")
    public void setSnapToStart(SnapScrollview view, boolean snapToStart) {
        view.setSnapToStart(snapToStart);
    }

    @ReactProp(name = "snapToEnd")
    public void setSnapToEnd(SnapScrollview view, boolean snapToEnd) {
        view.setSnapToEnd(snapToEnd);
    }

    @ReactProp(name = ReactClippingViewGroupHelper.PROP_REMOVE_CLIPPED_SUBVIEWS)
    public void setRemoveClippedSubviews(SnapScrollview view, boolean removeClippedSubviews) {
        view.setRemoveClippedSubviews(removeClippedSubviews);
    }

    /**
     * Computing momentum events is potentially expensive since we post a runnable
     * on the UI thread to see when it is done. We only do that if
     * {@param sendMomentumEvents} is set to true. This is handled automatically in
     * js by checking if there is a listener on the momentum events.
     *
     * @param view
     * @param sendMomentumEvents
     */
    @ReactProp(name = "sendMomentumEvents")
    public void setSendMomentumEvents(SnapScrollview view, boolean sendMomentumEvents) {
        view.setSendMomentumEvents(sendMomentumEvents);
    }

    /**
     * Tag used for logging scroll performance on this scroll view. Will force
     * momentum events to be turned on (see setSendMomentumEvents).
     *
     * @param view
     * @param scrollPerfTag
     */
    @ReactProp(name = "scrollPerfTag")
    public void setScrollPerfTag(SnapScrollview view, @Nullable String scrollPerfTag) {
        view.setScrollPerfTag(scrollPerfTag);
    }

    @ReactProp(name = "pagingEnabled")
    public void setPagingEnabled(SnapScrollview view, boolean pagingEnabled) {
        view.setPagingEnabled(pagingEnabled);
    }

    /**
     * When set, fills the rest of the scrollview with a color to avoid setting a
     * background and creating unnecessary overdraw.
     *
     * @param view
     * @param color
     */
    @ReactProp(name = "endFillColor", defaultInt = Color.TRANSPARENT, customType = "Color")
    public void setBottomFillColor(SnapScrollview view, int color) {
        view.setEndFillColor(color);
    }

    /**
     * Controls overScroll behaviour
     */
    @ReactProp(name = "overScrollMode")
    public void setOverScrollMode(SnapScrollview view, String value) {
        view.setOverScrollMode(SnapScrollviewHelper.parseOverScrollMode(value));
    }

    @ReactProp(name = "nestedScrollEnabled")
    public void setNestedScrollEnabled(SnapScrollview view, boolean value) {
        ViewCompat.setNestedScrollingEnabled(view, value);
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        return SnapScrollviewCommandHelper.getCommandsMap();
    }

    @Override
    public void receiveCommand(SnapScrollview scrollView, int commandId, @Nullable ReadableArray args) {
        SnapScrollviewCommandHelper.receiveCommand(this, scrollView, commandId, args);
    }

    @Override
    public void flashScrollIndicators(SnapScrollview scrollView) {
        scrollView.flashScrollIndicators();
    }

    @Override
    public void scrollTo(SnapScrollview scrollView, SnapScrollviewCommandHelper.ScrollToCommandData data) {
        if (data.mAnimated && data.mDuration != 0) {
            if (data.mDuration > 0) {
                // data.mDuration set to -1 to fallbacks to default platform behavior
                scrollView.animateScroll(data.mDestX, data.mDestY, data.mDuration);
            } else {
                scrollView.smoothScrollTo(data.mDestX, data.mDestY);
            }
        } else {
            scrollView.scrollTo(data.mDestX, data.mDestY);
        }
    }

    @ReactPropGroup(names = { ViewProps.BORDER_RADIUS, ViewProps.BORDER_TOP_LEFT_RADIUS,
            ViewProps.BORDER_TOP_RIGHT_RADIUS, ViewProps.BORDER_BOTTOM_RIGHT_RADIUS,
            ViewProps.BORDER_BOTTOM_LEFT_RADIUS }, defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderRadius(SnapScrollview view, int index, float borderRadius) {
        if (!YogaConstants.isUndefined(borderRadius)) {
            borderRadius = PixelUtil.toPixelFromDIP(borderRadius);
        }

        if (index == 0) {
            view.setBorderRadius(borderRadius);
        } else {
            view.setBorderRadius(borderRadius, index - 1);
        }
    }

    @ReactProp(name = "borderStyle")
    public void setBorderStyle(SnapScrollview view, @Nullable String borderStyle) {
        view.setBorderStyle(borderStyle);
    }

    @ReactPropGroup(names = { ViewProps.BORDER_WIDTH, ViewProps.BORDER_LEFT_WIDTH, ViewProps.BORDER_RIGHT_WIDTH,
            ViewProps.BORDER_TOP_WIDTH, ViewProps.BORDER_BOTTOM_WIDTH, }, defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderWidth(SnapScrollview view, int index, float width) {
        if (!YogaConstants.isUndefined(width)) {
            width = PixelUtil.toPixelFromDIP(width);
        }
        view.setBorderWidth(SPACING_TYPES[index], width);
    }

    @ReactPropGroup(names = { "borderColor", "borderLeftColor", "borderRightColor", "borderTopColor",
            "borderBottomColor" }, customType = "Color")
    public void setBorderColor(SnapScrollview view, int index, Integer color) {
        float rgbComponent = color == null ? YogaConstants.UNDEFINED : (float) (color & 0x00FFFFFF);
        float alphaComponent = color == null ? YogaConstants.UNDEFINED : (float) (color >>> 24);
        view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent);
    }

    @ReactProp(name = "overflow")
    public void setOverflow(SnapScrollview view, @Nullable String overflow) {
        view.setOverflow(overflow);
    }

    @Override
    public void scrollToEnd(SnapScrollview scrollView, SnapScrollviewCommandHelper.ScrollToEndCommandData data) {
        // ScrollView always has one child - the scrollable area
        int bottom = scrollView.getChildAt(0).getHeight() + scrollView.getPaddingBottom();
        if (data.mAnimated && data.mDuration != 0) {
            if (data.mDuration > 0) {
                // data.mDuration set to -1 to fallbacks to default platform behavior
                scrollView.animateScroll(scrollView.getScrollX(), bottom, data.mDuration);
            } else {
                scrollView.smoothScrollTo(scrollView.getScrollX(), bottom);
            }
        } else {
            scrollView.scrollTo(scrollView.getScrollX(), bottom);
        }
    }

    @ReactProp(name = "persistentScrollbar")
    public void setPersistentScrollbar(SnapScrollview view, boolean value) {
        view.setScrollbarFadingEnabled(!value);
    }

    @Override
    public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return createExportedCustomDirectEventTypeConstants();
    }

    public static Map<String, Object> createExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(ScrollEventType.getJSEventName(ScrollEventType.SCROLL),
                        MapBuilder.of("registrationName", "onScroll"))
                .put(ScrollEventType.getJSEventName(ScrollEventType.BEGIN_DRAG),
                        MapBuilder.of("registrationName", "onScrollBeginDrag"))
                .put(ScrollEventType.getJSEventName(ScrollEventType.END_DRAG),
                        MapBuilder.of("registrationName", "onScrollEndDrag"))
                .put(ScrollEventType.getJSEventName(ScrollEventType.MOMENTUM_BEGIN),
                        MapBuilder.of("registrationName", "onMomentumScrollBegin"))
                .put(ScrollEventType.getJSEventName(ScrollEventType.MOMENTUM_END),
                        MapBuilder.of("registrationName", "onMomentumScrollEnd"))
                .build();
    }
}
