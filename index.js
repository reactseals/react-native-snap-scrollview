import React from 'react';
import { ScrollView, Platform } from "react-native";
import AndroidTVSnapScrollView from './index.androidtv';
import TVOSSnapScrollView from './index.tvos';

const SV = React.forwardRef(({ children, ...props }, ref) => {
    if (Platform.isTVOS) {
        return <TVOSSnapScrollView ref={ref} {...props}>{children}</TVOSSnapScrollView>;
    }
    if (Platform.OS === 'android' && Platform.isTV) {
        return <AndroidTVSnapScrollView ref={ref} {...props}>{children}</AndroidTVSnapScrollView>;
    }

    return <ScrollView ref={ref} {...props}>{children}</ScrollView>;;
});

export default SV;