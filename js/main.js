const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

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