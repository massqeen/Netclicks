const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2',
    SERVER = 'https://api.themoviedb.org/3';

const
    leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    sorry = document.querySelector('.sorry'),
    preloader = document.querySelector('.sk-folding-cube'),
    //данные из модального окна
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    modalContent = document.querySelector('.modal__content'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

window.API_KEY = null;


const loading = document.createElement('div');
loading.className = 'loading';

//request to the database service
const DBservice = class {
    //обращение к серверу и получение данных из url
    async getData(url) {
        const response = await fetch(url); //fetch - api to get data from url

        if (response.ok) { //проверяем статус ответа о получении данных
            return response.json(); //метод json преобразует файл json в структурированные данные - объект или массив
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`); //вывод сообщения на случай ошибки получения данных с сервера
        }
    }

    /*тестируем работу класса - тестовый метод получения данных 
    из локального json файла для карточек сериалов*/
    getTestData() {
        return this.getData('test.json');
    }
    /*тестируем работу класса - тестовый метод получения данных 
        из локального json файла для модального окна*/
    getTestModalCard() {
        return this.getData('card.json');
    }

    async getAPIKey() {
        const response = await fetch('config/api.key');
        window.API_KEY = await response.text();
    }

    //запрос для поиска
    getSearchResult(query) {
        return this.getData(SERVER + '/search/tv?api_key=' + API_KEY +
            '&language=ru-RU&include_adult=true&page=1&query=' + query);
    }

    //запрос сериала по id для модального окна
    getModalTvShow(id) {
        return this.getData(SERVER + '/tv/' + id + '?api_key=' +
            API_KEY + '&language=ru-RU');
    }

    //запрос популярных для главной
    getPopular() {
        return this.getData(SERVER + '/tv/popular?api_key=' +
            API_KEY + '&language=ru-RU&page=1');
    }

    //топ-рейтинговые
    getTopRated() {
        return this.getData(SERVER + '/tv/top_rated?api_key=' +
            API_KEY + '&language=ru-RU&page=1');
    }

    //сегодня
    getToday() {
        return this.getData(SERVER + '/tv/airing_today?api_key=' +
            API_KEY + '&language=ru-RU&page=1');
    }

    //на неделю
    getWeek() {
        return this.getData(SERVER + '/tv/on_the_air?api_key=' +
            API_KEY + '&language=ru-RU&page=1');
    }

};

//пример получения данных из локального test.json
// new DBservice().getTestData().then((data) => {
//     console.log(data);
// });

//генерация карточки на основе полученных от сервера данных
const renderCard = serverData => {
    tvShowsList.innerHTML = '';
    sorry.innerHTML = '';

    if (!serverData.total_results) {
        sorry.textContent = 'Извините, по вашему запросу ничего не найдено!';
        sorry.style.cssText = 'color: red; text-decoration: none;';
    }

    serverData.results.forEach(item => {
        //деструктуризация полученных данных из item
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item;


        //тернарный оператор - до "?"" условие, а потом "то" и "иначе"
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class = "tv-card__vote">${vote}</span>` : '';


        const card = document.createElement('li');

        card.className = ('tv-shows__item');
        card.innerHTML = `
            <a href = "#" id="${id}" class = "tv-card">
                ${voteElem}
                <img
                    class = "tv-card__img"
                    src = "${posterIMG}"
                    data-backdrop = "${backdropIMG}"
                    alt = "${title}" 
                />
                <h4 class = "tv-card__head">${title}</h4> 
            </a>
        `;
        tvShowsList.append(card);
    });
    loading.remove();
};


//поиск фильмов через форму
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    let value = searchFormInput.value.trim(); //заодно убираем лишние пробелы

    //проверяем, чтобы поле поиска было не пустым, потом выполняем поиск
    if (value) {
        tvShowsHead.textContent = 'Результат поиска';
        //вставляем прелоадер в начало секции для отображения процесса загрузки карточек
        tvShows.append(loading);
        //при получении данных с сервера и создании объекта запускаем генерацию карточки
        new DBservice().getSearchResult(value).then(renderCard);
    }

    value = ''; //обнуляем значение поиска
});


//open left-menu on click by hamburger btn
hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

//close left-menu on click by any area beyond left-menu
document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');

        //close all dropdown menus on closing left-menu
        leftMenu.querySelectorAll('.dropdown.active').forEach(Element => {
            Element.classList.remove('active');
        });
    }
});

//open dropdown menu on click by any element of .dropdown. also open left-menu
leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    //отслеживаем клики по ссылкам бокового меню
    if (target.closest('#top-rated')) {
        new DBservice().getTopRated().then(renderCard);
    }
    if (target.closest('#popular')) {
        new DBservice().getPopular().then(renderCard);
    }
    if (target.closest('#week')) {
        new DBservice().getWeek().then(renderCard);
    }
    if (target.closest('#today')) {
        new DBservice().getToday().then(renderCard);
    }

});

//for mouse hover on image show background teaser, else get back to main image
const switchImage = event => {
    const target = event.target;
    const card = target.closest('.tv-shows__item');


    if (card) {
        const img = card.querySelector('.tv-card__img');
        //checking if there is a backdrop img in the card
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];

        }
    }
};
tvShowsList.addEventListener('mouseover', switchImage);
tvShowsList.addEventListener('mouseout', switchImage);


//opening modal window
tvShowsList.addEventListener('click', event => {
    event.preventDefault(); //to not refresh page on card-link click

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        preloader.style.display = 'block';
        new DBservice().getModalTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage
            }) => {

                if (posterPath) {
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                    posterWrapper.style.display = '';
                    modalContent.style.paddingLeft = '';
                } else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.paddingLeft = '25px';
                }

                modalTitle.textContent = title;

                //в комментариях альтернативный метод получения жанров функцией reduce
                //acc-аккумулирующий элемент полученных данных, item - элемент (объект данных)
                //в конце reduce стоят '' - в первой итерации передаем пустую строку в acc
                // genresList.innerHTML = response.genres.reduce((acc, item) => {
                //     return `${acc}<li>${item.name}</li>`;
                // }, '');

                genresList.textContent = ''; //очищаем все что было в жанрах

                //в комментариях альтернативный метод получения жанров через for of
                // for (const item of response.genres) {
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // }

                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                });
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            //асинхронная функция вывода модального окна только после получения response
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
                preloader.classList.remove('preloader--active');
            })
            .finally(() => {
                preloader.style.display = '';
            });

    }
});

//closing modal window on cross click or click outside modal window
modal.addEventListener('click', event => {
    const target = event.target;
    const modalOut = target.classList.contains('modal');
    const cross = target.closest('.cross');

    if (cross || modalOut) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});




startPage = () => {
    new DBservice().getPopular().then(renderCard);
};

new DBservice().getAPIKey().then(startPage);