import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const RAPID_KEY = "86b65a4444mshfab650be78bfb6dp1ed15cjsnee9dee2edaab";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "Flash572",
  port: 5432,
});
db.connect();

var items;
var response;
var order = "id";
var desc = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getCurrentBooks() {
  var result;
  if (desc) {
    switch (order) {
      case "title":
        result = await db.query("SELECT * FROM mangas ORDER BY title DESC");
        break;
      case "rating":
        result = await db.query("SELECT * FROM mangas ORDER BY rating DESC");
        break;
      default:
        result = await db.query("SELECT * FROM mangas ORDER BY id DESC");
    }
  } else {
    switch (order) {
      case "title":
        result = await db.query("SELECT * FROM mangas ORDER BY title ASC");
        break;
      case "rating":
        result = await db.query("SELECT * FROM mangas ORDER BY rating ASC");
        break;
      default:
        result = await db.query("SELECT * FROM mangas ORDER BY id ASC");
    }
  }
  items = result.rows;
  return items;
}

app.get("/", async (req, res) => {
  try {
    //console.log(order);
    items = await getCurrentBooks();

    res.render("index.ejs", {
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/change-order", async (req, res) => {
  try {
    if (req.body.descend) {
      desc = true;
    } else {
      desc = false;
    }
    if (req.body.orderBy) {
      order = req.body.orderBy;
    }
    //console.log(order);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/search-manga", async (req, res) => {
  try {
    const mangaName = req.body.searchName;
    //API call
    const options = {
      method: "GET",
      url: "https://myanimelist.p.rapidapi.com/v2/manga/search",
      params: {
        q: mangaName,
        n: "50",
        score: "0",
      },
      headers: {
        "X-RapidAPI-Key": RAPID_KEY,
        "X-RapidAPI-Host": "myanimelist.p.rapidapi.com",
      },
    };
    response = await axios.request(options);
    // we will use the title and image url from result
    res.render("search-list.ejs", {
      listItems: response.data,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/write-review", async (req, res) => {
  try {
    const mangaIndex = req.body.choice;
    //console.log(typeof mangaIndex);
    if (mangaIndex === "return") {
      res.redirect("/");
    } else {
      let x = parseInt(mangaIndex);
      res.render("write-review.ejs", {
        item: response.data[x],
        index: x,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/add-manga", async (req, res) => {
  try {
    if (req.body.add === "false") {
      res.redirect("/");
    } else {
      let x = parseInt(req.body.add);
      var toAdd = response.data[x];
      //console.log(toAdd);
      //currently forces an input
      await db.query(
        "INSERT INTO mangas (title, review, rating, image) VALUES ($1, $2, $3, $4);",
        [
          toAdd.title,
          req.body.review,
          parseInt(req.body.rating),
          toAdd.picture_url,
        ]
      );
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit-rating", async (req, res) => {
  try {
    await db.query("UPDATE mangas SET rating=$1 WHERE id=$2", [
      req.body.updatedRating,
      req.body.updatedItemId,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit-review", async (req, res) => {
  try {
    await db.query("UPDATE mangas SET review=$1 WHERE id=$2", [
      req.body.updatedReview,
      req.body.updatedItemId,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  //console.log("test");
  try {
    await db.query("DELETE FROM mangas WHERE id=$1", [req.body.deleteItemId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
