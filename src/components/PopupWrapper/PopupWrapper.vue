<template>
  <div class="popup__wrapper" v-if="isOpenPopup" @click="$emit('close')" @keydown.esc="closeByEsc" tabindex="0" ref="popupElement">
    <div class="popup__content" @click.stop>
      <h2 class="popup__title">{{ title }}</h2>
      <slot></slot>
      <div class="popup__close" @click="$emit('close')">X</div>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick, ref } from 'vue';

const props = defineProps({
  isOpenPopup: { type: Boolean, default: false },
  title: { type: String, default: "" },
});

const emit = defineEmits([
  'close'
])

const popupElement = ref();

const closeByEsc = (e) => {
  e.stopPropagation();
  popupElement.value?.focus()
  emit('close')
}

watch(() => props.isOpenPopup, (newValue) => {
  nextTick(() => {
    if (newValue) {
      popupElement.value?.focus();
    }
  });
});

</script>

<style lang="scss">
.popup__wrapper {
  color: #fb0;
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup__content {
  background-color: #2b2b2b;
  padding: 20px;
  border: 6px;
  max-width: 800px;
  max-height: 1000px;
  width: 100%;
  border-radius: 8px;
  position: relative;
}
.popup__close {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
}
.popup__title {
  font-size: 32px;
}

.input {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffcc80;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 5px rgba(255, 167, 38, 0.5);
}

.input:hover {
  border-color: #ffa726;
}
</style>
