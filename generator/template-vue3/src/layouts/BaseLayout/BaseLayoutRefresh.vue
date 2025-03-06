<template></template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 重定向路由
const redirect = route.query.redirect as string;
router.push(redirect ? decodeURIComponent(redirect) : { name: 'BaseLayoutIndex' });
</script>