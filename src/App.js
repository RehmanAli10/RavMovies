import { useState } from "react";
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
import { useMovie } from "./CustomHooks/UseMovie";
import { useLocalStorage } from "./CustomHooks/UseLocalStorage";

// Api

// http://www.omdbapi.com/?apikey=[yourkey]&

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelecteId] = useState(null);
  const [notification, setNotification] = useState(false);

  // CUSTOM HOOKS
  const [watched, setWatched] = useLocalStorage("watched", []);

  const { movies, isLoading, error } = useMovie(query);

  function handleSelectedMovie(id) {
    const isMovieAlreadyExist = watched.some(
      (currMovie) => currMovie.imdbID === id
    );

    if (isMovieAlreadyExist) {
      setNotification(true);
      toast("Movie already exist!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      setSelecteId((prevId) => (prevId === id ? null : id));
    }
  }

  function handleCloseMovie() {
    setSelecteId(null);
  }

  function handleWatchedMovie(watchedMovie) {
    setWatched((prevState) => [...prevState, watchedMovie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((prevState) =>
      prevState.filter((currMovie) => currMovie.imdbID !== id)
    );
  }

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
