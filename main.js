const API_KEY = `bd25ebe1582a4199b54a3b6cc16784bf`;
let news = [];

const getLatestNes = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
};

getLatestNes();
