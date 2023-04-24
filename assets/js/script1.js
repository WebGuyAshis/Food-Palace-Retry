// const welcomePage = document.getElementById('welcome-page-container');
// const mainPage = document.getElementById('main-page-container');
const footer = document.getElementById('footer');
const aboutMe = document.getElementById('about-me');
const searchPage = document.getElementById('search-bar-page');
const searchBarContainer = document.getElementById('search-bar-container');
const foodContainer = document.getElementById('food-container');
const searchBar = document.getElementById('search-bar');
const suggestionList = document.getElementById('suggestion-list');
const navList = document.getElementById('nav-list');
const hamburgerIcon = document.getElementById('hamburger');
const favSection = document.getElementById('favourite-section');
const favIcon = document.getElementById('fav-icon');
const favList = document.getElementById('favourite-list');
const homePage = document.getElementById('home-page');
const foodPage = document.getElementById('food-page');
const mealDesc = document.getElementById('meal-desc');

// to store recieved data
let dataArr = [];
let suggestedData = [];

let isFooterOpen = false;
let isSearchPageOpen = false;


async function fetchApis(url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data;
}

// fetchApis("https://www.themealdb.com/api/json/v1/1/search.php?s=", "chicken");
let fetchedData = [];
function suggestions(url) {
    let data = fetchApis(url);
    data.then(data => {
        if (data.meals) {
            fetchedData = data.meals;

            console.log("fetchedData", fetchedData);
            suggestionList.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                let li = document.createElement('li');
                li.setAttribute('class', 'suggestion-list-item');
                li.innerHTML =
                    `
                    <div class="food-img">
                        <img src="${fetchedData[i].strMealThumb}" alt="">
                    </div>
                    <div class="food-text">
                        ${fetchedData[i].strMeal}
                    </div>
                    `;
                suggestionList.append(li);
            }
        }
        else {
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
    })
}

function openFooter() {
    footer.style.height = '40vh';
    footer.style.borderTopLeftRadius = '50%';
    footer.style.borderTopRightRadius = '50%';
    footer.style.width = '170%';
    footer.style.backgroundColor = "rgb(255, 78, 14)";
    isFooterOpen = true;
    aboutMe.style.display = 'block'
    document.getElementById('logo-first').style.color = 'green';
}

function closeFooter() {
    footer.style.height = '3vh';
    footer.style.borderRadius = '0';
    footer.style.width = '100%';
    footer.style.backgroundColor = "rgb(38, 38, 38, 0.6)"
    isFooterOpen = false;
    aboutMe.style.display = 'none'
    document.getElementById('logo-first').style.color = 'rgb(255, 78, 14)';
}

// Opening Search Page
function openSearchPage() {
    searchPage.style.height = '70vh';
    isSearchPageOpen = true;
}

function closeSearchPage() {
    searchPage.style.height = '0';
    isSearchPageOpen = false;
}

function openFavourites() {
    favSection.style.width = '350px';
}

function closeFavourites() {
    favSection.style.width = '0vw'
}

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
    // dataArr = [];
    // suggestedData = [];
    // fetchApi(url);
    suggestions(url);
    showSuggestion();
});


function showSuggestion() {
    suggestionList.style.display = 'block';
}

function removeSuggestions() {
    suggestionList.style.display = 'none';
}




function showMeals() {
    mealDesc.style.display = 'none';
    removeSuggestions();
    foodContainer.innerHTML = '';
    for (meal of fetchedData) {
        console.log(meal);
        let li = document.createElement('li');
        li.setAttribute('class', 'food-card');
        li.innerHTML = `
        <img src="${meal.strMealThumb}" alt="">
                <div class="card-details">
                    <span class="card-heading">
                        ${meal.strMeal}
                    </span>
                    <div class="card-btn">
                        <span class="recepie" data-mealId=${meal.idMeal} onclick="showMealDetail(event)">See Recepie</span>
                        <i id= ${meal.idMeal} class="bi bi-heart-fill fav-icon"></i>
                    </div>
                </div>
        `;
        foodContainer.append(li);
    }
}




