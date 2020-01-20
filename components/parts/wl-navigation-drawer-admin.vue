<template>
  <v-navigation-drawer
    v-model="drawer"
    :clipped="$vuetify.breakpoint.mdAndUp"
    :permanent="$vuetify.breakpoint.mdAndUp"
    app
  >
    <v-list dense>
      <template v-for="item in items">
        <v-list-group
          v-if="item.items"
          :key="item.title"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, idx) in item.items"
            :key="idx"
            nuxt
            :to="child.to"
          >
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          :key="item.title"
          nuxt
          :to="item.to"
          :exact="true"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: "wl-navigation-drawer-admin",
    data() {
      return {
        drawer: null,
        items: [
          {title: "Основное", icon: "mdi-tune", to: "/admin/"},
          {title: "Пользователи", icon: "mdi-account", to: "/admin/users"},
          {title: "Компании", icon: "mdi-domain", to: "/admin/companies"},
          {title: "Отчетность", icon: "mdi-file-chart", items: [
              {title: "Периоды", to: "/admin/periods"},
              {title: "Типы отчетов", to: "/admin/typesreports"},
              {title: "Группы параметров", to: "/admin/groupsparameters"},
              {title: "Параметры", to: "/admin/parameters"},
              {title: "Настройки отчетов", to: "/admin/settingsreports"},
            ]
          },
        ],
      }
    }
  }
</script>

<style scoped>

</style>
