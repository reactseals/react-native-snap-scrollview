package com.reactlibrary;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class SnapScrollviewModule extends SimpleViewManager<SnapScrollView> {
    
    @Override
    public String getName(){
        return "SnapScrollView";
    }

    @Override
    protected SnapScrollView createViewInstance(ThemedReactContext context){
        return new SnapScrollView(context);
    }

    @Override
    public Map<String,Integer> getCommandsMap(){
        Map<String, Integer> map = new HashMap<>();

        map.put("printData", COMMAND_PRINT);

        return map;
    }

    @ReactProp(data = "data")
    public void printData(String data){
        System.out.println(data);
    } 

    @Override
    public void receiveCommand(SnapScrollView view, int commandType, @Nullable ReadableArray args) {
        switch (commandType) {
            case COMMAND_PRINT: {
                view.printData(args.getString(0));
                return;
            }
            default:
                throw new IllegalArgumentException(String.format(
                        "Unsupported command %d received by %s.",
                        commandType,
                        getClass().getSimpleName()));
        }
    }

    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder();
    }
}
