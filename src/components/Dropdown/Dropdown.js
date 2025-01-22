import { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { fetchDropdownData } from "utils/api";
 
function Dropdown({ type, placeholder, selectedValue, setSelectedValue }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDropdownData(type)
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);
 
  return (
    <Select
      placeholder={placeholder || "Select an option"}
      mb={4}
      focusBorderColor="gray.500"
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      {loading ? (
        <option disabled>Loading...</option>
      ) : error ? (
        <option disabled>{error.message || "Failed to load data"}</option>
      ) : (
        items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
      )}
    </Select>
  );
}
 
Dropdown.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.func.isRequired,
};
export default Dropdown;