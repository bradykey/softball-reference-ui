<template>
  <v-table density="compact" fixed-header class="entry-table">
    <thead>
      <tr>
        <th class="bg-softball_red player-col">Player</th>
        <th class="bg-softball_red">Played</th>
        <th
          v-for="col in columns"
          :key="col.key"
          class="bg-softball_red text-center"
          :style="{ width: col.width }"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.teamLeaguePlayerId"
        :class="{ 'row-skipped': !row.played }"
      >
        <td class="player-col text-no-wrap">{{ row.name }}</td>
        <td>
          <v-checkbox-btn v-model="row.played" />
        </td>
        <td
          v-for="col in columns"
          :key="col.key"
          class="stat-cell"
        >
          <v-text-field
            v-model.number="row[col.key]"
            type="number"
            min="0"
            density="compact"
            variant="plain"
            hide-details
            single-line
            :disabled="!row.played"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { statLineEntryColumns } from '@/utils/constants';

export default {
  name: 'StatLineEntryTable',
  props: {
    rows: { type: Array, required: true }
  },
  setup() {
    return { columns: statLineEntryColumns };
  }
};
</script>

<style scoped>
.entry-table :deep(thead th.player-col),
.entry-table :deep(tbody td.player-col) {
  position: sticky;
  left: 0;
  z-index: 2;
}
.entry-table :deep(tbody td.player-col) {
  background: #1e1e1e;
  z-index: 1;
}
.entry-table :deep(.stat-cell) {
  padding: 0 4px !important;
}
.entry-table :deep(.stat-cell .v-field__input) {
  padding: 4px !important;
  min-height: 32px;
  text-align: center;
}
.row-skipped {
  opacity: 0.45;
}
</style>
