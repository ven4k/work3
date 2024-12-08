<template>
  <div class="multi-select" @click.stop="$emit('closeOpenList')">
    <h3>{{ labelData }}</h3>
    <div class="select-container" @click.stop>
      <div class="selected-items" @click="$emit('openList')">
        <span v-for="(item, index) in selectedItems" :key="index" class="selected-item">
          {{ item.name }} <span v-if="labelData !== 'Услуги'">({{ item.count }})</span>
        </span>
        <span v-if="!selectedItems.length" style="user-select: none;">
          Не выбрано
        </span>
      </div>
      <div class="options" v-show="isOpenList">
        <label v-for="item in selectData" :key="item">
          <input
            type="checkbox"
            :value="item"
            :checked="isItemSelected(item.name)"
            @change="handleCheckItem(item)"
          />
          {{ item.name }}
          <input
            v-if="isItemSelected(item.name)"
            type="number"
            v-model.number="getSelectedItem(item.name).count"
            :min="1"
            @input="handleCountChange(item.name)"
          />
        </label>
      </div>
    </div>
    <div v-if="selectedItems.length">Цена: {{ selectedItemsPrice }} ₽</div>
    <div v-if="isEmptyCatalog">Извините, выбранного вами товара нет</div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  labelData: { type: String, default: "" },
  isOpenList: { type: Boolean, default: false },
  dataName: { type: String, default: ''},
});

const selectData = computed(() => props.items.map(item => {
  if(props.dataName === 'service') {
    return {
      altName: item.name,
      name: `${item.name} ${item.cost} ₽`,
      count: 1,
      id: item.service_id,
      cost: item.cost
    };
  }
  if(props.dataName === 'catalog') {
    return {
      altName: item.name,
      name: `${item.name} ${item.cost} ₽`,
      cost: item.cost,
      count: 1,
      leftCount: item.leftCount,
      id: item.catalog_id
    }
  }
}))

const emit = defineEmits(["updateFormValues", "openList", 'closeOpenList']);

const isEmptyCatalog = ref(false)
const selectedItems = ref([]);

const handleCheckItem = (item) => {
  const selectedItem = selectedItems.value.find((selected) => selected.name === item.name);
  if (selectedItem) {
    selectedItems.value = selectedItems.value.filter((selected) => selected.name !== item.name);
  } else {
    selectedItems.value.push({ name: item.name, count: 1, cost: item.cost, id: item.id, altName: item.altName  });
  }
  emit("updateFormValues", selectedItems.value);
};

const handleCountChange = (itemName) => {
  const selectedItem = getSelectedItem(itemName);
  if (!selectedItem.count || selectedItem.count < 1) {
    selectedItem.count = 1;
  }

  const item = selectData.value.find(item => item.name === itemName);
  if(item.leftCount <= 0) {
    isEmptyCatalog.value = true
  }
  if (item && selectedItem.count > item.leftCount) {
    selectedItem.count = item.leftCount;
  }

  emit("updateFormValues", selectedItems.value);
};
const isItemSelected = (item) => {
  return selectedItems.value.some((selected) => selected.name === item);
};

const getSelectedItem = (item) => {
  return selectedItems.value.find((selected) => selected.name === item);
};
const selectedItemsPrice = computed(() => selectedItems.value.reduce((acc, item) => {
  return acc += Number(item.cost) * item.count
}, 0))

</script>

<style lang="scss" scoped>
.multi-select {
  width: 100%;
  height: 100%;
  position: relative;
}

.select-container {
  position: relative;
  width: 100%;
  border: 1px solid #ccc;
  height: 100%;
  cursor: pointer;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.selected-item {
  background-color: #f0f0f0;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
}

.options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  border: 1px solid #ccc;
}

.options label {
  display: block;
  margin: 5px 0;
}
</style>
