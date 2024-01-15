import { React, useState, useEffect, useRef } from "react";
import Loader from "../Components/Loader";
import StarRating from "../Components/StarRating";
import { useKey } from "../CustomHooks/UseKey";

const KEY = "b59746cf";

function MovieDetails({ selectedId, onCloseMovie, handleWatchedMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(null);

  const ratingCount = useRef(0);

  // CUSTOM HOOK
  useKey("Escape", onCloseMovie);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Genre: genre,
    Director: director,
  } = movie;

  function handleAddWatchedMovie() {
    const newObj = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: rating,
      userSelectedRatingCount: ratingCount.current,
    };

    handleWatchedMovie(newObj);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (rating) ratingCount.current++;
    },
    [rating]
  );

  useEffect(
    function () {
      document.title = `${title}`;

      return function () {
        document.title = "RavMovies";
      };
    },
    [title]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} onSetRating={setRating} />
            </div>

            {rating && (
              <button className="btn-add" onClick={handleAddWatchedMovie}>
                Add to list
              </button>
            )}

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetails;
