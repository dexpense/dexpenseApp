import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
export default function AutoHeightImage({uri, style}) {
  const [imageHeight, setImageHeight] = useState(0);
  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      setImageHeight(h * (style?.width / w));
    });
  }, []);
  return <Image source={{uri}} style={{...style, height: imageHeight}} />;
}
