const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

//request to the database service
const DBservice = class {
    //обращение к серверу и получение данных из url
    getData = async (url) => {
        const response = await fetch(url); //fetch - api to get data from url

        if (response.ok) { //проверяем статус ответа о получении данных
            return response.json(); //метод json преобразует файл json в структурированные данные - объект или массив
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`); //вывод сообщения на случай ошибки получения данных с сервера
        }
    }

    /*тестируем работу класса - тестовый метод получения данных 
    из локального json файла*/
    getTestData = () => {
        return this.getData('test.json');
    }

}
//пример получения данных из локального test.json
// new DBservice().getTestData().then((data) => {
//     console.log(data);
// });

//генерация карточки на основе полученных от сервера данных
const renderCard = serverData => {
    console.log(serverData);
    serverData.results.forEach(item => {
        const card = document.createElement('li');
        card.className = ('tv-shows__item');
        card.innerHTML = `
            <a href = "#" class = "tv-card">
                <span class = "tv-card__vote">6.2</span>
                <img
                    class = "tv-card__img"
                    src = "https://image.tmdb.org/t/p/w185_and_h278_bestv2/cPWxWAlsJw1QVNNuufPzZzebVtY.jpg"
                    data-backdrop = "https://image.tmdb.org/t/p/w185_and_h278_bestv2/3bBC4u27W4TfOkCVKds7nofJCfe.jpg"
                    alt = "Star Wars: Jedi Temple Challenge" 
                />
                <h4 class = "tv-card__head">Star Wars: Jedi Temple Challenge</h4> 
            </a>
        `;
        tvShowsList.prepend(card);
    });


};

//при получении данных с сервера и создании объекта запускаем генерацию карточки
new DBservice().getTestData().then(renderCard);







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
        dropdown.forEach(Element => {
            Element.classList.remove('active');
        });
    }
});

//open dropdown menu on click by any element of .dropdown. also open left-menu
leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
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
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
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