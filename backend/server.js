const express = require("express");
const app = express();
const path = require("path");

const puppeteer = require("puppeteer");

//Config dot env variables
require("dotenv").config({ path: "backend/config/.env" });

const bodyParser = require("body-parser");

//allow postman and html forms to be parsed
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/v1", (req, res) => {
  res.status(200).send("Welcome to Gogo Scraper");
});

app.get("/v1/anime/recent", async (req, res) => {
  const { page: pageNo } = req.query;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.SCRAPE_URL}?page=${pageNo || 1}`);

  const animeList = [];
  const animes = await page.$$(".last_episodes.loaddub > ul > li");
  try {
    for (const anime of animes) {
      const animeTitle = await page.evaluate(
        (el) => el.querySelector(".name").textContent,
        anime
      );
      const animeEp = await page.evaluate(
        (el) => el.querySelector(".episode").textContent,
        anime
      );
      const animeLink = await page.evaluate(
        (el) => el.querySelector(".img > a").getAttribute("href"),
        anime
      );
      const animeImg = await page.evaluate(
        (el) => el.querySelector(".img > a > img").getAttribute("src"),
        anime
      );
      animeList.push({
        title: animeTitle,
        episode: animeEp,
        image: animeImg,
        link: animeLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Recent anime fetched successfully",
      data: animeList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/anime/popular", async (req, res) => {
  const { page: pageNo } = req.query;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.SCRAPE_URL}/popular.html?page=${pageNo || 1}`);

  const animeList = [];
  const animes = await page.$$(".main_body > .last_episodes > ul > li");
  try {
    for (const anime of animes) {
      const animeTitle = await page.evaluate(
        (el) => el.querySelector(".name").textContent,
        anime
      );
      const animeRelease = await page.evaluate(
        (el) => el.querySelector(".released").textContent,
        anime
      );
      const animeLink = await page.evaluate(
        (el) => el.querySelector(".img > a").getAttribute("href"),
        anime
      );
      const animeImg = await page.evaluate(
        (el) => el.querySelector(".img > a > img").getAttribute("src"),
        anime
      );
      animeList.push({
        title: animeTitle,
        released: animeRelease,
        image: animeImg,
        link: animeLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Popular anime fetched successfully",
      data: animeList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/anime/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { page: pageNo } = req.query;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(
    `${process.env.SCRAPE_URL}/anime-movies.html?aph=${
      id === "all" ? "" : id
    }&page=${pageNo || 1}`
  );

  const animeList = [];
  const animes = await page.$$(".main_body > .last_episodes > ul > li");
  try {
    for (const anime of animes) {
      const animeTitle = await page.evaluate(
        (el) => el.querySelector(".name").textContent,
        anime
      );
      const animeRelease = await page.evaluate(
        (el) => el.querySelector(".released").textContent,
        anime
      );
      const animeLink = await page.evaluate(
        (el) => el.querySelector(".img > a").getAttribute("href"),
        anime
      );
      const animeImg = await page.evaluate(
        (el) => el.querySelector(".img > a > img").getAttribute("src"),
        anime
      );
      animeList.push({
        title: animeTitle,
        released: animeRelease,
        image: animeImg,
        link: animeLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Movie anime fetched successfully",
      data: animeList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/genre", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.SCRAPE_URL}`);

  const genreList = [];
  const genres = await page.$$(".menu_series.genre.right > ul > li");
  try {
    for (const genre of genres) {
      const genreTitle = await page.evaluate(
        (el) => el.querySelector("a").textContent,
        genre
      );
      const genreLink = await page.evaluate(
        (el) => el.querySelector("a").getAttribute("href"),
        genre
      );
      genreList.push({
        title: genreTitle,
        link: genreLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Genre fetched successfully",
      data: genreList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  const { page: pageNo } = req.query;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(
    `${process.env.SCRAPE_URL}/genre/${genre}?page=${pageNo || 1}`
  );

  const genreList = [];
  const genres = await page.$$(".main_body > .last_episodes > ul > li");
  try {
    for (const genre of genres) {
      const genreTitle = await page.evaluate(
        (el) => el.querySelector(".name").textContent,
        genre
      );
      const genreRelease = await page.evaluate(
        (el) => el.querySelector(".released").textContent,
        genre
      );
      const genreLink = await page.evaluate(
        (el) => el.querySelector(".img > a").getAttribute("href"),
        genre
      );
      const genreImg = await page.evaluate(
        (el) => el.querySelector(".img > a > img").getAttribute("src"),
        genre
      );
      genreList.push({
        title: genreTitle,
        released: genreRelease,
        image: genreImg,
        link: genreLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Anime genre fetched successfully",
      data: genreList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/anime/single/:title", async (req, res) => {
  const { title } = req.params;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.SCRAPE_URL}/category/${title}`);

  try {
    let animeInfo = await page.$$(".main_body ");
    const animeTitle = await page.evaluate(
      (el) => el.querySelector(".anime_info_body_bg > h1").textContent,
      animeInfo[0]
    );
    const animeImage = await page.evaluate(
      (el) => el.querySelector(".anime_info_body_bg > img").getAttribute("src"),
      animeInfo[0]
    );
    animeInfo = await page.$$(".main_body > .anime_video_body > ul > li");
    const end = await page.evaluate(
      (el) => el.querySelector("a").getAttribute("ep_end"),
      animeInfo[animeInfo.length - 1]
    );
    animeInfo = await page.$$(".main_body > div > .anime_info_body_bg > .type");
    const animeDescription = [];
    for (const unit of animeInfo) {
      const title = await page.evaluate(
        (el) => el.querySelector("span").innerText,
        unit
      );
      const info = await page.evaluate((el) => el.innerText, unit);
      animeDescription.push({ title, info });
    }
    res.status(200).json({
      status: "success",
      message: "Anime fetched successfully",
      data: {
        title: animeTitle,
        imgUrl: animeImage,
        startEpisode: 1,
        endEpisode: end,
        description: animeDescription,
      },
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/episode/:animeEpisode", async (req, res) => {
  const { animeEpisode } = req.params;
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  const url = `${process.env.SCRAPE_URL}${animeEpisode}`;

  console.log(url);
  console.log(page);
  // const episodeInfo = await page.$$(".main_body");
  try {
    await page.goto(url);
    // let episodeInfo = await page.$$(
    //   ".main_body > .anime_video_body > .anime_video_body_watch > .anime_video_body_watch_items"
    // );
    let episodeInfo = await page.$$(
      ".download-anime > .favorite_book > ul > .downloads > a"
    );
    console.log(episodeInfo);
    const episodeFrame = await page.evaluate(
      (el) => el.getAttribute("href"),
      episodeInfo[0]
    );

    res.status(200).json({
      status: "success",
      message: "Episode fetched successfully",
      episode: episodeFrame,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/anime/:id", async (req, res) => {
  const id = req.params.id;
  const { page: pageNo } = req.query;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(
    `${process.env.SCRAPE_URL}/anime-list${
      id !== "all" ? `-${id}` : ".html"
    }?page=${pageNo || 1}`
  );

  const animeList = [];
  const animes = await page.$$(".main_body > .anime_list_body > ul > li");
  try {
    for (const anime of animes) {
      const animeTitle = await page.evaluate(
        (el) => el.querySelector("a").textContent,
        anime
      );
      const animeLink = await page.evaluate(
        (el) => el.querySelector("a").getAttribute("href"),
        anime
      );
      animeList.push({
        title: animeTitle,
        link: animeLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Anime fetched successfully",
      data: animeList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/v1/search", async (req, res) => {
  const { genre, status, year } = req.body;
  const { page: pageNo, keyword, sort } = req.query;
  const url = `${process.env.SCRAPE_URL}/filter.html?keyword=${keyword}${
    genre ? genre.map((item) => `&genre%5B%5D=${item}`).join("") : ""
  }${year ? year.map((item) => `&year%5B%5D=${item}`).join("") : ""}${
    status ? status.map((item) => `&status%5B%5D=${item}`).join("") : ""
  }&sort=${sort}&page=${pageNo || 1}`;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto(url);
  const animeList = [];
  const animes = await page.$$(".main_body > .last_episodes > ul > li");
  try {
    for (const anime of animes) {
      const animeTitle = await page.evaluate(
        (el) => el.querySelector(".name").textContent,
        anime
      );
      const animeRelease = await page.evaluate(
        (el) => el.querySelector(".released").textContent,
        anime
      );
      const animeLink = await page.evaluate(
        (el) => el.querySelector(".img > a").getAttribute("href"),
        anime
      );
      const animeImg = await page.evaluate(
        (el) => el.querySelector(".img > a > img").getAttribute("src"),
        anime
      );
      animeList.push({
        title: animeTitle,
        released: animeRelease,
        image: animeImg,
        link: animeLink,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Search fetched successfully",
      data: animeList,
    });
    await browser.close();
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

//Routes imports
// const auth = require("./routes/auth");
// const category = require("./routes/category");
// const event = require("./routes/event");

//Routes
// app.use("/v1/auth", auth);
// app.use("/v1/category", category);
// app.use("/v1/event", event);

// app.use(express.static(path.join(__dirname, "../frontend/build/")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server started on PORT : ${process.env.PORT || 5000} in ${
      process.env.NODE_ENV
    } mode.`
  );
});
