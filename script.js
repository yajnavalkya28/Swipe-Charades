document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const startBtn = document.getElementById('start-btn');
    const timeBtns = document.querySelectorAll('.time-btn');
    const stopBtn = document.getElementById('stop-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const timerDisplay = document.getElementById('timer');
    const movieTitleEl = document.getElementById('movie-title');
    const movieYearEl = document.getElementById('movie-year');
    const movieCard = document.getElementById('movie-card');
    const scoreEl = document.getElementById('score');

    let movies = [];
    let score = 0;
    let timer;
    let timeLeft;

    // Fetch and parse the CSV data
    fetch('telugu_movies.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    movies = results.data;
                }
            });
        });

    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    function startGame(duration) {
        score = 0;
        showScreen('game-screen');
        nextMovie();

        if (duration !== 'infinity') {
            timeLeft = duration;
            updateTimerDisplay();
            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        } else {
            timerDisplay.textContent = '∞';
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function nextMovie() {
        if (movies.length > 0) {
            const randomIndex = Math.floor(Math.random() * movies.length);
            const movie = movies[randomIndex];
            movieTitleEl.textContent = movie.Movie_Name;
            movieYearEl.textContent = `(${movie.Year})`;
        } else {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timer);
        scoreEl.textContent = score;
        showScreen('score-screen');
    }

    startBtn.addEventListener('click', () => showScreen('time-selection-screen'));

    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = btn.dataset.time;
            startGame(time === 'infinity' ? 'infinity' : parseInt(time));
        });
    });

    stopBtn.addEventListener('click', endGame);

    playAgainBtn.addEventListener('click', () => showScreen('time-selection-screen'));

    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    movieCard.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, false);

    movieCard.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        if (touchendX < touchstartX - swipeThreshold) { // Swipe left
            score--;
            animateSwipe('left');
        }
        if (touchendX > touchstartX + swipeThreshold) { // Swipe right
            score++;
            animateSwipe('right');
        }
    }

    function animateSwipe(direction) {
        movieCard.style.transform = `translateX(${direction === 'right' ? '100vw' : '-100vw'}) rotate(${direction === 'right' ? '30deg' : '-30deg'})`;
        setTimeout(() => {
            movieCard.style.transform = 'translateX(0) rotate(0)';
            nextMovie();
        }, 500);
    }
});
