<template>
  <div style="width: 100%; position: relative;" @click.stop="handleCloseList">
    <div v-for="element in selectData" @click.stop>
      <MultiSelect
        v-if="element.dataName !== 'clients'"
        :items="element.data"
        :labelData="element.label"
        :dataName="element.dataName"
        @updateFormValues="handleUpdateFormValues($event, element.dataName)"
        :isOpenList="isOpenList[element.dataName]"
        @openList="handleOpenList(element.dataName)"
        @closeOpenList="handleCloseList"
      />
      <template v-else>
        <h4>{{ element.label }}</h4>
        <select class="createFormSelect" v-model="formValues[element.dataName]">
          <option class="createFormOption" value="">Не выбрано</option>
          <option
            class="createFormOption"
            v-for="item in element.data"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
      </template>
    </div>
    <hr v-if="formValues.service.length || formValues.catalog.length"/>
    <h2 v-if="formValues.service.length || formValues.catalog.length">Общая цена: {{ totalCost }} ₽</h2>
    <MainButton
      class="createBtn"
      @click="handleCreateData"
      :disabled="isDisabledBtn"
      >Создать</MainButton
    >
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";
import MultiSelect from "../MultiSelect/MultiSelect.vue";

const emit = defineEmits(["close", "addData"]);

const props = defineProps({
  catalog: { type: Array, default: () => [] },
  clients: { type: Array, default: () => [] },
  service: { type: Array, default: () => [] },
  status: { type: Array, default: () => [] },
  isAdmin: { type: Boolean, default: true },
});

const formValues = ref({
  catalog: [],
  clients: "",
  service: [],
  status: props.isAdmin ? props.status[1] : props.status[0],
});

const totalCost = computed(() => {
  const catalogCost = formValues.value.catalog.reduce((acc, item) => {
    return acc += Number(item.cost * item.count)
  }, 0)
  const serviceCost = formValues.value.service.reduce((acc, item) => {
    return acc += Number(item.cost)
  }, 0)
  return catalogCost + serviceCost
})


const isOpenList = ref([]);
const handleUpdateFormValues = (data, formValue) => {
  formValues.value[formValue] = data;
};
const clientsData = ref(
  props.clients.map((item) => {
    return `${item.lastName} ${item.firstName} ${item.patronymic} ${item.phone}`;
  })
);
const selectData = ref([
  {
    label: "Клиенты",
    dataName: "clients",
    data: clientsData.value,
  },
  {
    label: "Услуги",
    dataName: "service",
    data: props.service,
  },
  {
    label: "Материалы",
    dataName: "catalog",
    data: props.catalog,
  },
]);


const isDisabledBtn = computed(() => {
 return !formValues.value.clients.length || !(formValues.value.service.length || formValues.value.catalog.length)
});

const handleCreateData = () => {
  emit("addData", formValues.value);
  emit("close");
};
const handleOpenList = (dataName) => {
  isOpenList.value[dataName] = !isOpenList.value[dataName]
};
const handleCloseList = () => {
  Object.keys(isOpenList.value).forEach((key) => {
    isOpenList.value[key] = false;
  });
}
</script>

<style lang="scss" scoped>
.createFormSelect {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffcc80;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("../../assets/selectArrow.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  cursor: pointer;
}

.createFormSelect:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 5px rgba(255, 167, 38, 0.5);
}

.createFormSelect:hover {
  border-color: #ffa726;
}

.createFormSelect:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.createBtn {
  margin-top: 24px;
  background-color: #ffa726;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.createBtn:hover {
  background-color: #fb8c00;
}

.errorText {
  font-size: 18px;
  color: #ff5722;
}
.catalogItemCountWrapper {
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box; /* Убеждаемся, что отступы включены в общую ширину */
}
.catalogItemCount {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffcc80;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none;
}

.catalogItemCount:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 5px rgba(255, 167, 38, 0.5);
}

.catalogItemCount:hover {
  border-color: #ffa726;
}
</style>
