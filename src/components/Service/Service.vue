<template>
  <TableWrapper
    tableTitle="Услуги"
    :theader="Object.values(serviceTableHeader)"
    :tbody="serviceBodyData"
    addBtnText="Добавить"
    :isPossibleAddItem="isAdmin"
    :isPossibleDeleteItem="isAdmin"
    @addData="handleTogglePopup"
    @deleteData="handleDeleteData"
  />
  <PopupWrapper :isOpenPopup="isOpenAddFormPopup" @close="handleTogglePopup" title="Услуги">
    <AddForm :data="serviceTableHeader" @addData="handleAddData"/>
  </PopupWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import serviceTableHeader from "../../mock-data/serviceTableHeader.json";
import { useNotification } from "@kyvg/vue3-notification";
import AddForm from "../AddForm/AddForm.vue";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import { useStore } from "vuex";

defineProps({
  isAdmin: { type: Boolean, default: true }
})
const store = useStore()
const { notify } = useNotification();

const serviceBodyData = ref([]);
const isOpenAddFormPopup = ref(false);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};

const handleAddData = (data) => {
  serviceBodyData.value = [...serviceBodyData.value, data]
  notify({
    duration: 3000,
    type: 'success',
    title: 'Услуга добавлена'
  })
  store.commit('updateService', serviceBodyData.value)
  sessionStorage.setItem('service', JSON.stringify(serviceBodyData.value))
};
const handleDeleteData = (data) => {
  serviceBodyData.value = serviceBodyData.value.filter(
    (el) => el.service_id !== data.service_id
  );
  store.commit('updateService', serviceBodyData.value)
  sessionStorage.setItem('service', JSON.stringify(serviceBodyData.value))
  notify({
    text: "Услуга удалена",
    type: 'warn',
    duration: 3000,
  });
};
onMounted(() => {
  serviceBodyData.value = store.state.service
})
</script>
