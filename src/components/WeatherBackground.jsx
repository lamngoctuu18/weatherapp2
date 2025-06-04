import React from 'react';
import Lottie from 'lottie-react';

// Map weather type to animation file (adjust path if needed)
const getAnimationData = (type) => {
  switch (type) {
    case 'sun':
      return require('../assets/lottie/Animation - 1749001373137.json');
    case 'sunny':
      return require('../assets/lottie/Animation - 1748926459864.json');
    case 'cloud': 
       return require('../assets/lottie/Animation - 1748927475429.json');
    case 'cloudy':
      return require('../assets/lottie/Animation - 1748927475429.json');
    case 'rain':
      return require('../assets/lottie/Animation - 1748926636352.json');
    case 'rainy':
      return require('../assets/lottie/Animation - 1748926672917.json');
    case 'storm':
      return require('../assets/lottie/Animation - 1748926736337.json');
    case 'snow':
      return require('../assets/lottie/Animation - 1749001725347.json');
    case 'fog':
      return require('../assets/lottie/Animation - 1749002093829.json');
    case 'night':
      return require('../assets/lottie/Animation - 1748926784041.json');
    // Thêm các animation mới ở đây nếu có
    // case 'windy':
    //   return require('../assets/lottie/Animation - <id>.json');
    default:
      return require('../assets/lottie/Animation - 1748927475429.json');
  }
};

const WeatherBackground = ({ weatherType }) => (
  <div
    className="weather-background"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      borderRadius: '18px', // bo tròn giống .container
      overflow: 'hidden'
    }}
  >
    <Lottie
      animationData={getAnimationData(weatherType)}
      loop
      autoplay
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        left: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}
    />
  </div>
);

export default WeatherBackground;
