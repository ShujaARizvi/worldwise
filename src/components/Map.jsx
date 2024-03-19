import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}></div>
  );
}

export default Map;
