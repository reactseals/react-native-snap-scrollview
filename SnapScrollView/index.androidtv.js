const React = require('react');
import { requireNativeComponent, findNodeHandle, StyleSheet, Image, View, Platform } from "react-native";
import ScrollResponder from './ScrollResponder';
const ScrollViewStickyHeader = require('react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader');
const dismissKeyboard = require('react-native/Libraries/Utilities/dismissKeyboard');
const invariant = require('invariant');
const splitLayoutProps = require('react-native/Libraries/StyleSheet/splitLayoutProps');
const processDecelerationRate = require('react-native/Libraries/Components/ScrollView/processDecelerationRate');
// react-native-tvos > 0.64.2-0
const AnimatedImplementation = require('react-native/Libraries/Animated/AnimatedImplementation');

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

let AndroidScrollView;
let AndroidHorizontalScrollContentView;
let AndroidHorizontalScrollView;
let RCTScrollView;
let RCTScrollContentView;

if (Platform.OS === 'android') {
    AndroidScrollView = requireNativeComponent("SnapScrollview", null);
    AndroidHorizontalScrollView = requireNativeComponent(
        'SnapHorizontalScrollview', null
    );
    AndroidHorizontalScrollContentView = requireNativeComponent(
        'SnapHorizontalScrollContainerView',
    );
}

function createScrollResponder(
    node,
) {
    const scrollResponder = { ...ScrollResponder.Mixin };

    for (const key in scrollResponder) {
        if (typeof scrollResponder[key] === 'function') {
            scrollResponder[key] = scrollResponder[key].bind(node);
        }
    }

    return scrollResponder;
}

const Context = React.createContext(null);
const standardHorizontalContext = Object.freeze({
    horizontal: true,
});
const standardVerticalContext = Object.freeze({ horizontal: false });


class ScrollView extends React.Component {
    static Context = Context;

    _scrollResponder = createScrollResponder(this);

    constructor(props) {
        super(props);

        for (const key in ScrollResponder.Mixin) {
            if (
                typeof ScrollResponder.Mixin[key] === 'function' &&
                key.startsWith('scrollResponder')
            ) {
                // $FlowFixMe - dynamically adding properties to a class
                (this: any)[key] = ScrollResponder.Mixin[key].bind(this);
            }
        }

        Object.keys(ScrollResponder.Mixin)
            .filter(key => typeof ScrollResponder.Mixin[key] !== 'function')
            .forEach(key => {
                // $FlowFixMe - dynamically adding properties to a class
                (this: any)[key] = ScrollResponder.Mixin[key];
            });
    }

    _scrollAnimatedValue = new AnimatedImplementation.Value(
        0,
    );
    _scrollAnimatedValueAttachment: ?{ detach: () => void } = null;
    _stickyHeaderRefs: Map<string, StickyHeaderComponentType> = new Map();
    _headerLayoutYs: Map<string, number> = new Map();

    state: State = {
        layoutHeight: null,
        ...ScrollResponder.Mixin.scrollResponderMixinGetInitialState(),
    };

    UNSAFE_componentWillMount() {
        this._scrollResponder.UNSAFE_componentWillMount();
        this._scrollAnimatedValue = new AnimatedImplementation.Value(
            this.props.contentOffset ? this.props.contentOffset.y : 0,
        );
        this._scrollAnimatedValue.setOffset(
            /* $FlowFixMe(>=0.98.0 site=react_native_fb) This comment suppresses an
             * error found when Flow v0.98 was deployed. To see the error delete this
             * comment and run Flow. */
            this.props.contentInset ? this.props.contentInset.top : 0,
        );
        this._stickyHeaderRefs = new Map();
        this._headerLayoutYs = new Map();
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const currentContentInsetTop = this.props.contentInset
            ? this.props.contentInset.top
            : 0;
        const nextContentInsetTop = nextProps.contentInset
            ? nextProps.contentInset.top
            : 0;
        if (currentContentInsetTop !== nextContentInsetTop) {
            this._scrollAnimatedValue.setOffset(nextContentInsetTop || 0);
        }
    }

