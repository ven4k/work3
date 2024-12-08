<template>
  <TableWrapper
    tableTitle="Заявки"
    :theader="Object.values(applicationTableHeader)"
    :tbody="applicationsBodyDataManager"
    isApplication
    :applicationStatusData="statuses"
    addBtnText="Создать заявку"
    isPossibleAddItem
    :isPossibleDeleteItem="isAdmin"
    @addData="handleTogglePopup"
    @deleteData="handleDeleteData"
    @updateTableData="handleUpdateTableData"
    @acceptApplication="handleAcceptAplication"
  />
  <PopupWrapper
    :isOpenPopup="isOpenAddFormPopup"
    @close="handleTogglePopup"
    title="Заявки"
  >
    <CreateApplication
      @close="handleTogglePopup"
      @addData="handleAddData"
      :clients="clientsJSON"
      :service="serviceJSON"
      :catalog="catalogJSON"
      :status="statuses"
      :isAdmin="isAdmin"
    />
  </PopupWrapper>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import applicationTableHeader from "../../mock-data/applicationsTableHeader.json";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import CreateApplication from "../CreateApplication/CreateApplication.vue";

import { useStore } from "vuex";

const store = useStore();

const clientsJSON = computed(() => store.state.clients);
const serviceJSON = computed(() => store.state.service);
const catalogJSON = computed(() => store.state.catalog);

const props = defineProps({
  isAdmin: { type: Boolean, default: true },
});

const { notify } = useNotification();
const isOpenAddFormPopup = ref(false);
const applicationsBodyDataManager = ref([]);

const statuses = ref(["В процессе согласования", "Одобрено", "Отклонено"]);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};

const getCurrentDate = computed(() => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
});

const handleAddData = (data) => {
  const { clients, catalog, status, service } = data;

  const addClientFullName = clients?.split(" ").slice(0, 3).join(" ");

  const addData = {
    application_id: Date.now().toString().slice(-6),
    catalog_id: catalog.map((el) => el.id).join(","),
    catalog_item_name: catalog.map((el) => el.name).join(","),
    catalog_item_count: catalog.map((el) => el.count).join(","),
    fullname_client: addClientFullName,
    date_create: getCurrentDate.value,
    operation_type: service
      .map((el) => el.name.split(" ").slice(0, 1))
      .join(","),
    status: status,
  };
  applicationsBodyDataManager.value = [
    ...applicationsBodyDataManager.value,
    addData,
  ];

  updateAplicationData();
  notify({
    duration: 3000,
    type: "success",
    title: "Заявка создана",
  });
};
const handleDeleteData = (data) => {
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
    (el) => el.applicationId !== data.applicationId
  );
  updateAplicationData();
  notify({
    text: "Заявка удалена",
    type: "warn",
    duration: 3000,
  });
};

const handleUpdateTableData = (status, applicationId) => {
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.map(
    (el) => {
      if (el.application_id === applicationId) {
        let updatedData;
        if (status === "Одобрено") {
          updatedData = { ...el, status };
          applicationsBodyDataManager.value = [
            ...applicationsBodyDataManager.value,
            updatedData,
          ];
        }
        return { ...el, status };
      }
      return el;
    }
  );
  updateAplicationData();
  notify({
    text: "Статус обновлён!",
    type: "success",
    duration: 3000,
  });
};

const handleAcceptAplication = (applicationId, itemCount, itemId) => {
  const itemCountArr = itemCount.split(',')
  const newCatalog = catalogJSON.value.map((el, index) => {
    const itemIds = itemId.split(",");
    if (itemIds.includes(el.catalog_id)) {
      return {
        ...el,
        leftCount: el.leftCount - itemCountArr[index],
      };
    }
    return el;
  });
  
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
    (el) => el.application_id !== applicationId
  );
  store.commit("updateCatalog", newCatalog);
  updateAplicationData();
};

const updateAplicationData = () => {
  store.commit(
    "updateManagerApplicationData",
    applicationsBodyDataManager.value
  );
  sessionStorage.setItem(
    "managerApplications",
    JSON.stringify(applicationsBodyDataManager.value)
  );
};

onMounted(() => {
  applicationsBodyDataManager.value = store.state.managerApplicationData;
});
</script>

<style lang="scss"></style>
