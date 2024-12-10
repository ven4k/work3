<template>
  <div>
    <div class="tableWrapper">
      <h2>{{ tableTitle }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th v-for="(header, index) in theader" :key="index">
              {{ header }}
            </th>
            <th v-if="isPossibleDeleteItem"></th>
            <th v-if="isApplication && isPossibleDeleteItem"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tbody" :key="rowIndex">
            <td v-for="(key, cellIndex) in Object.keys(row)" :key="cellIndex">
              <span v-if="!isApplication">
                {{ row[key] ? row[key] : "-" }}
              </span>
              <span v-if="isApplication && !isPossibleDeleteItem">
                {{ row[key] ? row[key] : "-" }}
              </span>
              <span
                v-if="isApplication && isPossibleDeleteItem && key !== 'status'"
              >
                {{ row[key] ? row[key] : "-" }}
              </span>
              <select
                v-if="isApplication && isPossibleDeleteItem && key === 'status'"
                @change="handleUpdateTableData($event, row.application_id)"
              >
                <option value="">Не выбрано</option>
                <option
                  v-for="item in applicationStatusData"
                  :selected="item === row.status"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </td>
            <td
              v-if="
                isApplication &&
                row.status === 'Одобрено'
              "
              style="width: 10%"
            >
              <button
                :disabled="catalogItemCount(row.catalog_id)?.leftCount < row.catalog_item_count"
                @click="
                  handleAcceptAplication(
                    row.application_id,
                    row.material_item_count,
                    row.material_id
                  )
                "
              >
                Выполнить
              </button>
              <div v-if="catalogItemCount(row.catalog_id)?.left < row.catalog_item_count" style="color: red">Извините, на складе не хватает данного товара :(</div>
            </td>
            <td v-if="isPossibleDeleteItem" @click="$emit('deleteData', row)">
              X
            </td>
          </tr>
        </tbody>
      </table>
      <div class="emptyTable" v-if="!tbody.length">
        Здесь пока ничего нет :(
      </div>
    </div>
    <MainButton
      v-if="isPossibleAddItem"
      @click="$emit('addData')"
      class="tableAddBtn"
      >{{ addBtnText }}</MainButton
    >
  </div>
</template>

<script setup>
import { computed } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";
import { useStore } from "vuex"

const store = useStore()
const props = defineProps({
  tableTitle: { type: String, default: "" },
  theader: { type: Array, default: () => [] },
  tbody: { type: Array, default: () => [] },
  isPossibleAddItem: { type: Boolean, default: false },
  isPossibleDeleteItem: { type: Boolean, default: false },
  addBtnText: { type: String, default: "" },
  isApplication: { type: Boolean, default: false },
  applicationStatusData: { type: Array, default: () => [] },
});
const emit = defineEmits([
  "addData",
  "deleteData",
  "updateTableData",
  "acceptApplication",
]);
const catalogItemCount = (catalogId) => {
 return computed(() => store.state.catalog.find((item) => item.catalog_id === catalogId));
}
const handleUpdateTableData = (status, applicationId) => {
  emit("updateTableData", status.target.value, applicationId);
};
const handleAcceptAplication = (applicationId, itemCount, itemId) => {
  emit("acceptApplication", applicationId, itemCount, itemId);
};
</script>

<style lang="scss">
table {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 12px;
  color: #fff;
  background: #111;
  border: 1px solid #191919;
  border-radius: .4em;
  box-shadow: 0 0 8px 0px #fb0;
  overflow: hidden;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #222;
}

table th {
  background: #27292c;
  color: #ffbb00;
  font-size: 14px;
  text-transform: uppercase;
}

table tr:nth-child(even) {
  background: #1f2124;
}

table tr:hover {
  background: #27292c;
}

table td {
  font-size: 13px;
}

table td:first-child {
  font-weight: bold;
}

table td:last-child {
  text-align: right;
}

table a {
  color: #0d93ff;
  text-decoration: none;
}

table a:hover {
  text-decoration: underline;
}

table .actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

table .actions button {
  background: #fb0;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: .3em;
  box-shadow: 0 0 8px 0px #fb0;
  color: #873C00;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
}

table .actions button:hover {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -10px 10px rgba(255, 255, 255, 0.1); 
}
.emptyTable {
  text-align: center;
  width: 100%;
  padding: 10px;
}
</style>
