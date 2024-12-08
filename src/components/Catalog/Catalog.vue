<template>
  <TableWrapper
    :theader="Object.values(catalogTableHeader)"
    :tbody="catalogBodyData"
    addBtnText="Добавить"
    tableTitle="Материалы"
    :isPossibleAddItem="isAdmin"
    :isPossibleDeleteItem="isAdmin"
    @deleteData="handleDeleteData"
    @addData="handleTogglePopup"
  />
  <PopupWrapper :isOpenPopup="isOpenAddFormPopup" @close="handleTogglePopup" title="Материалы">
    <AddForm :data="catalogTableHeader" @addData="handleAddData" />
  </PopupWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import catalogTableHeader from "../../mock-data/catalogTableHeader.json";
import { useNotification } from "@kyvg/vue3-notification";
import AddForm from "../AddForm/AddForm.vue";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import { useStore } from "vuex";

defineProps({
  isAdmin: { type: Boolean, default: true }
})
const store = useStore()
const { notify } = useNotification();

const catalogBodyData = ref([]);

const isOpenAddFormPopup = ref(false);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};
const handleAddData = (data) => {
  catalogBodyData.value = [...catalogBodyData.value, data]
  store.commit('updateCatalog', catalogBodyData.value)
  sessionStorage.setItem('catalog', JSON.stringify(catalogBodyData.value))
  notify({
    duration: 3000,
    type: 'success',
    title: 'Материалы обновлены'
  })
};
onMounted(() => {
  catalogBodyData.value = store.state.catalog
})
const handleDeleteData = (data) => {
  catalogBodyData.value = catalogBodyData.value.filter(
    (el) => el.catalog_id !== data.catalog_id
  );
  store.commit('updateCatalog', catalogBodyData.value)
  sessionStorage.setItem('catalog', JSON.stringify(catalogBodyData.value))
};
</script>

<style lang="scss" scoped>
.tarif__wrapper {
  display: flex;
}
.tarif__title {
  font-weight: 700;
}
.tarif__content {
  margin: 0 0 10px 0;
}
</style>
