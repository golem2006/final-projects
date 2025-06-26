const draggable = document.querySelector('#draggable');
const dropzone = document.querySelector('#dropzone');
const result = document.querySelector('#result');
const generateButton = document.querySelector('#generate');

document.addEventListener('submit', function (e) {
    e.preventDefault(); // Остановка перезагрузки страницы при отправки формы
});

// Сохранение перетаскиваемого элемента при начале перетаскивания
document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLElement == false) { // Если элемент не HTMLElement
        e.dataTransfer.effectAllowed = 'none'; // Запрещение копирования
        return;
    }
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
});

dropzone.addEventListener('dragover', (e) => { // Перетаскивание над dropzone
    e.preventDefault(); // Разрешаем отпускание элементов на dropzone
    dropzone.classList.add('hovering'); // Визуализируем перетаскивание над dropzone
});

// Обработчик события dragleave: элемент покидает dropzone
dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('hovering'); // Убираем визуализацию перетаскивания
});

// Обработчик события drop: элемент брошен в dropzone.
dropzone.addEventListener('drop', (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение браузера
    if (e.dataTransfer.effectAllowed == 'none') { // Если drop запрещен
        return;
    }
    dropzone.classList.remove('hovering'); // Убираем визуализацию перетаскивания

    var data = e.dataTransfer.getData('text/plain'); // Получаем HTML из dataTransfer
    data = data.replace(' draggable="true"', ''); // Удаляем атрибут draggable
    console.log(data);

    dropzone.innerHTML += data; // Добавляем HTML в dropzone
});

generateButton.addEventListener('click', () => { // Кнопка Сгенерировать код
    result.textContent = formatHTML(dropzone.outerHTML); // функция из formatHTML.js
});

document.querySelector('#copy').addEventListener('click', () => { // Кнопка Копировать
    if (result.textContent == '') { // Если результат пустой, выход
        return; 
    }
    navigator.clipboard.writeText(result.textContent) // Копирование результата в буфер обмена
        .then(() => { console.log('Скопировано') })  
        .catch(error => { console.error(`Текст не скопирован ${error}`) })  
});