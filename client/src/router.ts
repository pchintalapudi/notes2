import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("./views/About.vue")
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("./views/Editor.vue")
    },
    {
      path: "/mirror",
      name: "mirror",
      component: () => import("./views/MirrorView.vue")
    }
  ]
});
// console.log(
//   paths.map(s => {
//     let name = s
//       .substring(s.lastIndexOf("/") + 1, s.lastIndexOf("."))
//       .toLowerCase();
//     return (
//       "{\
//     path: " +
//       "\"/" +
//       name +
//       "\"," +
//       name +
//       ",\
//     component: () => import(\"" +
//       s.substring(1) +
//       "\")\
//   };"
//     );
//   })
// );
