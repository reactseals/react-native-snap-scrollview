/* eslint-disable id-length */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    requireNativeComponent,
    View,
    UIManager,
    StyleSheet,
    Platform,
    Scrollview,
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
    };

    static defaultProps = {
        children: null,
        contentContainerStyle: {},
        style: {},
    };

    componentDidMount() {
        setTimeout(() => {
            this.updateContentOffset();
        }, 10);
    }

    updateContentOffset = () => {
        const scrollableNode = findNodeHandle(this.snapSv);
        UIManager.dispatchViewManagerCommand(
            scrollableNode,
            UIManager.SnapScrollView.Commands.updateContentOffset,
            []
        );
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
            return <Scrollview {...this.props}>{children}</Scrollview>;
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
                ref={node => {
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
