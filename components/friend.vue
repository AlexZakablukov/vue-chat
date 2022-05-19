<template>
  <div class="friend" :class="{ 'is-active': active }" @click="clickHandler">
    <div class="friend-icon" />
    <div class="friend-name">{{ friend.name }}</div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { IFriend } from '~/types/chat'

export default {
  name: 'FriendChat',
  props: {
    friend: {
      type: Object as PropType<IFriend>,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    clickHandler: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
}
</script>

<style lang="css">
.friend {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s ease-in-out;
}
.friend-icon {
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  border: 4px solid #000000;
  margin-right: 16px;
  transition: 0.2s ease-in-out;
}
/*.friend:hover {*/
/*  background-color: lightslategray;*/
/*}*/
.friend.is-active .friend-icon {
  border-color: #ffffff;
}
</style>
