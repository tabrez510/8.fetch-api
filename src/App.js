import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/film/");
      if (!response.ok) {
        throw new Error('Something went wrong Retrying...');
      }
      const data = await response.json();


      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          realeaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }

  let timer;
  if(error){
    clearInterval(timer);
    timer = setTimeout(() => {
      fetchMoviesHandler();
    }, 5000);
  }
  const cancelFetching = () => {
    clearInterval(timer);
    setError(null);
  }

  let content = <p>Found no movies</p>
  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  if(error) {
    content = <p>{error}</p>
  }
  if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {error && <button onClick={cancelFetching}>Cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;
