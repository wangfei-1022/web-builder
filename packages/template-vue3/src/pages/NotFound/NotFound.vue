<template>
  <AResult status="404" subtitle="您访问的页面不存在">
    <template #extra>
      <AButton type="primary" @click="$router.push('/')">返回首页</AButton>
    </template>
  </AResult>
</template>