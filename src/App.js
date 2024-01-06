import { useEffect, useState } from "react";

// Api

// http://www.omdbapi.com/?apikey=[yourkey]&

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "cba947db";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [searchedMovie, setSearchedMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSearch(movie) {
    setSearchedMovie(movie);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${
              searchedMovie ? searchedMovie : Search.Title
            } `
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "FALSE") throw new Error("Movie not found");

          if (data.Search) {
            setMovies(() =>
              data.Search.Title === searchedMovie
                ? searchedMovie.split(" ")
                : data.Search
            );
          } else {
            setMovies([]);
          }
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovies();
    },
    [searchedMovie]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search onSearch={handleSearch} />
        <FoundResults movies={movies} />
      </NavBar>

      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <SearchedMoviesList movie={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          <WatchedMoviesSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>RavMovies</h1>
    </div>
  );
}

function Search({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleChange}
    />
  );
}

function FoundResults({ movies }) {
  console.log("found results", movies.length);
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </Button>
      {isOpen && children}
    </div>
  );
}

function SearchedMoviesList({ movie }) {
  return (
    <ul className="list">
      {movie?.map((movie) => (
        <EachSearchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function EachSearchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <EachWatchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function EachWatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMoviesSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {children}
    </button>
  );
}

// Loader
function Loader() {
  return <p className="loader">Loading...</p>;
}

// Error
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠</span> {message}
    </p>
  );
}
