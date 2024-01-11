import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "./Components/Box";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";
import NavBar from "./HeaderContainer/NavBar";
import Logo from "./HeaderContainer/Logo";
import Search from "./HeaderContainer/Search";
import FoundResults from "./HeaderContainer/FoundResults";
import SearchedMoviesList from "./SearchedMovies.js/SearchedMoviesList";
import WatchedMoviesList from "./WatchedMovies.js/WatchedMovies";
import WatchedMoviesSummary from "./WatchedMovies.js/WatchedMoviesSummary";
import MovieDetails from "./MovieDetails/MovieDetails";

// Api

// http://www.omdbapi.com/?apikey=[yourkey]&

const KEY = "b59746cf";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelecteId] = useState(null);
  const [notification, setNotification] = useState(false);

  function handleSelectedMovie(id) {
    setSelecteId((prevId) => (prevId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelecteId(null);
  }

  function handleWatchedMovie(watchedMovie, userRating) {
    const isMovieAlreadyExist = watched.some(
      (currMovie) => currMovie.title === watchedMovie.title
    );

    if (isMovieAlreadyExist) {
      setNotification(true);
      toast("Movie already exist!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      setWatched((prevState) => [
        ...prevState,
        { ...watchedMovie, userRating: userRating },
      ]);
    }
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((prevState) =>
      prevState.filter((currMovie) => currMovie.imdbID !== id)
    );
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <FoundResults movies={movies} />
      </NavBar>

      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <SearchedMoviesList
              onSelectMovie={handleSelectedMovie}
              movie={movies}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              handleWatchedMovie={handleWatchedMovie}
            />
          ) : (
            <>
              <WatchedMoviesSummary watched={watched} />
              {notification && <ToastContainer />}
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
