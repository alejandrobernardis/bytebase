<template>
  <nav class="flex" aria-label="Breadcrumb">
    <div v-for="(item, index) in breadcrumbList" :key="index">
      <div class="flex items-center space-x-2">
        <router-link
          v-if="index == 0"
          to="/"
          class="text-control-light hover:text-control-light-hover"
          active-class="link"
          exact-active-class="link"
        >
          <!-- Heroicon name: solid/home -->
          <heroicons-solid:home class="flex-shrink-0 h-4 w-4" />
          <span class="sr-only">Home</span>
        </router-link>
        <heroicons-solid:chevron-right
          class="ml-2 flex-shrink-0 h-4 w-4 text-control-light"
        />
        <router-link
          v-if="item.path"
          :to="item.path"
          class="text-sm anchor-link max-w-prose truncate"
          active-class="anchor-link"
          exact-active-class="anchor-link"
          >{{ item.name }}</router-link
        >
        <div v-else class="text-sm max-w-prose truncate">
          {{ item.name }}
        </div>
        <button
          v-if="allowBookmark && index == breadcrumbList.length - 1"
          class="relative focus:outline-none"
          type="button"
          @click.prevent="toggleBookmark"
        >
          <heroicons-solid:star
            v-if="isBookmarked"
            class="h-5 w-5 text-yellow-400 hover:text-yellow-600"
          />
          <heroicons-solid:star
            v-else
            class="h-5 w-5 text-control-light hover:text-control-light-hover"
          />
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  RouterSlug,
  Bookmark,
  UNKNOWN_ID,
  Principal,
  BookmarkCreate,
} from "../types";
import { idFromSlug } from "../utils";

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export default {
  name: "Breadcrumb",
  components: {},
  setup() {
    const store = useStore();
    const currentRoute = useRouter().currentRoute;
    const { t } = useI18n();

    const currentUser: ComputedRef<Principal> = computed(() =>
      store.getters["auth/currentUser"]()
    );

    const bookmark: ComputedRef<Bookmark> = computed(() =>
      store.getters["bookmark/bookmarkByUserAndLink"](
        currentUser.value.id,
        currentRoute.value.path
      )
    );

    const isBookmarked: ComputedRef<boolean> = computed(
      () => bookmark.value.id != UNKNOWN_ID
    );

    const allowBookmark = computed(() => currentRoute.value.meta.allowBookmark);

    const breadcrumbList = computed(() => {
      const routeSlug: RouterSlug = store.getters["router/routeSlug"](
        currentRoute.value
      );
      const environmentSlug = routeSlug.environmentSlug;
      const projectSlug = routeSlug.projectSlug;
      const projectWebhookSlug = routeSlug.projectWebhookSlug;
      const instanceSlug = routeSlug.instanceSlug;
      const databaseSlug = routeSlug.databaseSlug;
      const tableName = routeSlug.tableName;
      const dataSourceSlug = routeSlug.dataSourceSlug;
      const migrationHistory = routeSlug.migrationHistorySlug;
      const versionControlSlug = routeSlug.vcsSlug;

      const list: Array<BreadcrumbItem> = [];
      if (environmentSlug) {
        list.push({
          name: t("common.environment"),
          path: "/environment",
        });
      } else if (projectSlug) {
        list.push({
          name: t("common.project"),
          path: "/project",
        });

        if (projectWebhookSlug) {
          const project = store.getters["project/projectById"](
            idFromSlug(projectSlug)
          );
          list.push({
            name: `${project.name}`,
            path: `/project/${projectSlug}`,
          });
        }
      } else if (instanceSlug) {
        list.push({
          name: t("common.instance"),
          path: "/instance",
        });
      } else if (databaseSlug) {
        list.push({
          name: t("common.database"),
          path: "/db",
        });

        if (tableName || dataSourceSlug || migrationHistory) {
          const database = store.getters["database/databaseById"](
            idFromSlug(databaseSlug)
          );
          list.push({
            name: database.name,
            path: `/db/${databaseSlug}`,
          });
          if (migrationHistory) {
            list.push({
              name: t("common.migration"),
              path: `/db/${databaseSlug}#migration-history`,
            });
          }
        }
      } else if (versionControlSlug) {
        list.push({
          name: t("common.version-control"),
          path: "/setting/version-control",
        });
      }

      if (currentRoute.value.meta.title) {
        list.push({
          name: currentRoute.value.meta.title(currentRoute.value),
          // Set empty path for the current route to make the link not clickable.
          // We do this because clicking the current route path won't trigger reload and would
          // confuse user since UI won't change while we may have cleared all query parameters.
          path: "",
        });
      }

      return list;
    });

    const toggleBookmark = () => {
      if (isBookmarked.value) {
        store.dispatch("bookmark/deleteBookmark", bookmark.value);
      } else {
        const newBookmark: BookmarkCreate = {
          name: breadcrumbList.value[breadcrumbList.value.length - 1].name,
          link: currentRoute.value.path,
        };
        store.dispatch("bookmark/createBookmark", newBookmark).then(() => {
          store.dispatch("uistate/saveIntroStateByKey", {
            key: "bookmark.create",
            newState: true,
          });
        });
      }
    };

    return {
      allowBookmark,
      bookmark,
      isBookmarked,
      breadcrumbList,
      toggleBookmark,
    };
  },
};
</script>