    componentDidMount() {
        this._updateAnimatedNodeAttachment();
    }

    componentDidUpdate() {
        this._updateAnimatedNodeAttachment();
    }

    componentWillUnmount() {
        this._scrollResponder.componentWillUnmount();
        if (this._scrollAnimatedValueAttachment) {
            this._scrollAnimatedValueAttachment.detach();
        }
    }

    setNativeProps(props: { [key: string]: mixed }) {
        this._scrollViewRef && this._scrollViewRef.setNativeProps(props);
    }

    /**
     * Returns a reference to the underlying scroll responder, which supports
     * operations like `scrollTo`. All ScrollView-like components should
     * implement this method so that they can be composed while providing access
     * to the underlying scroll responder's methods.
     */
    getScrollResponder() {
        // $FlowFixMe - overriding type to include ScrollResponder.Mixin
        return ((this: any));
    }

    getScrollableNode() {
        return findNodeHandle(this._scrollViewRef);
    }

    getInnerViewNode() {
        return findNodeHandle(this._innerViewRef);
    }

    getNativeScrollRef() {
        return this._scrollViewRef;
    }

    /**
     * Scrolls to a given x, y offset, either immediately or with a smooth animation.
     *
     * Example:
     *
     * `scrollTo({x: 0, y: 0, animated: true})`
     *
     * Note: The weird function signature is due to the fact that, for historical reasons,
     * the function also accepts separate arguments as an alternative to the options object.
     * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
     */
    scrollTo(
        options,
        deprecatedX,
        deprecatedAnimated,
        deprecatedDuration
    ) {
        let x, y, animated, duration;
        if (typeof options === 'number') {
            console.warn(
                '`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, ' +
                'animated: true})` instead.',
            );
            y = options;
            x = deprecatedX;
            animated = deprecatedAnimated;
            duration = deprecatedDuration;
        } else if (options) {
            y = options.y;
            x = options.x;
            animated = options.animated;
            duration = options.duration;
        }
        this._scrollResponder.scrollResponderScrollTo({
            x: x || 0,
            y: y || 0,
            animated: animated !== false,
            duration: duration,
        });
    }

    /**
     * If this is a vertical ScrollView scrolls to the bottom.
     * If this is a horizontal ScrollView scrolls to the right.
     *
     * Use `scrollToEnd({animated: true})` for smooth animated scrolling,
     * `scrollToEnd({animated: false})` for immediate scrolling.
     * If no options are passed, `animated` defaults to true.
     */
    scrollToEnd(options?: { animated?: boolean, duration?: number }) {
        // Default to true
        const animated = (options && options.animated) !== false;
        this._scrollResponder.scrollResponderScrollToEnd({
            animated: animated,
            duration: options && options.duration
        });
    }

    /**
     * Deprecated, use `scrollTo` instead.
     */
    scrollWithoutAnimationTo(y: number = 0, x: number = 0) {
        console.warn(
            '`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead',
        );
        this.scrollTo({ x, y, animated: false });
    }

    /**
     * Displays the scroll indicators momentarily.
     *
     * @platform ios
     */
    flashScrollIndicators() {
        this._scrollResponder.scrollResponderFlashScrollIndicators();
    }

    _getKeyForIndex(index, childArray) {
        const child = childArray[index];
        return child && child.key;
    }

    _updateAnimatedNodeAttachment() {
        if (this._scrollAnimatedValueAttachment) {
            this._scrollAnimatedValueAttachment.detach();
        }
        if (
            this.props.stickyHeaderIndices &&
            this.props.stickyHeaderIndices.length > 0
        ) {
            this._scrollAnimatedValueAttachment = AnimatedImplementation.attachNativeEvent(
                this._scrollViewRef,
                'onScroll',
                [{ nativeEvent: { contentOffset: { y: this._scrollAnimatedValue } } }],
            );
        }
    }

    _setStickyHeaderRef(key: string, ref: ?StickyHeaderComponentType) {
        if (ref) {
            this._stickyHeaderRefs.set(key, ref);
        } else {
            this._stickyHeaderRefs.delete(key);
        }
    }

