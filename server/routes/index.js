const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const blogRoute = require("./blogRoute");
const userRoute = require("./userRoute");
const commentRoute = require("./commentRoute");

const routes = [authRoute, userRoute, categoryRoute, blogRoute, commentRoute];

module.exports = routes;
