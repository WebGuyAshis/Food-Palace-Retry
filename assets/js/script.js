const welcomePage = document.getElementById('welcome-page-container');
const mainPage = document.getElementById('main-page-container');
const footer = document.getElementById('footer');
const aboutMe = document.getElementById('about-me');
const searchPage = document.getElementById('search-bar-page');
const searchBarContainer = document.getElementById('search-bar-container');
const foodContainer = document.getElementById('food-container');
const searchBar = document.getElementById('search-bar');
const suggestionList = document.getElementById('suggestion-list');

let dataArr = [];
let suggestedData = [];

let isFooterOpen = false;
let isSearchPageOpen = false;

window.onload = function () {
    setTimeout(() => {
        welcomePage.classList.add('leavePage');
        mainPage.style.display = 'block';
    }, 1100);
}

function openFooter() {
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
function openSearchPage() {
    searchPage.style.height = '70vh';
    searchPage.style.width = '200%';
    searchPage.style.borderBottomLeftRadius = "50%";
    searchPage.style.borderBottomRightRadius = '50%';
    isSearchPageOpen = true;
}

function closeSearchPage() {
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

    if (fetchId == 'search-icon' || fetchId == 'search-img') {
        console.log("Search Clicked");
        searchPage.style.height = '97vh';
        searchBarContainer.style.marginTop = '7vh';
        setInterval(() => {
            foodContainer.style.display = 'flex';
        },);
        showMeals();
    }

    if (fetchId == 'contact-me') {
        openFooter();
    }
    else if (fetchId != 'footer' && isFooterOpen) {
        console.log('inside close');
        closeFooter();
    }
    else if (fetchId == 'search-meal-btn') {
        openSearchPage();
    } else if (isSearchPageOpen && fetchId != 'search-bar-page' && fetchId != 'search-bar' && fetchId != 'search-icon' && fetchId != 'search-img') {
        closeSearchPage();
    }
}

// Fetching Api

async function fetchApi(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        console.log(data.meals[0].strMeal);
        dataArr = data.meals;
        console.log(dataArr.length);
        suggestedData = dataArr.slice(0, 5);
        console.log("Suggested Data: ", suggestedData);
        suggestionList.innerHTML = '';
        for (meal of suggestedData) {
            let mealName = meal.strMeal;
            let mealImg = meal.strMealThumb;

            let li = document.createElement('li');
            li.setAttribute('class', 'suggestion-list-item');
            li.innerHTML =
                `
            <div class="food-img">
                <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="food-text">
                ${meal.strMeal}
            </div>
            `;
            suggestionList.append(li);
        }
    }
    catch (err) {
        console.log("Error Fetching Data");
        suggestionList.innerHTML = '';
        let li = document.createElement('li');
            li.setAttribute('class', 'suggestion-list-item');
            li.innerHTML =
                `
            <div class="food-text">
                Meal Not Found... 😩
            </div>
            `;
            suggestionList.append(li);
    }
}

// Listening Clicks on the Page
document.addEventListener('click', handleClicks);


searchBar.addEventListener('input', function (event) {
    let searchVal = event.target.value;
    console.log("Search Word", searchVal);

    if (searchBar.value.trim() === "") {
        console.log("Empty");
        removeSuggestions();
        return;
    }
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchVal}`;
    console.log(url);
    dataArr = [];
    suggestedData = [];
    fetchApi(url);
    showSuggestion();
});


function showSuggestion() {
    suggestionList.style.display = 'block';
}

function removeSuggestions(){
    suggestionList.style.display = 'none';
}




// function showMeals(){
    
//     for(meal of dataArr){

//     }
// }