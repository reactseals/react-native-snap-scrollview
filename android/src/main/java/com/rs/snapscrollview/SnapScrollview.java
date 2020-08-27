package com.rs.snapscrollview;

import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.graphics.Rect;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactClippingViewGroup;
import com.facebook.react.views.scroll.ReactScrollView;

import java.util.ArrayList;
import java.util.List;

import androidx.annotation.Nullable;

public class SnapScrollview extends ReactScrollView {
    private @Nullable ObjectAnimator mAnimator = null;
    private @Nullable List<Integer> mSnapPoints;
    private int mStartSnapFromY = 0;

    public SnapScrollview(ReactContext context) {
        super(context);
    }

    public void animateScroll(int mDestX, int mDestY, int mDuration) {
        if (mAnimator != null) {
            mAnimator.cancel();
        }

        PropertyValuesHolder scrollX = PropertyValuesHolder.ofInt("scrollX", mDestX);
        PropertyValuesHolder scrollY = PropertyValuesHolder.ofInt("scrollY", mDestY);
        mAnimator = ObjectAnimator.ofPropertyValuesHolder(this, scrollX, scrollY);
        mAnimator.setDuration(mDuration).start();
    }

    public void setSnapPoints(List<Integer> snapPoints) {
        mSnapPoints = snapPoints;
    }

    public void setStartSnapFromY(int startSnapFromY) {
        mStartSnapFromY = startSnapFromY;
    }

    public int closest(int of, List<Integer> in) {
        int min = Integer.MAX_VALUE;
        int closest = of;

        for (int v : in) {
            final int diff = Math.abs(v - of);

            if (diff < min) {
                min = diff;
                closest = v;
            }
        }

        return closest;
    }

    @Override
    protected int computeScrollDeltaToGetChildRectOnScreen(Rect rect) {
        if (getChildCount() == 0)
            return 0;

        int height = getHeight();
        int screenTop = getScrollY();
        int screenBottom = screenTop + height;

        int fadingEdge = getVerticalFadingEdgeLength();

        // leave room for top fading edge as long as rect isn't at very top
        if (rect.top > 0) {
            screenTop += fadingEdge;
        }

        // leave room for bottom fading edge as long as rect isn't at very bottom
        if (rect.bottom < getChildAt(0).getHeight()) {
            screenBottom -= fadingEdge;
        }

        int scrollYDelta = 0;
        if (mSnapPoints != null && rect.top > mStartSnapFromY) {
            Log.d("CURRENT POSITION", String.valueOf(getScrollY()));
            Log.d("SCROLL DELTA", String.valueOf(scrollYDelta));
            Log.d("NEXT POSITION", String.valueOf(getScrollY() + scrollYDelta));
            Log.d("CLOSEST SNAP TO NEXT POSITION", String.valueOf(closest(getScrollY() + scrollYDelta, mSnapPoints)));
            int deltaToClosestSnap = closest(rect.top, mSnapPoints) - getScrollY();
            scrollYDelta = deltaToClosestSnap;

        } else {
            if (rect.bottom > screenBottom && rect.top > screenTop) {
                // need to move down to get it in view: move down just enough so
                // that the entire rectangle is in view (or at least the first
                // screen size chunk).

                if (rect.height() > height) {
                    // just enough to get screen size chunk on
                    scrollYDelta += (rect.top - screenTop);
                } else {
                    // get entire rect at bottom of screen
                    scrollYDelta += (rect.bottom - screenBottom);
                }

                // make sure we aren't scrolling beyond the end of our content
                int bottom = getChildAt(0).getBottom();
                int distanceToBottom = bottom - screenBottom;
                scrollYDelta = Math.min(scrollYDelta, distanceToBottom);

            } else if (rect.top < screenTop && rect.bottom < screenBottom) {
                // need to move up to get it in view: move up just enough so that
                // entire rectangle is in view (or at least the first screen
                // size chunk of it).

                if (rect.height() > height) {
                    // screen size chunk
                    scrollYDelta -= (screenBottom - rect.bottom);
                } else {
                    // entire rect at top
                    scrollYDelta -= (screenTop - rect.top);
                }

                // make sure we aren't scrolling any further than the top our content
                scrollYDelta = Math.max(scrollYDelta, -getScrollY());

            }
        }

        Log.d("REAL SCROLL DELTA", String.valueOf(scrollYDelta));
        Log.d("REAL NEXT POSITION", String.valueOf(getScrollY() + scrollYDelta));
        return scrollYDelta;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        if (mAnimator != null) {
            mAnimator.cancel();
            mAnimator = null;
        }
        return super.onTouchEvent(ev);
    }
}
