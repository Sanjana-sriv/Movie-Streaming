const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const GENRE_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const genreSelect = document.getElementById('genreSelect');

// Load genres into the dropdown
loadGenres();
function loadGenres() {
  fetch(GENRE_API)
    .then(res => res.json())
    .then(data => {
      data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.innerText = genre.name;
        genreSelect.appendChild(option);
      });
    });
}

// Get initial movies
getMovies(API_URL);

// Listen for genre change
genreSelect.addEventListener('change', () => {
  const genreId = genreSelect.value;
  if (genreId) {
    getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
  } else {
    getMovies(API_URL); // Default
  }
});

// Listen for search
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(SEARCH_API + searchTerm);
    search.value = '';
    genreSelect.value = ''; // reset genre
  } else {
    window.location.reload();
  }
});

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

function showMovies(movies) {
  main.innerHTML = '';
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;

    movieEl.addEventListener('click', () => {
      showMovieDetails(id);
    });

    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) return 'green';
  else if (vote >= 5) return 'orange';
  else return 'red';
}

async function showMovieDetails(movieId) {
  const [detailsRes, creditsRes, videosRes, externalIdsRes, providersRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`)
  ]);

  const details = await detailsRes.json();
  const credits = await creditsRes.json();
  const videos = await videosRes.json();
  const externalIds = await externalIdsRes.json();
  const providers = await providersRes.json();

  const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const trailerEmbed = trailer
    ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
    : '<p><em>No trailer available.</em></p>';

  // IMDb link and rating
  const imdbId = externalIds.imdb_id;
  const imdbUrl = imdbId ? `https://www.imdb.com/title/${imdbId}/` : null;
  // Use TMDb vote_average as IMDb proxy rating, or could show "N/A"
  const imdbRating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';

  // Rotten Tomatoes rating is not available from TMDb API directly, show N/A or leave blank
  const rtRating = 'N/A';

  // Streaming providers (for US as example)
  let streamingHTML = '<p><strong>Stream now on:</strong> ';
  const countryCode = 'US'; // you can adapt this dynamically if you want
  if (providers.results && providers.results[countryCode] && providers.results[countryCode].flatrate) {
    const providerLinks = {
  'Netflix': 'https://www.netflix.com',
  'Netflix Standard with Ads': 'https://www.netflix.com',
  'Amazon Prime Video': 'https://www.primevideo.com',
  'Disney Plus': 'https://www.disneyplus.com',
  'HBO Max': 'https://www.max.com',
  'Hulu': 'https://www.hulu.com',
  'Apple TV Plus': 'https://tv.apple.com',
  'Peacock': 'https://www.peacocktv.com',
  'Paramount Plus': 'https://www.paramountplus.com'
};

streamingHTML += providers.results[countryCode].flatrate.map(p => {
  const providerUrl = providerLinks[p.provider_name] || `https://www.themoviedb.org/provider/${p.provider_id}`;
  return `<a href="${providerUrl}" target="_blank" rel="noopener noreferrer">${p.provider_name}</a>`;
}).join(', ');
  } else {
    streamingHTML += 'Not available on streaming platforms.';
  }
  streamingHTML += '</p>';

  const modal = document.createElement('div');
  modal.classList.add('movie-modal');

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${details.title}</h2>
      <p><strong>Plot:</strong> ${details.overview}</p>
      <p><strong>Cast:</strong> ${cast}</p>
      <p><strong>Budget:</strong> $${details.budget.toLocaleString()}</p>
      <p><strong>Revenue:</strong> $${details.revenue.toLocaleString()}</p>
      ${streamingHTML}
      <p><strong>IMDb:</strong> ${imdbUrl ? `<a href="${imdbUrl}" target="_blank" rel="noopener noreferrer">${imdbRating}</a>` : imdbRating}</p>
      <p><strong>Rotten Tomatoes:</strong> ${rtRating}</p>
      ${trailerEmbed}
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
  });
}

const toggleButton = document.getElementById('themeToggle');
const darkClass = 'dark-mode';

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle(darkClass);
  localStorage.setItem('theme', document.body.classList.contains(darkClass) ? 'dark' : 'light');
});

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add(darkClass);
}

