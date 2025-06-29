$(document).ready(function() {
    const $movieList = $('#movieList'); // Используем jQuery для выбора элемента
    const $filter = $('#filter');
    var movieData = [];

    function loadCards() { // Получение карточек фильмов с сервера (гитхаб репозиторий)
        $.getJSON("https://raw.githubusercontent.com/golem2006/final-projects/refs/heads/main/week%204%20jQuery/cards.json", function(data) {
            movieData = data.cards;
            
            renderCards(data.cards); // Вызов функции отрисовывания карточек

        }).fail(() => console.log("Ошибка загрузки!"));
    }

    function renderCards(cards) {
        $movieList.empty();
        if (cards.length == 0) {
          $movieList.append(`<p class="minorAlert">Фильмы не найдены</p>`);
        }
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
      console.log(movie);
    
      if (movie) {
        modalTitle.text(movie.name); // Используем .text() для установки текста
        modalDescription.text(`Год выпуска: ${movie.date} Жанр: ${movie.genre[1]}`); // Используем .text() для установки текста
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

    // Фильтры
    // var filterMovieData = [];
    // $filter.on('change', 'input', function() { // При изменении инпута чекбоксов
    //   filterMovieData = [];
  
    //   if ($('#genreFilter input[type="checkbox"]:checked')) {
    //     $('#genreFilter input[type="checkbox"]:checked').each(function () { // Для каждого выбраного чекбокса
    //       var val = $(this).val(); // Значение чекбокса
  
    //       movieData.forEach(card => { // Поиск подходящих фильмов
    //           if (card.genre && card.genre.length > 0 && val == card.genre[0]) {
    //               filterMovieData.push(card);
    //           }
    //       });
    //     });
    //   }

    //   if ($('#yearFilter')[0].value !== '') {
    //     console.log(1);
    //     var val = $(this).val(); // Значение инпута (год)

    //     movieData.forEach(card => { // Поиск подходящих фильмов
    //       if (card.date &&  val == card.date) {
    //           filterMovieData.push(card);
    //       }
    //     });
    //   }
      
  
    //   renderCards(filterMovieData); // Рендер отфильтрованных карточек
    // });

    // Фильтры
    var filterMovieData = [];

    $filter.on('change', 'input', function() {
        filterMovieData = []; // Начинаем с чистого листа
    
        // Получаем выбранные жанры
        var selectedGenres = $('#genreFilter input[type="checkbox"]:checked').map(function() {
            return $(this).val();
        }).get();
      
        // Получаем введенный год
        var enteredYear = $('#yearFilter').val();
      
        // Фильтруем movieData
        movieData.forEach(card => {
            let includeCard = true; // Предполагаем, что фильм подходит
        
            // Фильтруем по жанрам (если выбраны)
            if (selectedGenres.length > 0) {
                if (!card.genre || card.genre.length === 0 || !selectedGenres.includes(card.genre[0])) {
                    includeCard = false; // Не подходит, если жанр не соответствует
                }
            }
          
            // Фильтруем по году (если введен)
            if (enteredYear !== '' && card.date != enteredYear) {
                includeCard = false; // Не подходит, если год не соответствует
            }
          
            // Добавляем фильм, если он прошел все фильтры
            if (includeCard) {
                filterMovieData.push(card);
            }
        });
      
        renderCards(filterMovieData); // Рендер отфильтрованных карточек
    });

    $('#resetFilters').on('click', function() {
      renderCards(movieData); // Рендер с начальными значениями
      $('#genreFilter input[type="checkbox"]').prop('checked', false); // Сброс чекбоксов
      $('#yearFilter').val(''); // Сброс инпута Год выпуска
    });

    loadCards();
    
});