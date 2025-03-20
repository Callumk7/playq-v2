import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("explore", "./routes/explore/layout.tsx", [
    index("./routes/explore/index.tsx"),
  ]),
] satisfies RouteConfig;
