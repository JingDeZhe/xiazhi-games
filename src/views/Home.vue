<script setup></script>

<template>
  <div class="p-2">
    <n-card title="夏至，游戏篇">
      <n-p>包含以下几个游戏（或者是应用）</n-p>
      <n-collapse :default-expanded-names="['1']">
        <n-collapse-item title="寂静" name="1">
          <div>
            一个孤独的游戏，你将扮演唯一存在于世的学生，在安静的世界中，找寻其他人消失的真相，并探寻周围那些人过去所发生的事情。
            <router-link to="/silent"> 前往 </router-link>
          </div>
        </n-collapse-item>
        <n-collapse-item title="言语分裂" name="2">
          <div>
            一个自言自语的聊天工具，可以新增多个用户（全部是自己扮演）来聊天。
            <router-link to="/self-split"> 前往 </router-link>
          </div>
        </n-collapse-item>
        <n-collapse-item title="碎片拼图" name="3">
          <div>
            一个精巧的，好看的碎片拼图。
            <router-link to="/fragment-puzzle"> 前往 </router-link>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style lang="scss"></style>
