const welcomePage = document.getElementById('welcome-page-container');
const mainPage = document.getElementById('main-page-container');
const footer = document.getElementById('footer');
const aboutMe = document.getElementById('about-me');
const searchPage = document.getElementById('search-bar-page');

let isFooterOpen = false;
let isSearchPageOpen = false;

window.onload = function () {
    setTimeout(() => {
        welcomePage.classList.add('leavePage');
        mainPage.style.display = 'block';
    }, 1100);
}

function openFooter(){
    footer.style.height = '40vh';
        footer.style.borderTopLeftRadius = '50%';
        footer.style.borderTopRightRadius = '50%';
        footer.style.width = '170%';
        footer.style.backgroundColor = "rgb(255, 78, 14)";
        isFooterOpen = true;
        aboutMe.style.display = 'block'
}

function closeFooter() {
    footer.style.height = '3vh';
    footer.style.borderRadius = '0';
    footer.style.width = '100%';
    footer.style.backgroundColor = "rgb(38, 38, 38, 0.6)"
    isFooterOpen = false;
    aboutMe.style.display = 'none'
}

// Opening Search Page
function openSearchPage(){
    searchPage.style.height = '70vh';
    searchPage.style.width= '200%';
    searchPage.style.borderBottomLeftRadius = "50%";
    searchPage.style.borderBottomRightRadius = '50%';
    isSearchPageOpen = true;
}

function closeSearchPage(){
    searchPage.style.height = '0';
    searchPage.style.width = '100vw';
    isSearchPageOpen = false;
}
// Handle Clicks
function handleClicks(event) {
    let target = event.target;
    let fetchId = target.id;

    console.log("Target:", target);
    console.log("Id:", fetchId);

    if (fetchId == 'contact-me') {
        openFooter();
    }
     else if(fetchId != 'footer' && isFooterOpen){
        console.log('inside close');
        closeFooter();
    }
    else if(fetchId == 'search-meal-btn'){
        openSearchPage();
    }else if(isSearchPageOpen && fetchId != 'search-bar-page' && fetchId != 'search-bar'){
        closeSearchPage();
    }
}

// Listening Clicks on the Page
document.addEventListener('click', handleClicks);

