function getMovieHtml(movie) {
    return `
        <div class="movie">
            <div class="movie-container">
                <img src="${movie.Poster}" class="movie-img"/>
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-rating">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    ${movie.imdbRating}
                </p>
                <p class="movie-length">${movie.Runtime}</p>
                <p class="movie-genre">${movie.Genre}</p>
                <a class="watchlist-link" id="${movie.imdbID}">
                    <img src="/images/plus_icon.png"/>
                    Watchlist
                </a>
                <p class="movie-description">${movie.Plot}</p>
            </div>
        </div>`;
}

/* A function that changes the elements displayed on the page. */
function toggleDisplay(state) { 
    document.querySelector(".start-exploring").style.display = "none";
    document.querySelector(".no-data").style.display = "none";
    document.querySelector(".movies-search").style.display = "none";
    if (state === "error") {
        document.querySelector(".no-data").style.display = "block";
    } else if (state === "movies") {
        document.querySelector(".movies-search").style.display = "block";
    } else if (state === "explore") {
        document.querySelector(".start-exploring").style.display = "block";
    }
}

/* A function that fetches input movie titles and gets its limited data. */
function getInputMovies() {
    let inputSearchValue = document.getElementById("input-search").value;
    localStorage.setItem("input-search", JSON.stringify(inputSearchValue));
    fetch(`https://www.omdbapi.com/?apikey=44c3ad17&s=${inputSearchValue}`)
        .then((res) => res.json())
        .then((data) => getMovieDetails(data))
        .catch(() => toggleDisplay("error"));
}

/* A function that gets more detailed movie data (through fetching unique 
movie ID rather than its title) from data previously recieved from getInputMovies().

displayMovieHtml() generates HTML and renders it to the page. */ 
function getMovieDetails(data) {
    let moviesHtml = ``;
    data.Search.forEach(function (generalMovie) {
        fetch(`https://www.omdbapi.com/?apikey=44c3ad17&i=${generalMovie.imdbID}`)
            .then((res) => res.json())
            .then(function displayMovieHtml (detailedMovie) {
                moviesHtml += getMovieHtml(detailedMovie);
                document.getElementById("movie").innerHTML = moviesHtml;
                toggleDisplay("movies");
                addToWatchlist();            
            })
            .catch(() => toggleDisplay("error"));
    });
}

/* A function that listens for click events and adds clicked movies' IDs to localStorage. */
function addToWatchlist() {
    let watchlistIDs = JSON.parse(localStorage.getItem("watchlist-movies"));
    document.querySelectorAll(".watchlist-link").forEach(function (link) {
        link.addEventListener("click", function (e) {
            let currentID = e.currentTarget.id;
            if (!watchlistIDs.includes(currentID)) {
                watchlistIDs.push(currentID);
                localStorage.setItem("watchlist-movies", JSON.stringify(watchlistIDs));
            }
        });
    });
}

toggleDisplay("explore");
document.getElementById("input-search").value = JSON.parse(localStorage.getItem("input-search"));
document.getElementById("submit-btn").addEventListener("click", getInputMovies);



