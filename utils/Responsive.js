import {Dimensions, PixelRatio} from 'react-native';

let {width, height} = Dimensions.get('window');
console.log(Dimensions.get('window'));
const widthToDp = (orignalWidth = 0) => {
  let mappedWidth =
    typeof orignalWidth === 'number' ? orignalWidth : parseFloat(orignalWidth);
  return PixelRatio.roundToNearestPixel((width * mappedWidth) / 100);
};

const heightToDp = (orignalHeight = 0) => {
  let mappedHeight =
    typeof orignalWidth === 'number'
      ? orignalHeight
      : parseFloat(orignalHeight);
  return PixelRatio.roundToNearestPixel((height * mappedHeight) / 100);
};
const fontToDp = (fontSize) => {
  const heightPercent = (fontSize * height) / height;
  return Math.round(heightPercent);
};

export {widthToDp, heightToDp, fontToDp};
