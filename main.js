// 카테고리 할당
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => {
    // 선택된 카테고리 외 class 제거
    menus.forEach((otherMenu) => otherMenu.classList.remove("selected"));
    // 선택된 카테고리 class 할당
    e.target.classList.add("selected");
    getNewsCategory(e);
  })
);

// side-menu 카테고리 할당
const sideMenuList = document.querySelectorAll(".side-menu-list button");
sideMenuList.forEach((menu) =>
  menu.addEventListener("click", (e) => {
    sideMenuList.forEach((otherMenu) => otherMenu.classList.remove("selected"));
    e.target.classList.add("selected");
    getNewsCategory(e);
    closeNav();
  })
);

// enter기능 추가
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    searchNews();
  }
});

// 검색 후 다시 검색 위해 이전 글 삭제 기능 추가
searchInput.addEventListener("focus", () => {
  searchInput.value = "";
});

// 헤드라인 누르면 초기화(새로고침) 기능 추가
const headLine = () => {
  location.reload();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
    // 서치박스 열리면 인풋창에 커서 가도록 하는 편의 기능 추가
    searchInput.focus();
  }
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

let newsList = [];
let page = 1;
const pageSize = `10`;
let category = ``;
let totalResult = 0;
const pageGroupSize = 5;
const API_KEY = `bd25ebe1582a4199b54a3b6cc16784bf`;
const newsAPI_url = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=`;
const newsAPI_url_KEY = `${newsAPI_url}${API_KEY}`;
const netlify_url = `https://noonanews.netlify.app/top-headlines?country=kr`;
const url = new URL(`${netlify_url}`);

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    if (data.totalResults == 0) {
      // 검색 결과가 없을 경우 페이지 네이션도 안뜨도록 설정
      throw new Error("No result for this search");
    }
    if (response.status == 200) {
      newsList = data.articles;
      totalResult = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getNewsCategory = (e) => {
  category = e.target.textContent.toLowerCase();
  url.searchParams.set("category", category);
  getNews();
};

const searchNews = () => {
  let q = searchInput.value;
  url.searchParams.set("q", q);
  getNews();
};

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
  document.querySelector(".pagination").innerHTML = ``;
};

const paginationRender = () => {
  let totalPage = Math.ceil(totalResult / pageSize);
  const pageGroup = Math.ceil(page / pageGroupSize);
  const lastPage =
    pageGroup * pageGroupSize > totalPage
      ? totalPage
      : pageGroup * pageGroupSize;
  const firstPage =
    lastPage - (pageGroupSize - 1) < 1 ? 1 : lastPage - (pageGroupSize - 1);
  // 현재 페이지에서 다른페이지로 변활 될 때 변환되는 페이지의 최대 페이지가 현제 페이지보다 작은 경우 변환된 페이지의 마지막 페이지를 보여줌
  if (page > lastPage) {
    moveToPage(lastPage);
  }
  let paginationHTML = ``;
  if (page > 1) {
    paginationHTML = `
  <li class="page-item" onclick="moveToPage(${firstPage})"><a class="page-link" href="#">&lt&lt</a></li>
  <li class="page-item" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" href="#">&lt</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>
`;
  }

  if (page !== lastPage)
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link" href="#">&gt</a></li>
  <li class="page-item" onclick="moveToPage(${lastPage})"><a class="page-link" href="#">&gt&gt</a></li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getNews();