    _onStickyHeaderLayout(index, event, key) {
        const { stickyHeaderIndices } = this.props;
        if (!stickyHeaderIndices) {
            return;
        }
        const childArray = React.Children.toArray(this.props.children);
        if (key !== this._getKeyForIndex(index, childArray)) {
            // ignore stale layout update
            return;
        }

        const layoutY = event.nativeEvent.layout.y;
        this._headerLayoutYs.set(key, layoutY);

        const indexOfIndex = stickyHeaderIndices.indexOf(index);
        const previousHeaderIndex = stickyHeaderIndices[indexOfIndex - 1];
        if (previousHeaderIndex != null) {
            const previousHeader = this._stickyHeaderRefs.get(
                this._getKeyForIndex(previousHeaderIndex, childArray),
            );
            previousHeader &&
                previousHeader.setNextHeaderY &&
                previousHeader.setNextHeaderY(layoutY);
        }
    }

    _handleScroll = (e: ScrollEvent) => {
        if (__DEV__) {
            if (
                this.props.onScroll &&
                this.props.scrollEventThrottle == null &&
                Platform.OS === 'ios'
            ) {
                console.log(
                    'You specified `onScroll` on a <ScrollView> but not ' +
                    '`scrollEventThrottle`. You will only receive one event. ' +
                    'Using `16` you get all the events but be aware that it may ' +
                    "cause frame drops, use a bigger number if you don't need as " +
                    'much precision.',
                );
            }
        }
        if (Platform.OS === 'android') {
            if (
                this.props.keyboardDismissMode === 'on-drag' &&
                this.state.isTouching
            ) {
                dismissKeyboard();
            }
        }
        this._scrollResponder.scrollResponderHandleScroll(e);
    };

    _handleLayout = (e: LayoutEvent) => {
        if (this.props.invertStickyHeaders === true) {
            this.setState({ layoutHeight: e.nativeEvent.layout.height });
        }
        if (this.props.onLayout) {
            this.props.onLayout(e);
        }
    };

    _handleContentOnLayout = (e: LayoutEvent) => {
        const { width, height } = e.nativeEvent.layout;
        this.props.onContentSizeChange &&
            this.props.onContentSizeChange(width, height);
    };

    _scrollViewRef: ?ScrollView = null;
    _setScrollViewRef = (ref: ?ScrollView) => {
        this._scrollViewRef = ref;
    };

    _innerViewRef = null;
    _setInnerViewRef = (ref) => {
        this._innerViewRef = ref;
    };

