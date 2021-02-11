import React, { useState, useImperativeHandle, useRef } from 'react';
import { ScrollView, Platform } from 'react-native';
import AndroidTVSnapScrollView from './index.androidtv';
import TVOSSnapScrollView from './index.tvos';

let snapPointsHolder = {};

const SV = React.forwardRef(({ children, snapPoints: propsSnapPoints, ...props }, ref) => {
    const [snapPoints, setSnapPoints] = useState([]);
    const scrollViewRef = useRef(null);

    const onLayout = (event, index) => {
        const { layout } = event.nativeEvent;

        snapPointsHolder = { ...snapPointsHolder, [index]: Math.round(layout.y) };
        setSnapPoints(Object.values(snapPointsHolder).map(point => parseInt(point, 10)));
    };

    useImperativeHandle(ref, () => ({
        onLayout: (event, index) => {
            onLayout(event, index);
        },
        scrollTo: args => {
            scrollViewRef.current.scrollTo(args);
        },
    }));

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
            <TVOSSnapScrollView
                ref={scrollViewRef}
                {...props}
                snapPoints={propsSnapPoints || snapPoints}
            >
                {content}
            </TVOSSnapScrollView>
        );
    }

    if (Platform.OS === 'android' && Platform.isTV) {
        return (
            <AndroidTVSnapScrollView
                ref={scrollViewRef}
                {...props}
                snapPoints={propsSnapPoints || snapPoints}
            >
                {content}
            </AndroidTVSnapScrollView>
        );
    }

    return (
        <ScrollView ref={scrollViewRef} {...props}>
            {children}
        </ScrollView>
    );
});

export default SV;
