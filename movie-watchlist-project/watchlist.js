/* A function that changes the display of the watchlist page. */
function toggleWatchlistDisplay(state) { // empty, watchlist
    document.querySelector(".empty-watchlist").style.display = "none";
    document.querySelector(".movies-watchlist").style.display = "none";
    if (state === "empty") {
        document.querySelector(".empty-watchlist").style.display = "block";
    } else if (state === "watchlist") {
        document.querySelector(".movies-watchlist").style.display = "block";
    }
}

function generateHtml(movie) {
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
                <a class="watchlist-link remove" id="${movie.imdbID}"><img src="/images/minus_icon.png"/>Remove</a>
                <p class="movie-description">${movie.Plot}</p>
            </div>
        </div>`;
}

/* A function that displays movies added to watchlist. */
function generateWatchlist() {
    let watchlistIDsArr = JSON.parse(localStorage.getItem("watchlist-movies"));
    let watchlistHtml = ``;
    if (watchlistIDsArr.length === 0) {
        toggleWatchlistDisplay("empty");
    } else {
        watchlistIDsArr.forEach(function (movieID) {
            fetch(`https://www.omdbapi.com/?apikey=44c3ad17&i=${movieID}`)
                .then((res) => res.json())
                .then(function (movieData) {
                    watchlistHtml += generateHtml(movieData);
                    document.getElementById("movie").innerHTML = watchlistHtml;
                    removeFromWatchlist(watchlistIDsArr);
                });
        });
        toggleWatchlistDisplay("watchlist");
    }
}

function removeFromWatchlist(watchlistIDsArr) {
    document.querySelectorAll(".remove").forEach(function (link) {
        link.addEventListener("click", function (e) {
            let currentID = e.currentTarget.id;
            if (watchlistIDsArr.includes(currentID)) {
                watchlistIDsArr.splice(watchlistIDsArr.indexOf(`${currentID}`), 1);
                localStorage.setItem("watchlist-movies", JSON.stringify(watchlistIDsArr));
                generateWatchlist();
            }
        });
    });
}

generateWatchlist();

