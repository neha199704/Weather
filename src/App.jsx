import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          apiCall(position.coords.latitude, position.coords.longitude);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("error", error);
          setLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Permission denied: User denied the request for Geolocation."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError(
                "Position unavailable: Location information is unavailable."
              );
              break;
            case error.TIMEOUT:
              setError("Timeout: The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              setError("Unknown error occurred while retrieving location.");
              break;
            default:
              setError("An unexpected error occurred.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const apiCall = (lat, lon) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?APPID=29f0863b63441f9e01868300571025a3&lat=${lat}&lon=${lon}&units=metric`
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError("Failed to fetch weather data.");
      });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      <h1>Weather App</h1>
      <p>Latitude: {coordinates.latitude}</p>
      <p>Longitude: {coordinates.longitude}</p>
      <div className="weather-card">
        {loading ? (
          <div>
            <h4>
              {data.name}, {data.sys.country}
            </h4>
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
              alt="weather icon"
            />
            <p>{data.weather[0].description}</p>
            <p>Temperature: {data.main.temp}°C</p>
          </div>
        ) : (
          <p className={`loading ${error ? "error" : ""}`}>
            {error ? error : "Please wait..."}
          </p>
        )}
      </div>
    </>
  );
}

export default App;
