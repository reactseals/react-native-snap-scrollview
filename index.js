import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent, View, UIManager, findNodeHandle } from 'react-native';

const NativeScrollView = requireNativeComponent('SnapScrollView');

class SnapScrollView extends Component {
    static propTypes = {
        children: PropTypes.node,
        contentContainerStyle: PropTypes.shape({}),
    };

    static defaultProps = {
        children: null,
        contentContainerStyle: {},
    };

    componentDidMount() {
        setTimeout(() => {
            const scrollableNode = findNodeHandle(this.snapSv);
            UIManager.dispatchViewManagerCommand(
                scrollableNode,
                UIManager.SnapScrollView.Commands.updateContentOffset,
                []
            );
        }, 1);
    }

    render() {
        const { children, contentContainerStyle, ...restProps } = this.props;

        return (
            <NativeScrollView
                ref={node => {
                    this.snapSv = node;
                }}
                {...restProps}
            >
                <View style={contentContainerStyle}>{children}</View>
            </NativeScrollView>
        );
    }
}

export default SnapScrollView;
