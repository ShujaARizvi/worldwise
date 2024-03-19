import styles from "./CountryList.module.css";

import Spinner from "../Spinner";
import CountryItem from "./CountryItem";
import Message from "../Message";

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

function CountryList({ cities, isLoading }) {
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
