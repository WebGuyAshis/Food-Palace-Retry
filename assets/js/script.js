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
let favListArr = [];

let fav = JSON.parse(localStorage.getItem('favListArr'));

// To make a favourites meal array if it doesn't exist in local storage
if (localStorage.getItem('favListArr') == null) {
  fav = [...favListArr];
  // Render the Lists
  renderList();
}
if(localStorage.getItem('favListArr') !== null){
  renderList();
}
console.log('Fav:',fav);

let isFooterOpen = false;
let isMealDescOpen = false;

let isListOpen = false;
// Handling Clicks on elements
document.addEventListener('click', handleClicks);

// For Blur Background on search page
const blurContainer = document.createElement('div');
blurContainer.id = 'blur-container';

// To handle the vh issue in mobile phones 
const setVh = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
setVh();
window.addEventListener('resize', setVh);

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
    mealDesc.style.display = 'none'
    foodContainer.style.display = 'flex';
    foodPage.style.display = 'block'
    homePage.style.display = 'block'
    isMealDescOpen = false;
    setInterval(() => {
      foodPage.style.height = '100vh';
    },1);
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

  if (fetchClass == "favourite-btn card-btn" || fetchClass == 'meal-btn add-to-fav') {
    let item = document.getElementById(fetchId);
    let index = fav.indexOf(fetchId);
    if (index === -1) {
      console.log("Adding to fav");
      fav.push(fetchId);
      console.log(`Added ${fetchId} to fav:`, fav);
      item.innerText = 'Remove From Favourite';
      renderList();
      if(fetchClass == 'meal-btn add-to-fav'){
        let btn = document.getElementsByClassName('add-to-fav')[0];
            console.log("btn: ", btn);
            btn.innerText = 'Remove From Favourite';
      }
    } else {
      // Remove the id from the fav array if it is already present
      fav.splice(index, 1);
      console.log(`Removed ${fetchId} from fav:`, fav);
      console.log("Removed From List");
      renderList();
      showMeals();
      if(isMealDescOpen == true){
        showMealDetail(fetchId);
      }
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
  isMealDescOpen = false;
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
    if(fav.includes(meal.idMeal)){
      // console.log("it exists");
      // console.log("Inside Fav:",meal.strMeal );
      // let btn = document.getElementById(meal.idMeal);
      // console.log("Btn Value: ", btn);
      // btn.innerText = 'Remove From Favourite'
      li.innerHTML = `
                <img src="${meal.strMealThumb}" alt="">
                <div class="card-details">
                    <div class="card-heading">
                    ${meal.strMeal}
                    </div>
                    <div class="card-button">
                        <div class="recepie card-btn" data-mealId=${meal.idMeal} onclick="showMealDetail(${meal.idMeal})">See Recepie</div>
                        <div class="favourite-btn card-btn" id= ${meal.idMeal}>Remove from Favourite</div>
                    </div>
                </div>
      `;
    }else{
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
    }
    
    foodContainer.append(li);


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
      },1);
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
  foodContainer.style.display = 'none';
  setTimeout(() => {
    mealDesc.style.height = '100vh';
  }, 1);
  isMealDescOpen = true;
  console.log("Fetched Data:", fetchedData);

  let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  let data = fetchApi(url)
  data.then(dataArr => {
  for (meals of dataArr.meals) {
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
                <div id=${meals.idMeal} class="meal-btn add-to-fav">
                    Add To Favourite
                </div>
            </div>
        </div>
          `;
          if(fav.includes(meals.idMeal)){
            console.log("Checking....");
            console.log("it exists");
            console.log("Inside Fav:",meal.strMeal );
            let btn = document.getElementsByClassName('add-to-fav')[0];
            console.log("btn: ", btn);
            btn.innerText = 'Remove From Favourite';
          }
          if(!fav.includes(meals.idMeal)){
            console.log("Checking.... NoT");
            let btn = document.getElementsByClassName('add-to-fav')[0];
            console.log("btn: ", btn);
            btn.innerText = 'Add to Favourite';
          }
  }
  })
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
  localStorage.setItem('favListArr', JSON.stringify(fav));
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

