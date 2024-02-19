let newsList = [];
let q = ``;
let page = `1`;
let pageSize = `20`;
let category = ``;

const API_KEY = `bd25ebe1582a4199b54a3b6cc16784bf`;
const newsAPI_url = `https://newsapi.org/v2/top-headlines?country=kr&q=${q}&page=${page}&pageSize=${pageSize}&category=${category}&apiKey=`;
const netlify_url = `https://noonanews.netlify.app/top-headlines?country=kr&q=${q}&page=${page}&pageSize=${pageSize}&category=${category}`;
const newsAPI_url_KEY = `${newsAPI_url}${API_KEY}`;

const getLatestNes = async () => {
  const url = new URL(`${netlify_url}`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log(newsList);
  render();
};

getLatestNes();

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
