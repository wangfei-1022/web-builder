<template>
  <div class="welcome">
    <div class="hello">
      <img src="@/assets/logo.svg" />
      <h2>您好，Cortex！</h2>
    </div>
  </div>
</template>

<style lang="less" scoped>
.welcome {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: var(--color-bg-1);
  overflow: auto;
}

.hello {
  margin: auto;
  text-align: center;
  padding: 24px;

  img {
    width: 200px;
    height: 200px;
  }

  h2 {
    color: #8f8f94;
    font-size: 36px;
    margin: 0;
  }
}
</style>