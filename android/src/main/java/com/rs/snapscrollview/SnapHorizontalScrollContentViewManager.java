package com.rs.snapscrollview;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactHorizontalScrollContainerViewManager;
import com.facebook.react.views.scroll.ReactHorizontalScrollViewManager;

public class SnapHorizontalScrollContentViewManager extends ReactHorizontalScrollContainerViewManager {
    public static final String REACT_CLASS = "SnapHorizontalScrollContainerView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public SnapHorizontalScrollContentView createViewInstance(ThemedReactContext c) {
        return new SnapHorizontalScrollContentView(c);
    }
}
