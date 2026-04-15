<template>
  <div>
    <AppHeader/>
    <router-view/>
  </div>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>