    render(): React.Node | React.Element<string> {
        let ScrollViewClass;
        let ScrollContentContainerViewClass;
        if (Platform.OS === 'android') {
            if (this.props.horizontal === true) {
                ScrollViewClass = AndroidHorizontalScrollView;
                ScrollContentContainerViewClass = AndroidHorizontalScrollContentView;
            } else {
                ScrollViewClass = AndroidScrollView;
                ScrollContentContainerViewClass = View;
            }
        } else {
            ScrollViewClass = RCTScrollView;
            ScrollContentContainerViewClass = RCTScrollContentView;
        }

        invariant(
            ScrollViewClass !== undefined,
            'ScrollViewClass must not be undefined',
        );

        invariant(
            ScrollContentContainerViewClass !== undefined,
            'ScrollContentContainerViewClass must not be undefined',
        );

        const contentContainerStyle = [
            this.props.horizontal === true && styles.contentContainerHorizontal,
            this.props.contentContainerStyle,
        ];
        if (__DEV__ && this.props.style !== undefined) {
            const style = StyleSheet.flatten(this.props.style);
            const childLayoutProps = ['alignItems', 'justifyContent'].filter(
                prop => style && style[prop] !== undefined,
            );
            invariant(
                childLayoutProps.length === 0,
                'ScrollView child layout (' +
                JSON.stringify(childLayoutProps) +
                ') must be applied through the contentContainerStyle prop.',
            );
        }

        let contentSizeChangeProps = {};
        if (this.props.onContentSizeChange) {
            contentSizeChangeProps = {
                onLayout: this._handleContentOnLayout,
            };
        }

        const { stickyHeaderIndices } = this.props;
        let children = this.props.children;

        if (stickyHeaderIndices != null && stickyHeaderIndices.length > 0) {
            const childArray = React.Children.toArray(this.props.children);

            children = childArray.map((child, index) => {
                const indexOfIndex = child ? stickyHeaderIndices.indexOf(index) : -1;
                if (indexOfIndex > -1) {
                    const key = child.key;
                    const nextIndex = stickyHeaderIndices[indexOfIndex + 1];
                    const StickyHeaderComponent =
                        this.props.StickyHeaderComponent || ScrollViewStickyHeader;
                    return (
                        <StickyHeaderComponent
                            key={key}
                            // $FlowFixMe - inexact mixed is incompatible with exact React.Element
                            ref={ref => this._setStickyHeaderRef(key, ref)}
                            nextHeaderLayoutY={this._headerLayoutYs.get(
                                this._getKeyForIndex(nextIndex, childArray),
                            )}
                            onLayout={event => this._onStickyHeaderLayout(index, event, key)}
                            scrollAnimatedValue={this._scrollAnimatedValue}
                            inverted={this.props.invertStickyHeaders}
                            scrollViewHeight={this.state.layoutHeight}>
                            {child}
                        </StickyHeaderComponent>
                    );
                } else {
                    return child;
                }
            });
        }
        children = (
            <Context.Provider
                value={
                    this.props.horizontal === true
                        ? standardHorizontalContext
                        : standardVerticalContext
                }>
                {children}
            </Context.Provider>
        );

        const hasStickyHeaders =
            Array.isArray(stickyHeaderIndices) && stickyHeaderIndices.length > 0;

        const contentContainer = (
            <ScrollContentContainerViewClass
                {...contentSizeChangeProps}
                // $FlowFixMe Invalid prop usage
                ref={this._setInnerViewRef}
                style={contentContainerStyle}
                removeClippedSubviews={
                    // Subview clipping causes issues with sticky headers on Android and
                    // would be hard to fix properly in a performant way.
                    Platform.OS === 'android' && hasStickyHeaders
                        ? false
                        : this.props.removeClippedSubviews
                }
                collapsable={false}>
                {children}
            </ScrollContentContainerViewClass>
        );

        const alwaysBounceHorizontal =
            this.props.alwaysBounceHorizontal !== undefined
                ? this.props.alwaysBounceHorizontal
                : this.props.horizontal;

        const alwaysBounceVertical =
            this.props.alwaysBounceVertical !== undefined
                ? this.props.alwaysBounceVertical
                : !this.props.horizontal;

        const DEPRECATED_sendUpdatedChildFrames = !!this.props
            .DEPRECATED_sendUpdatedChildFrames;

        const baseStyle =
            this.props.horizontal === true
                ? styles.baseHorizontal
                : styles.baseVertical;
        const props = {
            ...this.props,
            alwaysBounceHorizontal,
            alwaysBounceVertical,
            style: [baseStyle, this.props.style],
            // Override the onContentSizeChange from props, since this event can
            // bubble up from TextInputs
            onContentSizeChange: null,
            onLayout: this._handleLayout,
            onMomentumScrollBegin: this._scrollResponder
                .scrollResponderHandleMomentumScrollBegin,
            onMomentumScrollEnd: this._scrollResponder
                .scrollResponderHandleMomentumScrollEnd,
            onResponderGrant: this._scrollResponder
                .scrollResponderHandleResponderGrant,
            onResponderReject: this._scrollResponder
                .scrollResponderHandleResponderReject,
            onResponderRelease: this._scrollResponder
                .scrollResponderHandleResponderRelease,
            // $FlowFixMe
            onResponderTerminate: this._scrollResponder
                .scrollResponderHandleTerminate,
            onResponderTerminationRequest: this._scrollResponder
                .scrollResponderHandleTerminationRequest,
            onScrollBeginDrag: this._scrollResponder
                .scrollResponderHandleScrollBeginDrag,
            onScrollEndDrag: this._scrollResponder.scrollResponderHandleScrollEndDrag,
            onScrollShouldSetResponder: this._scrollResponder
                .scrollResponderHandleScrollShouldSetResponder,
            onStartShouldSetResponder: this._scrollResponder
                .scrollResponderHandleStartShouldSetResponder,
            onStartShouldSetResponderCapture: this._scrollResponder
                .scrollResponderHandleStartShouldSetResponderCapture,
            onTouchEnd: this._scrollResponder.scrollResponderHandleTouchEnd,
            onTouchMove: this._scrollResponder.scrollResponderHandleTouchMove,
            onTouchStart: this._scrollResponder.scrollResponderHandleTouchStart,
            onTouchCancel: this._scrollResponder.scrollResponderHandleTouchCancel,
            onScroll: this._handleScroll,
            scrollBarThumbImage: Image.resolveAssetSource(this.props.scrollBarThumbImage),
            scrollEventThrottle: hasStickyHeaders
                ? 1
                : this.props.scrollEventThrottle,
            sendMomentumEvents:
                this.props.onMomentumScrollBegin || this.props.onMomentumScrollEnd
                    ? true
                    : false,
            DEPRECATED_sendUpdatedChildFrames,
            // default to true
            snapToStart: this.props.snapToStart !== false,
            // default to true
            snapToEnd: this.props.snapToEnd !== false,
            // pagingEnabled is overridden by snapToInterval / snapToOffsets
            pagingEnabled: Platform.select({
                // on iOS, pagingEnabled must be set to false to have snapToInterval / snapToOffsets work
                ios:
                    this.props.pagingEnabled === true &&
                    this.props.snapToInterval == null &&
                    this.props.snapToOffsets == null,
                // on Android, pagingEnabled must be set to true to have snapToInterval / snapToOffsets work
                android:
                    this.props.pagingEnabled === true ||
                    this.props.snapToInterval != null ||
                    this.props.snapToOffsets != null,
            }),
        };

        const { decelerationRate } = this.props;
        if (decelerationRate != null) {
            props.decelerationRate = processDecelerationRate(decelerationRate);
        }

        const refreshControl = this.props.refreshControl;

        if (refreshControl) {
            if (Platform.OS === 'ios') {
                // On iOS the RefreshControl is a child of the ScrollView.
                // tvOS lacks native support for RefreshControl, so don't include it in that case
                return (
                    // $FlowFixMe
                    <ScrollViewClass {...props} ref={this._setScrollViewRef}>
                        {Platform.isTV ? null : refreshControl}
                        {contentContainer}
                    </ScrollViewClass>
                );
            } else if (Platform.OS === 'android') {
                // On Android wrap the ScrollView with a AndroidSwipeRefreshLayout.
                // Since the ScrollView is wrapped add the style props to the
                // AndroidSwipeRefreshLayout and use flex: 1 for the ScrollView.
                // Note: we should split props.style on the inner and outer props
                // however, the ScrollView still needs the baseStyle to be scrollable
                const { outer, inner } = splitLayoutProps(StyleSheet.flatten(props.style));
                return React.cloneElement(
                    refreshControl,
                    { style: [baseStyle, outer] },
                    <ScrollViewClass
                        {...props}
                        style={[baseStyle, inner]}
                        // $FlowFixMe
                        ref={this._setScrollViewRef}>
                        {contentContainer}
                    </ScrollViewClass>,
                );
            }
        }
        return (
            // $FlowFixMe
            <ScrollViewClass {...props} ref={this._setScrollViewRef}>
                {contentContainer}
            </ScrollViewClass>
        );
    }
}

const styles = StyleSheet.create({
    baseVertical: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'column',
        overflow: 'scroll',
    },
    baseHorizontal: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'row',
        overflow: 'scroll',
    },
    contentContainerHorizontal: {
        flexDirection: 'row',
    },
});

module.exports = ScrollView;
