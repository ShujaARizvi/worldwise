// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";

import Button from "./Buttons/Button";
import BackButton from "./Buttons/BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";

import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();

  const { addCity, isLoading } = useCities();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryEmoji, setCountryEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [lat, lng] = useUrlPosition();
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  if (!lat || !lng) navigate("/app");

  useEffect(() => {
    async function fetchCityData() {
      try {
        setIsGeocodingLoading(true);
        const cityData = await (
          await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          )
        ).json();

        if (!cityData.countryCode)
          throw new Error("Not a valid location. Please choose a valid city");

        setCityName(cityData.city);
        setCountry(cityData.countryName);
        setCountryEmoji(convertToEmoji(cityData.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsGeocodingLoading(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !country || !date) {
      alert("Kindly fill out all the details");
      return;
    }

    const newCity = {
      cityName,
      country,
      emoji: countryEmoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    addCity(newCity).then(() => navigate("/app", { replace: true }));
  }

  if (isGeocodingLoading) return <Spinner />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{countryEmoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={setDate}
          selected={date}
          dateFormat="yyyy/MM/dd"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
