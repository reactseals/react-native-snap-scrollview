package com.rs.snapscrollview;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.scroll.ReactHorizontalScrollView;
import com.facebook.react.views.scroll.ReactScrollView;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.view.MotionEvent;

import androidx.annotation.Nullable;

public class SnapHorizontalScrollview extends ReactHorizontalScrollView {
    private @Nullable ObjectAnimator mAnimator = null;

    public SnapHorizontalScrollview(ReactContext context) {
        super(context);
    }

    /**
     * Method for animating to a ScrollView position with a given duration, instead
     * of using "smoothScrollTo", which does not expose a duration argument.
     */
    public void animateScroll(int mDestX, int mDestY, int mDuration) {
        if (mAnimator != null) {
            mAnimator.cancel();
        }
        PropertyValuesHolder scrollX = PropertyValuesHolder.ofInt("scrollX", mDestX);
        PropertyValuesHolder scrollY = PropertyValuesHolder.ofInt("scrollY", mDestY);
        mAnimator = ObjectAnimator.ofPropertyValuesHolder(this, scrollX, scrollY);
        mAnimator.setDuration(mDuration).start();
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
