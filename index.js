import React, { useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import AndroidTVSnapScrollView from './index.androidtv';
import TVOSSnapScrollView from './index.tvos';

let snapPointsHolder = {};

const SV = React.forwardRef(({ children, ...props }, ref) => {
    const [snapPoints, setSnapPoints] = useState([]);

    const onLayout = (event, index) => {
        const { layout } = event.nativeEvent;

        snapPointsHolder = { ...snapPointsHolder, [index]: Math.round(layout.y) };
        setSnapPoints(Object.values(snapPointsHolder).map(point => parseInt(point, 10)));
    };

    const recursiveMap = children =>
        React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
                return child;
            }

            if (child.props.children) {
                child = React.cloneElement(child, {
                    children: recursiveMap(child.props.children),
                });
            }

            if (child.props.setSnapPoint) {
                return React.cloneElement(child, {
                    ...child.props,
                    onLayout: event => onLayout(event, index),
                });
            }

            return child;
        });

    const content = React.Children.map(children, child =>
        React.cloneElement(recursiveMap(child)[0])
    );

    if (Platform.isTVOS) {
        return (
            <TVOSSnapScrollView ref={ref} {...props} snapPoints={snapPoints}>
                {content}
            </TVOSSnapScrollView>
        );
    }
    if (Platform.OS === 'android' && Platform.isTV) {
        return (
            <AndroidTVSnapScrollView ref={ref} {...props} snapPoints={snapPoints}>
                {content}
            </AndroidTVSnapScrollView>
        );
    }

    return (
        <ScrollView ref={ref} {...props}>
            {children}
        </ScrollView>
    );
});

export default SV;
