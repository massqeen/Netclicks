const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const dropdown = document.querySelectorAll('.dropdown');
const teaserImg = document.querySelectorAll('.tv-card__img');

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
            console.log(Element.className);
        })
    }
})

//open dropdown menu on click by any element of .dropdown. also open left-menu
leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
})

//for mouse hover on image show background teaser, else get back to main image
teaserImg.forEach(Element => {
    const imgUrl = Element.src;
    const backImgUrl = Element.getAttribute('data-backdrop');
    Element.addEventListener('mouseover', event => {
        Element.src = backImgUrl;
    });
    Element.addEventListener('mouseout', event => {
        Element.src = imgUrl;
    });
})