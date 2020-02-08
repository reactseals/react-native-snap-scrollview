#import <React/RCTBridgeModule.h>
#import "React/RCTViewManager.h"
#import "React/RCTView.h"
#import <Foundation/Foundation.h>
#import <React/RCTScrollView.h>

@interface SnapScrollView : RCTView
    @property (nonatomic, assign) NSArray *snapPoints;
    @property (nonatomic, assign) BOOL *alignFocusedViewY;
    @property (nonatomic, assign) NSInteger *offsetFromFocusedView;
@end

@interface RCT_EXTERN_MODULE(SnapScrollViewManager, RCTViewManager)

RCT_EXTERN_METHOD(updateContentOffset:(nonnull NSNumber *)node)

//custom properties
RCT_EXPORT_VIEW_PROPERTY(snapPoints, NSArray)
RCT_EXPORT_VIEW_PROPERTY(alignFocusedViewY, BOOL)
RCT_EXPORT_VIEW_PROPERTY(offsetFromFocusedView, NSInteger)

//default properties
RCT_EXPORT_VIEW_PROPERTY(bounces, BOOL)
RCT_EXPORT_VIEW_PROPERTY(alwaysBounceHorizontal, BOOL)
RCT_EXPORT_VIEW_PROPERTY(alwaysBounceVertical, BOOL)
RCT_EXPORT_VIEW_PROPERTY(bouncesZoom, BOOL)
RCT_EXPORT_VIEW_PROPERTY(maximumZoomScale, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(minimumZoomScale, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(showsHorizontalScrollIndicator, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsVerticalScrollIndicator, BOOL)
RCT_EXPORT_VIEW_PROPERTY(canCancelContentTouches, BOOL)
RCT_EXPORT_VIEW_PROPERTY(centerContent, BOOL)
RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustContentInsets, BOOL)
RCT_EXPORT_VIEW_PROPERTY(decelerationRate, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(directionalLockEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(pinchGestureEnabled, scrollView.pinchGestureEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets)
RCT_EXPORT_VIEW_PROPERTY(scrollIndicatorInsets, UIEdgeInsets)
RCT_EXPORT_VIEW_PROPERTY(snapToInterval, int)
RCT_EXPORT_VIEW_PROPERTY(scrollEventThrottle, NSTimeInterval)
RCT_EXPORT_VIEW_PROPERTY(snapToAlignment, NSString)
RCT_EXPORT_VIEW_PROPERTY(onScrollBeginDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollEndDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMomentumScrollBegin, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMomentumScrollEnd, RCTDirectEventBlock)

@end
