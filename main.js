const API_KEY = `bd25ebe1582a4199b54a3b6cc16784bf`;
const newsAPI_url = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=`;
const noonaAPI_url = `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`;
let news = [];

const getLatestNes = async () => {
  const url = new URL(
    `${noonaAPI_url}`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log(news);
};

getLatestNes();
