const movieInput = document.getElementById('movie');
const btnSearch = document.getElementById('btnSearch');
const movieImg = document.getElementById('movieimg');
const movieName = document.getElementById('moviename');
const releaseYear = document.getElementById('releaseyear');
const movieOverview = document.getElementById('overview');
const genresName = document.getElementById('genresName');
const language = document.getElementById('lang');
const detailRow =document.getElementById('detailRow')
const movieth = document.getElementById('movieth');
const langth = document.getElementById('langth');
const Yearth = document.getElementById('Yearth');
const overviewth = document.getElementById('overviewth');
const genresth = document.getElementById('genresth');

// dropdown 
const suggestionList = document.createElement('ul');
suggestionList.classList.add('list-group', 'position-absolute', 'col-10','col-lg-4');
suggestionList.style.zIndex = '1000';
movieInput.parentElement.appendChild(suggestionList);

let selectedMovieId = null; 
let moviesData = []; 

// input
movieInput.addEventListener('input', function () {
  const movieTitle = movieInput.value.trim();

  if (movieTitle.length > 1) {
    fetchSuggestions(movieTitle);
  } else {
    suggestionList.innerHTML = '';
    selectedMovieId = null;
    moviesData = [];
  }
});

// Function to fetch movie suggestions
function fetchSuggestions(movie_name) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      try {
        const response = JSON.parse(this.responseText);
        // console.log(response);
        if (response && Array.isArray(response)) {
          // Save response in array
          moviesData = response;

          suggestionList.innerHTML = '';

          // movie suggestions dropdown list
          response
            .filter(movie => movie.title.toLowerCase().startsWith(movie_name.toLowerCase()))
            .forEach(movie => {
              const listItem = document.createElement('li');
              listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'align-items-center');
              listItem.dataset.movieId = movie.id;

              // Movie image
              const movieImage = document.createElement('img');
              movieImage.src = movie.image || 'Images/BLANK.png';
              movieImage.alt = movie.title;
              movieImage.style.width = '50px';
              movieImage.style.height = '50px';
              movieImage.classList.add('me-3', 'rounded');

              // Movie title
              const movieTitle = document.createElement('span');
              movieTitle.textContent = movie.title;

              listItem.appendChild(movieImage);
              listItem.appendChild(movieTitle);

              // select the movie from dropdown
              listItem.addEventListener('click', function () {

                movieInput.value = movie.title;
                selectedMovieId = movie.id;

                // Clear suggestions
                suggestionList.innerHTML = '';
              });

              suggestionList.appendChild(listItem);
            });
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }
  });

  xhr.open('GET', `https://tvshow.p.rapidapi.com/Movie/Search?Language=en-US&Content=${movie_name}&Adult=false&Page=1`);
  xhr.setRequestHeader('x-rapidapi-key', '0fdf97d786mshfe6215e209b9223p180cbejsn4f93c94ae981');
  xhr.setRequestHeader('x-rapidapi-host', 'tvshow.p.rapidapi.com');
  xhr.send(null);
}

// Event listener for the search button
btnSearch.addEventListener('click', function () {
  if (!selectedMovieId) {
    alert('Please select a movie from the suggestions!');
    return;
  }

  // Find the selected movie from stored data
  const selectedMovie = moviesData.find(movie => movie.id === selectedMovieId);

  if (selectedMovie) {
    displayMovieDetails(selectedMovie);
  } else {
    alert('Movie details not found. Please try again.');
  }
});

// Function to display movie details
function displayMovieDetails(movie) {
  detailRow.style.display='flex'
  movieName.textContent = movie.originalTitle || movie.title || 'N/A';
  language.textContent = movie.originalLanguage || 'N/A';
  const releaseDate = movie.releaseDate || 'N/A';
  releaseYear.textContent = releaseDate.split('-')[0] || 'N/A';
  movieOverview.textContent = movie.overview || 'N/A';
  genresName.textContent = movie.genres ? movie.genres.join(', ') : 'N/A';
  movieImg.src = movie.image || 'Images/BLANK.png';
  movieImg.alt = movie.title || 'Movie';
  movieth.textContent="Movie Name";
langth.textContent="Original Language";
Yearth.textContent="Released Year";
overviewth.textContent="Overview";
genresth.textContent="Genres";
}
