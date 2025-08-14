import { createInertiaApp } from "@inertiajs/vue3";
import { renderToString } from "@vue/server-renderer";
import { createSSRApp, h, type DefineComponent } from "vue";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import Layout from "../layouts/layout.vue";

const appName = import.meta.env.VITE_APP_NAME || "Blogpoint";

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    title: (title) => {
      if (!title) return `${appName}`;
      return `${title} - ${appName}`;
    },
    resolve: async (name) => {
      const resolvedPage = await resolvePageComponent(
        `../pages/${name}.vue`,
        import.meta.glob<DefineComponent>("../pages/**/*.vue"),
      );

      if (!resolvedPage || !resolvedPage.default) {
        throw new Error(`Page component "${name}" not found`);
      }

      resolvedPage.default.layout = resolvedPage.default.layout || Layout;

      return resolvedPage;
    },

    setup({ App, props, plugin }) {
      const app = createSSRApp({
        render: () => h(App, props),
        errorCaptured(err, _, info) {
          console.error("SSR Error:", err);
          console.error("Error Info:", info);
          return false; // Prevents the error from propagating further
        },
      });

      return app.use(plugin);
    },
  });
}
