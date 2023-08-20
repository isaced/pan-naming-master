import "./app.postcss";
import App from "./App.svelte";

const app = new App({
  target: (() => {
    const app = document.createElement("div");
    document.body.append(app);
    return app;
  })(),
});

export default app;
