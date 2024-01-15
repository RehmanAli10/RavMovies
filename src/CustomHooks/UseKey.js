import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function CallBack(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", CallBack);

      return function () {
        document.removeEventListener("keydown", CallBack);
      };
    },
    [action, key]
  );
}
