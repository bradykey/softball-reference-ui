<template>
  <v-table density="compact" fixed-header class="entry-table">
    <thead>
      <tr>
        <th class="bg-softball_red drag-col"></th>
        <th class="bg-softball_red bo-col text-center">BO</th>
        <th class="bg-softball_red player-col">Player</th>
        <th class="bg-softball_red played-col text-center">Played</th>
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

    <draggable
      v-model="lineupProxy"
      tag="tbody"
      handle=".drag-handle"
      item-key="teamLeaguePlayerId"
      ghost-class="drag-ghost"
      animation="150"
    >
      <template #item="{ element: row, index }">
        <tr>
          <td class="drag-col">
            <v-icon class="drag-handle" size="small">mdi-drag</v-icon>
          </td>
          <td class="bo-col text-center font-weight-bold">{{ index + 1 }}</td>
          <td class="player-col text-no-wrap">{{ row.name }}</td>
          <td class="played-col text-center">
            <v-checkbox-btn :model-value="true" @click="benchPlayer(row)" />
          </td>
          <td v-for="col in columns" :key="col.key" class="stat-cell">
            <v-text-field
              v-model.number="row[col.key]"
              type="number"
              min="0"
              density="compact"
              variant="plain"
              hide-details
              single-line
            />
          </td>
        </tr>
      </template>
    </draggable>

    <tbody v-if="bench.length" class="bench-tbody">
      <tr class="bench-divider-row">
        <td :colspan="columns.length + 4" class="bench-divider">
          Bench (uncheck the box to add a player to the lineup)
        </td>
      </tr>
      <tr v-for="row in bench" :key="row.teamLeaguePlayerId" class="bench-row">
        <td class="drag-col"></td>
        <td class="bo-col text-center text-medium-emphasis">—</td>
        <td class="player-col text-no-wrap">{{ row.name }}</td>
        <td class="played-col text-center">
          <v-checkbox-btn :model-value="false" @click="playPlayer(row)" />
        </td>
        <td
          v-for="col in columns"
          :key="col.key"
          class="stat-cell text-center text-medium-emphasis"
        >
          —
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { computed } from 'vue';
import draggable from 'vuedraggable';
import { statLineEntryColumns } from '@/utils/constants';

export default {
  name: 'StatLineEntryTable',
  components: { draggable },
  props: {
    lineup: { type: Array, required: true },
    bench: { type: Array, required: true }
  },
  emits: ['update:lineup', 'update:bench'],
  setup(props, { emit }) {
    const lineupProxy = computed({
      get: () => props.lineup,
      set: value => emit('update:lineup', value)
    });

    function playPlayer(row) {
      emit(
        'update:bench',
        props.bench.filter(r => r.teamLeaguePlayerId !== row.teamLeaguePlayerId)
      );
      emit('update:lineup', [...props.lineup, row]);
    }

    function benchPlayer(row) {
      emit(
        'update:lineup',
        props.lineup.filter(
          r => r.teamLeaguePlayerId !== row.teamLeaguePlayerId
        )
      );
      const nextBench = [...props.bench, row].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      emit('update:bench', nextBench);
    }

    return {
      columns: statLineEntryColumns,
      lineupProxy,
      playPlayer,
      benchPlayer
    };
  }
};
</script>

<style scoped>
.entry-table :deep(thead th.player-col),
.entry-table :deep(tbody td.player-col) {
  position: sticky;
  left: 88px;
  z-index: 1;
}
.entry-table :deep(thead th.player-col) {
  z-index: 2;
}
.entry-table :deep(tbody td.player-col) {
  background: #1e1e1e;
}
.drag-col {
  width: 40px;
}
.bo-col {
  width: 48px;
}
.played-col {
  width: 80px;
}
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.drag-ghost {
  opacity: 0.4;
  background: rgb(var(--v-theme-softball_red));
}
.entry-table :deep(.stat-cell) {
  padding: 0 4px !important;
}
.entry-table :deep(.stat-cell .v-field__input) {
  padding: 4px !important;
  min-height: 32px;
  text-align: center;
}
.bench-divider {
  padding: 12px 16px !important;
  font-size: 0.85rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.04);
}
.bench-row {
  opacity: 0.55;
}
</style>
