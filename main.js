// 카테고리 할당
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsCategory(e))
);
// enter기능 추가
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    searchNews();
  }
});

let newsList = [];
let q = ``;
let page = `1`;
let pageSize = `20`;
let category = ``;

const getLatestNews = async () => {
  try {
    let API_KEY = `bd25ebe1582a4199b54a3b6cc16784bf`;
    let newsAPI_url = `https://newsapi.org/v2/top-headlines?country=kr&q=${q}&page=${page}&pageSize=${pageSize}&category=${category}&apiKey=`;
    let newsAPI_url_KEY = `${newsAPI_url}${API_KEY}`;
    let netlify_url = `https://noonanews.netlify.app/top-headlines?country=kr&q=${q}&page=${page}&pageSize=${pageSize}&category=${category}`;

    const url = new URL(`${netlify_url}`);
    const response = await fetch(url);
    const data = await response.json();
    if (data.totalResults == 0){
        throw new Error("No result for this search");
    }
    if (response.status == 200) {
      newsList = data.articles;
      render();
      console.log(data);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getNewsCategory = (e) => {
  q = ``;
  category = e.target.textContent.toLowerCase();
  getLatestNews();
};

const searchNews = () => {
  q = searchInput.value;
  category = ``;
  getLatestNews();
  searchInput.value = "";
};

getLatestNews();

const render = () => {
  let newsHTML = ``;
  newsHTML = newsList
    .map(
      (news) => `<div class="row news">
  <div class="col-lg-4">
  <img class="news-img" src="${
    news.urlToImage ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
  }" alt="뉴스 이미지" onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';">
  </div>
  <div class="col-lg-8">
      <h2>${news.title}</h2>
      <p>
          ${
            news.description == "" || news.description == null
              ? "내용없음"
              : news.description.length > 200
              ? news.description.substring(0, 200) + "..."
              : news.description
          }
      </p>
      <div>
          ${news.source.name || "no source"}, 
          ${moment(news.publishedAt).fromNow()}
      </div>
  </div>
</div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  inputArea.style.display === "inline"
    ? (inputArea.style.display = "none")
    : (inputArea.style.display = "inline");
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
