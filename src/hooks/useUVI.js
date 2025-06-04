import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "90ed417a48c3627d0549d3da4910bf2d";

export default function useUVI(coord) {
  const [uvi, setUvi] = useState(null);
  useEffect(() => {
    if (!coord) return;
    let ignore = false;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`
      )
      .then((res) => {
        if (!ignore) setUvi(res.data.current.uvi);
      })
      .catch(() => {
        if (!ignore) setUvi(null);
      });
    return () => { ignore = true; };
  }, [coord]);
  return uvi;
}
