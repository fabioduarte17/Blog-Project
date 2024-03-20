import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

var postTitles = [];
var postTitle = "";
var articles =[];
var article = "";
var urlList = [];
var checkDelete = false;
var urlHelper = "";


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));



app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/createpost", (req, res) => {
    res.render("postForm.ejs");
})

app.post("/createpost", (req, res) => {
    if (!postTitles.includes(req.body["post-title"])) {
        article = req.body["post-text"];
        articles.push(article);
        postTitle = req.body["post-title"];
        postTitles.push(postTitle);
        console.log(postTitles);
        console.log(req.body);
        res.render("postForm.ejs");
    } else {
        res.render("postForm.ejs", { errorMessage: "There is a post with the same title" });
    }
})
    

app.get("/posts", (req, res) => {
    res.render("posts.ejs", {postTitles : postTitles});
})

app.get(`/post/:postTitle`, (req, res) => {
    const requestedPostTitle = req.params.postTitle;
    const articleIndex = postTitles.indexOf(requestedPostTitle);
    if (articleIndex !== -1) {
        const articleContent = articles[articleIndex]; // Assuming you store articles in the same order as titles
        if (!urlList.includes(req.url)) {
            urlList.push(req.url);
            console.log(urlList);
        };
        urlHelper = req.url;
        res.render("post.ejs", { postTitle: requestedPostTitle, articleContent });
    } else {
        // Handle post not found scenario
        res.status(404).send("Post not found");
    }
});

app.post("/post", (req, res) => {
    checkDelete = true;
    var fields = urlHelper.split("/");
    var index = postTitles.indexOf(fields[2]);
    articles.splice(index, 1);
    postTitles.splice(index, 1);
    console.log(articles);
    console.log(postTitles); 
    res.render("post.ejs", { postTitle,  checkDelete });
})


app.get("/edit", (req, res) => {

    if (!postTitles.includes(req.body["post-title"])) {
        var fields = urlHelper.split("/");
        var index = postTitles.indexOf(fields[2]);
        var post = {
            postArticle : articles[index],
            postTitle : postTitles[index],
            checkEdit : true,
        }
        articles.splice(index, 1);
        postTitles.splice(index, 1);
        res.render("postForm.ejs", post);
    } else{
        res.render("postForm.ejs", { errorMessage: "There is a post with the same title" });
    }
})

app.get("/my-web-page", (req, res) => {
    res.sendFile(__dirname + "/web-page/index.html");
})

app.listen(port, () => {
    console.log(`Listen on port ${port}`);
})


