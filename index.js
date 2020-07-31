/* eslint-disable id-length */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    requireNativeComponent,
    View,
    UIManager,
    StyleSheet,
    Platform,
    ScrollView,
    findNodeHandle,
} from 'react-native';

const NativeScrollView = requireNativeComponent('SnapScrollView');

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

class SnapScrollView extends Component {
    static propTypes = {
        children: PropTypes.node,
        contentContainerStyle: PropTypes.shape({}),
        style: PropTypes.shape({}),
        startSnapFromY: PropTypes.number,
        offsetFromFocusedView: PropTypes.number,
        alignFocusedViewY: PropTypes.bool,
        snapPoints: PropTypes.arrayOf(PropTypes.number),
    };

    static defaultProps = {
        children: null,
        contentContainerStyle: {},
        style: {},
        startSnapFromY: 0,
        offsetFromFocusedView: 0,
        alignFocusedViewY: false,
        snapPoints: [],
    };

    componentDidMount() {
        setTimeout(() => {
            this.updateContentOffset();
        }, 1);
    }

    componentDidUpdate() {
        // TODO UPDATE ONLY WHEN LAYOUT SIZE CHANGES
        setTimeout(() => {
            this.updateContentOffset();
        }, 1);
    }

    updateContentOffset = () => {
        if (Platform.isTVOS && this.snapSv) {
            const scrollableNode = findNodeHandle(this.snapSv);
            UIManager.dispatchViewManagerCommand(
                scrollableNode,
                UIManager.SnapScrollView.Commands.updateContentOffset,
                []
            );
        }
    };

    scrollTo = ({ x, y, animated }) => {
        const scrollableNode = findNodeHandle(this.snapSv);
        UIManager.dispatchViewManagerCommand(
            scrollableNode,
            UIManager.SnapScrollView.Commands.scrollTo,
            [x || 0, y || 0, animated !== false]
        );
    };

    render() {
        const { children, contentContainerStyle, style, ...restProps } = this.props;

        if (!Platform.isTVOS) {
            return <ScrollView {...this.props}>{children}</ScrollView>;
        }

        const baseStyle = [
            style,
            restProps.horizontal === true ? styles.baseHorizontal : styles.baseVertical,
        ];

        const contentContainerSt = [
            restProps.horizontal === true && styles.contentContainerHorizontal,
            contentContainerStyle,
        ];

        return (
            <NativeScrollView
                ref={(node) => {
                    this.snapSv = node;
                }}
                style={baseStyle}
                {...restProps}
            >
                <View style={contentContainerSt}>{children}</View>
            </NativeScrollView>
        );
    }
}

export default SnapScrollView;
