import { useEffect, useContext, useReducer, createContext } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: payload, isLoading: false };
    case "city/added":
      return { ...state, cities: [...state.cities, payload], isLoading: false };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, isLoading: false, error: payload };
    default:
      throw new Error("Not a valid action type");
  }
}

export default function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch("http://localhost:8000/cities");
        const cities = await res.json();

        dispatch({ type: "cities/loaded", payload: cities });
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    }

    fetchCities();
  }, []);

  async function fetchCity(id) {
    dispatch({ type: "loading" });

    try {
      const city = await (
        await fetch(`http://localhost:8000/cities/${id}`)
      ).json();

      dispatch({ type: "city/loaded", payload: city });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function addCity(city) {
    dispatch({ type: "loading" });

    try {
      const newCity = await (
        await fetch("http://localhost:8000/cities", {
          method: "POST",
          body: JSON.stringify(city),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      dispatch({ type: "city/added", payload: newCity });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        isLoading,
        error,
        fetchCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (!context) throw new Error("CitiesContext used outside scope.");

  return context;
}
