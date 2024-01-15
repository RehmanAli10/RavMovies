import { useEffect, useState } from "react";

export function useLocalStorage(key, initialState) {
  const [value, setValue] = useState(function () {
    const storedMovies = localStorage.getItem(key);
    return JSON.parse(storedMovies) ?? initialState;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
