import React from "react";
import EachWatchedMovie from "./EachWatchedMovie";

function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <EachWatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

export default WatchedMoviesList;
