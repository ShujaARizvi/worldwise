import styles from "./CountryList.module.css";

import { useCities } from "../../contexts/CitiesContext";

import Message from "../Message";
import Spinner from "../Spinner";
import CountryItem from "./CountryItem";

function calculateCountries(cities) {
  const countries = {};

  cities.forEach((city, idx) => {
    if (!countries[city.country]) {
      countries[city.country] = {
        id: idx,
        country: city.country,
        emoji: city.emoji,
      };
    }
  });

  return Object.values(countries).map((countries) => countries);
}

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = calculateCountries(cities);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
