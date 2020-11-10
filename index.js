import React, { useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import AndroidTVSnapScrollView from './index.androidtv';
import TVOSSnapScrollView from './index.tvos';

let snapPointsHolder = {};

const SV = React.forwardRef(({ children, snapPoints: propsSnapPoints, ...props }, ref) => {
    const [snapPoints, setSnapPoints] = useState([]);

    const onLayout = (event, index) => {
        const { layout } = event.nativeEvent;

        snapPointsHolder = { ...snapPointsHolder, [index]: Math.round(layout.y) };
        setSnapPoints(Object.values(snapPointsHolder).map(point => parseInt(point, 10)));
    };

    const recursiveMap = ch =>
        React.Children.map(ch, child => {
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
                    onLayout: event => onLayout(event, child.key),
                });
            }

            return child;
        });

    const content = React.Children.map(children, child =>
        child ? React.cloneElement(recursiveMap(child)[0]) : null
    );

    if (Platform.isTVOS) {
        return (
            <TVOSSnapScrollView ref={ref} {...props} snapPoints={propsSnapPoints || snapPoints}>
                {content}
            </TVOSSnapScrollView>
        );
    }

    if (Platform.OS === 'android' && Platform.isTV) {
        return (
            <AndroidTVSnapScrollView
                ref={ref}
                {...props}
                snapPoints={propsSnapPoints || snapPoints}
            >
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
