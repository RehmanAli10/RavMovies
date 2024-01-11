import React from "react";

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠</span> {message}
    </p>
  );
}
export default ErrorMessage;
