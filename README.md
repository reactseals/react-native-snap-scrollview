# react-native-snap-scrollview

## Getting started

`$ npm install react-native-snap-scrollview --save`

### Mostly automatic installation

`$ react-native link react-native-snap-scrollview`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-snap-scrollview` and add `SnapScrollview.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libSnapScrollview.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.SnapScrollviewPackage;` to the imports at the top of the file
  - Add `new SnapScrollviewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-snap-scrollview'
  	project(':react-native-snap-scrollview').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-snap-scrollview/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-snap-scrollview')
  	```


## Usage
```javascript
import SnapScrollview from 'react-native-snap-scrollview';

// TODO: What to do with the module?
SnapScrollview;
```
