$(document).ready(function() {
    const $movieList = $('#movieList'); // Используем jQuery для выбора элемента
    var movieData = [];

    function loadCards() { // Получение карточек фильмов с сервера (гитхаб репозиторий)
        $.getJSON("https://raw.githubusercontent.com/golem2006/final-project/refs/heads/main/week%204%20jQuery/cards.json", function(data) {
            movieData = data.cards;
            renderCards(data.cards); // Вызов функции отрисовывания карточек

        }).fail(() => console.log("Ошибка загрузки!"));
    }

    function renderCards(cards) {
        $movieList.empty();
        cards.forEach(card => {
            $movieList.append(`
            <div class="movie-card">
                <img src="${card.src}" alt="${card.name}">
                <h3>${card.name}</h3>
                <p>Год: ${card.date}</p>
                <button data-movie-id="${card.id}">Подробнее</button>
            </div>
            `);
        });
    }

    // Обработчик событий для кнопок "Подробнее" (делегирование событий)
    $movieList.on('click', 'button', function() { // Делегирование, чтобы работало для динамически добавленных элементов
      const movieId = $(this).data('movie-id');
      openModal(movieId, movieData);
    });

    // Функция для открытия модального окна
    function openModal(movieId, movies) {
      const modal = $('#modal'); // Используем jQuery для выбора элемента
      const modalTitle = $('#modalTitle');
      const modalDescription = $('#modalDescription');
      const modalPoster = $('#modalPoster');
    
      // Находим фильм по ID
      const movie = movies.find(movie => movie.id === movieId);
    
      if (movie) {
        modalTitle.text(movie.name); // Используем .text() для установки текста
        modalDescription.text(`Год выпуска: ${movie.date}`); // Используем .text() для установки текста
        modalPoster.attr('src', movie.src); // Используем .attr() для установки атрибута src
        
        modal.show(); // Показываем модальное окно (jQuery)
      } else {
        console.log("Фильм не найден");
      }
    
      // Обработчик закрытия модального окна (кнопка)
      $('.close-button').on('click', function() {
        modal.hide(); // Скрываем модальное окно (jQuery)
      });
    
      // Закрытие по клику вне модального окна
      $(window).on('click', function(event) {
        if (event.target === modal[0]) { // modal[0] - это нативный DOM-элемент
          modal.hide();
        }
      });
    }

    loadCards();
});