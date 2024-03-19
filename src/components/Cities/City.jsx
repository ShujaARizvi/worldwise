import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./City.module.css";
import Spinner from "../Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const [city, setCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchCity() {
      try {
        setIsLoading(true);
        const city = await (
          await fetch(`http://localhost:8000/cities/${id}`)
        ).json();
        setCity(city);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCity();
  }, [id]);

  const { cityName, emoji, date, notes } = city;

  const componentLoaded = (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      {/* 
  <div>
    <ButtonBack />
  </div> */}
    </div>
  );

  return isLoading ? <Spinner /> : componentLoaded;
}

export default City;