const recepieDetailBtn = document.getElementsByClassName('recepie');
// const foodPage = document.getElementById('food-page');
function showMealDetail(event){
    let mealId = event.target.getAttribute("data-mealId");
    console.log("Data ID:", mealId);
    mealDesc.style.display = 'flex';
    foodPage.style.display = 'none';
    homePage.style.display = 'none';
    for(meals of fetchedData){
        if(mealId == meals.idMeal){
            mealDesc.innerHTML=
            `
            <img id="meal-desc-img" src="${meals.strMealThumb}" alt="">
            <div id="meal-img">
                <img id="meal-image" src="${meals.strMealThumb}" alt="">
            </div>
            <div id="meal-desc-details">
                <div id="meal-desc-heading">
                    ${meals.strMeal}
                </div>
                <h3>Recepie</h3>
                </br>
                <p id="meal-details">
                   ${meals.strInstructions}
                </p>
                </div>
                <div class="meal-desc-buttons">
                    <div id="watch-vid" class="meal-btn">
                        Watch Recepie
                    </div>
                    <div id="add-to-fav" class="meal-btn">
                        Add To Favourite
                    </div>
                </div>
            `;
        }
    }

}



let isListOpen = false;
let fav = [];
function handleClicks(event) {
    let target = event.target;
    let fetchId = target.id;
    let fetchClass = target.classList.value;

    console.log("Target:", target);
    console.log("Id:", fetchId);
    console.log("Fetch Class: ", fetchClass);

    if (isListOpen == true) {
        isListOpen = false;
        navList.style.left = "-200px";
    }

    if(fetchId=='home'){
        foodPage.style.display = 'none';
        mealDesc.style.display = 'none';
        homePage.style.display = 'block'
    }

    if (fetchId == 'search-icon' || fetchId == 'search-img') {
        console.log("Search Clicked");
        foodContainer.style.display = 'flex';
        setInterval(() => {
            foodPage.style.height = '100vh';
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
    else if (fetchId == 'search-meal-btn' || fetchId == 'search-btn') {
        openSearchPage();
    } else if (isSearchPageOpen && fetchId != 'search-bar-page' && fetchId != 'search-bar') {
        closeSearchPage();
    } else if (fetchId == 'hamburger' && isListOpen == false) {
        isListOpen = true;
        navList.style.left = "10px";
    } else if (fetchId == 'hamburger' && isListOpen == true) {
        isListOpen = false;
        navList.style.left = "-200px";
    } else if (fetchId == 'Favourites') {
        openFavourites();
    } else if (fetchId == 'close-fav') {
        closeFavourites();
    }

    if (fetchClass == 'bi bi-heart-fill fav-icon') {
        let item = document.getElementById(fetchId);
        console.log("Heart Clicked", fetchId);
        let index = fav.indexOf(fetchId);
        console.log("Index", index);
        if (index === -1) {
            fav.push(fetchId);
            console.log(`Added ${fetchId} to fav:`, fav);
            item.style.color = 'red';
            // addToFav(fetchId);
            renderList();
        } else {
            // Remove the id from the fav array if it is already present
            fav.splice(index, 1);
            console.log(`Removed ${fetchId} from fav:`, fav);
            item.style.color = 'white';
            // removeFav();
            renderList();
        }
        // let item = document.getElementById(fetchId);
        // for(meal of dataArr){
        //     console.log("inside loop");
        //     if(meal.idMeal == fetchId){
        //         favIcon.style.color = 'red'
        //     }
        // }
        // fav.push(fetchId);
        // console.log('fav[]:',fav);
    }
}
// Listening Clicks on the Page
document.addEventListener('click', handleClicks);

function renderList() {
    favList.innerHTML = '';
    console.log("Adding to fav");
    for (id of fav) {
        addToFav(id);
    }
}
function addToFav(id) {
    console.log("Inside Fav");
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    let data = fetchApis(url)
        data.then(dataArr => {
            console.log("Fav Arr", dataArr.meals);
            for (meal of dataArr.meals) {
                // if (meal.idMeal == id) {

                console.log("Yes");
                let li = document.createElement('li');
                li.setAttribute('class', 'favourite-list-item');
                li.innerHTML =
                    `
                <img src="${meal.strMealThumb}" alt="">
                <div class="card-details">
                    <span class="card-heading">
                        ${meal.strMeal}
                    </span>
                    <div class="card-btn">
                        <span class="recepie" data-mealId=${meal.idMeal}>See Recepie</span>
                        <i id= ${meal.idMeal} class="bi bi-heart-fill fav-icon" style="color: red;"></i>
                    </div>
                </div>
                `;
                favList.append(li);
            }
            // }
        })
}

// To handle the vh issue in mobile phones 
const setVh = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
setVh();
window.addEventListener('resize', setVh);


