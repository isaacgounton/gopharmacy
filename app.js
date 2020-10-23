var bodyParser    = require("body-parser"),
methodOverride    = require("method-override"),
expressSanitizer  = require("express-sanitizer"),
passport          = require("passport"),
flash             = require("connect-flash"),
User              = require("./models/user"),
Product           = require("./models/product"),
mongoose          = require("mongoose"),
express           = require("express"),
LocalStrategy     = require("passport-local"),
path              = require("path"),
app               = express();


//requiring routes
var productRoutes    = require("./routes/products"),
    indexRoutes      = require("./routes/index");

// APP CONFIG
mongoose.connect("mongodb://localhost/gopharmacy",
  { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));
app.use("/css", express.static(path.join(__dirname, "/node_modules/font-awesome/css")));
app.use("/js", express.static(path.join(__dirname, "/node_modules/jquery/dist")));
app.use("/js", express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  require("express-session")({
    secret: "Slatecube is the best",
    resave: false,
    saveUninitialized: false
  })
);

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "We are the best forever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/products", productRoutes);

var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

