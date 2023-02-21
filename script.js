

const APIKEY = "62d3806d72dc29172d50e470343117b7";

let movieData;

const fecthesMovie = async () =>{
    try {
       return await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}`);
    }
    catch(error){
        console.log(error);
        alert("There was an error", error);
    }
}

const fecthGenre = async () => {
    try {
        return await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US`)
    }
    catch(error){
        console.log(error);
        alert("There was an error", error);
    }
}

const genresStr = async (genresNum) => {
    const defaultGenre = await fecthGenre();
    const genres = [];
  
    for (let num of genresNum) {
      let genre = defaultGenre.data.genres.filter(g => g.id === num)[0];
      if (genre) {
        genres.push(genre.name);
      }
    }
  
    return genres.join(', ');
  }

  const fetchMovieByKeyword = async () => {
    const keyword = document.getElementById('keyword');
  
    try {
      return await axios.get(`https://api.themoviedb.org/3/search/movie?query=${keyword.value}&api_key=${APIKEY}`);
    } catch(error) {
      console.log(error);
      alert("There was an error", error);
    }
  }

  const generateUI = (movies) => {
    let movieSelection = document.getElementById("movie-selection");
    movieSelection.innerHTML = "";

    movies.forEach(async (movieObject) => {
        let genres = await genresStr(movieObject.genre_ids);
        let movieContainer = document.createElement("div");
        movieContainer.innerHTML = `
        <img src = ${movieObject.url}>
        <h2>${movieObject.title}</h2>
        <p>Release date: ${movieObject.release_date}</p>
        <p>Description: ${movieObject.overview}</p>
        <p>Genre: ${genres}</p>
        `;
        movieSelection.appendChild(movieContainer);
    });
};

async function getMoviebyKeyword() {
    const { data } = await fetchMovieByKeyword();
  
    movieData = data.results.map((movieObject) => {
      return {
        url: `https://image.tmdb.org/t/p/w500${movieObject.poster_path}`,
        title: movieObject.title,
        release_date: movieObject.release_date,
        overview: movieObject.overview,
        genre_ids: movieObject.genre_ids
      }
    });
    movieData = await Promise.all(movieData.map(async (movieObject) => {
        return {
          ...movieObject,
          genres: await genresStr(movieObject.genre_ids)
        }
      }));
    
      generateUI(movieData);
  }
  
  async function getMovie() {
    const { data } = await fecthesMovie();
  
    movieData = data.results.map((movieObject) => {
      return {
        url: `https://image.tmdb.org/t/p/w500${movieObject.poster_path}`,
        title: movieObject.title,
        release_date: movieObject.release_date,
        overview: movieObject.overview,
        genre_ids: movieObject.genre_ids
      }
    });
  
    movieData = await Promise.all(movieData.map(async (movieObject) => {
      return {
        ...movieObject,
        genres: await genresStr(movieObject.genre_ids)
      }
    }));
  
    generateUI(movieData);
}

getMovie();
