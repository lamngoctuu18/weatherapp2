const getWeatherIcon = (main) => {
  switch (main) {
    case 'Clear':
      return '☀️';
    case 'Clouds':
      return '☁️';
    case 'Rain':
      return '🌧️';
    case 'Snow':
      return '❄️';
    case 'Thunderstorm':
      return '⛈️';
    case 'Drizzle':
      return '🌦️';
    default:
      return '🌈';
  }
};

export default getWeatherIcon;
