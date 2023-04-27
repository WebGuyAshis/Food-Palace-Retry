const searchBarContainer = document.getElementById('search-bar-container');
const searchBar = document.getElementById('search-bar');
const suggestionList = document.getElementById('suggestion-list');
const foodContainer = document.getElementById('food-container');
const foodPage = document.getElementById('food-page');
const foodCard = document.getElementsByClassName('food-card');
const mealDesc = document.getElementById('meal-desc');
const homePage = document.getElementById('home-page');
const hamburgerIcon = document.getElementById('hamburger');
const navList = document.getElementById('nav-list');
const favSection = document.getElementById('favourite-section');
const favList = document.getElementById('favourite-list');
const aboutMe = document.getElementById('about-me');


let fav = [];
let isFooterOpen = false;


let isListOpen = false;
// Handling Clicks on elements
document.addEventListener('click', handleClicks);

// For Blur Background on search page
const blurContainer = document.createElement('div');
blurContainer.id = 'blur-container';


// Function to fetch API
async function fetchApi(url) {
  let response = await fetch(url);
  let data = await response.json();
  // console.log(data);
  return data;
}
// Reading inputs on Search Bar
searchBar.addEventListener('input', function (event) {
  let searchVal = event.target.value;
  // console.log("Search Word", searchVal);
  if (searchBar.value.trim() === "") {
    // console.log("Empty");
    removeSuggestions();
    return;
  }
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchVal}`;
  fetchApi(url);
  suggestions(url);
  showSuggestion();
});
let fetchedData = [];
function suggestions(url) {
  let data = fetchApi(url);
  data.then(data => {
    if (data.meals) {
      fetchedData = data.meals;
      suggestionList.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        let li = document.createElement('li');
        li.setAttribute('class', 'suggestion-list-item');
        li.setAttribute('data-mealId',fetchedData[i].idMeal)
        li.innerHTML =
          `
                  <div class="food-img" data-mealId=${fetchedData[i].idMeal}>
                      <img src="${fetchedData[i].strMealThumb}" alt="">
                  </div>
                  <div class="food-text" data-mealId=${fetchedData[i].idMeal}>
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
function showSuggestion() {
  suggestionList.style.display = 'block';
}

function removeSuggestions() {
  suggestionList.style.display = 'none';
}

// Handling Click Function
function handleClicks(event) {
  let target = event.target;
  let fetchId = target.id;
  let fetchClass = target.classList.value;

  console.log("Target:", target);
  console.log("Id:", fetchId);
  console.log("Fetch Class: ", fetchClass);

  // Opening Search Bar
  if (fetchId == 'search-meal-btn' || fetchId == 'search-btn') {
    console.log('Open Search Meal Bar');
    openSearchBar();
  }
  else if (fetchId != 'search-bar' && document.body.contains(blurContainer)) {
    console.log('Close Search Meal Bar');
    closeSearchBar();
  }

  if (fetchId == 'search-icon' || fetchId == 'search-img') {
    console.log("Search Clicked");
    foodContainer.style.display = 'flex';
    setInterval(() => {
      foodPage.style.height = '100vh';
    },);
    showMeals();
  } else if (fetchId == 'hamburger' && isListOpen == false) {
    isListOpen = true;
    navList.style.left = "10px";
  } else if (isListOpen == true) {
    isListOpen = false;
    navList.style.left = "-200px";
  }

  if (fetchId == 'Favourites') {
    console.log("Open Favourite Section");
    openFavourites();
  } else if (fetchId == 'close-fav') {
    closeFavourites();
  }

  if (fetchClass == "favourite-btn card-btn") {
    let item = document.getElementById(fetchId);
    let index = fav.indexOf(fetchId);
    if (index === -1) {
      console.log("Adding to fav");
      fav.push(fetchId);
      console.log(`Added ${fetchId} to fav:`, fav);
      item.innerText = 'Remove From Favourite';
      renderList();
    } else {
      // Remove the id from the fav array if it is already present
      fav.splice(index, 1);
      console.log(`Removed ${fetchId} from fav:`, fav);
      console.log("Removed From List");
      renderList();
      showMeals();
    }
  }
  if (fetchId == 'contact-me') {
    openFooter();
}
else if (fetchId != 'footer' && isFooterOpen) {
    console.log('inside close');
    closeFooter();
}

if(fetchId == 'home'){
  closeFavourites();
  foodPage.style.display = 'none';
  mealDesc.style.display = 'none';
  homePage.style.display = 'block';
}

if(fetchClass =='suggestion-list-item' || fetchClass == 'food-text'){
  let mealId = event.target.getAttribute("data-mealId");
  showMealDetail(mealId);
}
}

// Opening Search Bar
function openSearchBar() {
  searchBarContainer.style.display = 'block';
  document.body.appendChild(blurContainer);
  blurContainer.classList.add('blur');
}
// Closing Search Bar
function closeSearchBar() {
  searchBarContainer.style.display = 'none';
  document.body.removeChild(blurContainer);
  blurContainer.classList.remove('blur');
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

// Showing Meals
function showMeals() {
  removeSuggestions();
  foodContainer.innerHTML = '';
  for (meal of fetchedData) {
    let li = document.createElement('li');
    li.setAttribute('class', 'food-card');
    li.innerHTML = `
                <img src="${meal.strMealThumb}" alt="">
                <div class="card-details">
                    <div class="card-heading">
                    ${meal.strMeal}
                    </div>
                    <div class="card-button">
                        <div class="recepie card-btn" data-mealId=${meal.idMeal} onclick="showMealDetail(${meal.idMeal})">See Recepie</div>
                        <div class="favourite-btn card-btn" id= ${meal.idMeal}>Add to Favourite</div>
                    </div>
                </div>
      `;
    foodContainer.append(li);


    if(fav.includes(meal.idMeal)){
      console.log("it exists");
      console.log("Inside Fav:",meal.strMeal );
      let btn = document.getElementById(meal.idMeal);
      btn.innerText = 'Remove From Favourite'
    }
  }
  for (let card of foodCard) {
    const cardDetails = card.getElementsByClassName('card-details')[0];
    const cardButton = card.getElementsByClassName('card-button')[0];
    // console.log("Inside Hover Effect");
    card.addEventListener('mouseenter', () => {
      cardDetails.style.display = 'block';
      cardButton.style.display = 'block';
      setTimeout(() => {
        cardButton.style.height = '80px';
      },);
    });

    card.addEventListener('mouseleave', () => {
      cardButton.style.height = '0px';
      setTimeout(() => {
        cardButton.style.display = 'none';
      }, 300);

    });
  }
}

// Showing Meal Details/recepie
function showMealDetail(mealId) {
  console.log("Meal ID = ",mealId);
  mealDesc.style.display = 'flex';
  foodPage.style.display = 'none';
  homePage.style.display = 'none';
  console.log("Fetched Data:", fetchedData);
  for (meals of fetchedData) {
    if (mealId == meals.idMeal) {
          mealDesc.innerHTML =
          `
          <img id="meal-desc-img" src="${meals.strMealThumb}" alt="">
        <div id="left-desc">
            <div id="meal-img">
                <img src="${meals.strMealThumb}" alt="">
            </div>
            <div id="food-desc">
                <div id="type">Type:
                    <span id="meal-type">
                        ${meals.strArea}
                    </span>
                </div>

                <div id="ingredients">
                    Ingredients:
                    <span id="ingredients-type">
                        ${meals.strIngredient1},
                        ${meals.strIngredient2},
                        ${meals.strIngredient3},
                        ${meals.strIngredient4},
                        ${meals.strIngredient5},
                        ${meals.strIngredient6},
                    </span>
                </div>
            </div>
        </div>
        <div id="right-desc">
            <div id="meal-heading">
            ${meals.strMeal}
            </div>

            <div id="recepie">
            ${meals.strInstructions}
            </div>
            <div class="meal-desc-buttons">
                <div id="watch-vid" class="meal-btn">
                    <a href="${meals.strYoutube}">Watch Recepie</a>
                </div>
                <div id="add-to-fav" class="meal-btn">
                    Add To Favourite
                </div>
            </div>
        </div>
          `;
    }
  }

}

// Favourite Section
function openFavourites() {
  favSection.style.width = '350px';
}

function closeFavourites() {
  favSection.style.width = '0vw'
}

// Rendering List for Favourite
function renderList() {
  favList.innerHTML = '';
  for (id of fav) {
    addToFav(id);
  }
}

function addToFav(id) {
  let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  let data = fetchApi(url)
  data.then(dataArr => {
    console.log("Fav Arr", dataArr.meals);
    for (meal of dataArr.meals) {
      // if (meal.idMeal == id) {
      let li = document.createElement('li');
      li.setAttribute('class', 'favourite-list-item');
      li.innerHTML =
        `
                  <img src="${meal.strMealThumb}" alt="">
                  <div class="card-details">
                      <div class="card-heading">
                      ${meal.strMeal}
                      </div>
                      <div class="fav-card-button">
                          <div class="recepie card-btn" data-mealId=${meal.idMeal} onclick="showMealDetail(${meal.idMeal})">See Recepie</div>
                          <div class="favourite-btn card-btn" id= ${meal.idMeal}>Remove from Favourite</div>
                      </div>
                  </div>
              `;
      favList.append(li);
    }
    // }
  })
}
