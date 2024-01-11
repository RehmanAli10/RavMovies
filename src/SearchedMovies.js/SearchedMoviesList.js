import React from "react";
import EachSearchedMovie from "./EachSearchedMovie";

function SearchedMoviesList({ movie, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movie?.map((movie) => (
        <EachSearchedMovie
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

export default SearchedMoviesList;
