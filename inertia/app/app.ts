/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import "../css/app.css";
import { createSSRApp, h } from "vue";
import type { DefineComponent } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import "../css/app.css";
import "bulma/css/bulma.min.css";
import Layout from "~/layouts/layout.vue";

const appName = import.meta.env.VITE_APP_NAME || "Blogpoint";

createInertiaApp({
  progress: { color: "#5468FF" },

  title: (title) => {
    if (!title) return `${appName}`;
    return `${title} - ${appName}`;
  },

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>("../pages/**/*.vue"),
    );
    page.default.layout = page.default.layout || Layout;
    return page;
  },

  setup({ el, App, props, plugin }) {
    const app = createSSRApp({ render: () => h(App, props) });

    app.config.errorHandler = (err, _instance, info) => {
      console.error("Client Error:", err);
      console.error("Error Info:", info);
    };

    app.use(plugin).mount(el);
  },
});
