/**
 * This is an array of header objects for the shared set of base stats:
 *
 * PA
 * AB
 * R
 * H
 * 1B
 * 2B
 * 3B
 * HR
 * RBI
 * BB
 * SO
 * SAC
 * FoulOut
 * GIDP
 * AVG
 * OBP
 * SLG
 * OPS
 */
export const baseStatsHeaders = [
  {
    text: 'PA',
    value: 'accumulated.statLine.pa',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'AB',
    value: 'accumulated.statLine.ab',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'R',
    value: 'accumulated.statLine.r',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'H',
    value: 'accumulated.statLine.h',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '1B',
    value: 'accumulated.statLine.b1',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '2B',
    value: 'accumulated.statLine.b2',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '3B',
    value: 'accumulated.statLine.b3',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'HR',
    value: 'accumulated.statLine.hr',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'RBI',
    value: 'accumulated.statLine.rbi',
    class: 'softball_red',
    width: '70px',
    sortDescFirst: true
  },
  {
    text: 'BB',
    value: 'accumulated.statLine.bb',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'SO',
    value: 'accumulated.statLine.so',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: false
  },
  {
    text: 'SAC',
    value: 'accumulated.statLine.sac',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'FoulOut',
    value: 'accumulated.statLine.fo',
    class: 'softball_red',
    width: '95px',
    sortDescFirst: false
  },
  {
    text: 'GIDP',
    value: 'accumulated.statLine.gidp',
    class: 'softball_red',
    width: '95px',
    sortDescFirst: false
  },
  {
    text: 'BA',
    value: 'accumulated.statLine.avg',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'OBP',
    value: 'accumulated.statLine.obp',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'SLG',
    value: 'accumulated.statLine.slg',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'OPS',
    value: 'accumulated.statLine.ops',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  }
];

/**
 * This is an array of header objects for the shared set of base stats:
 * OBP+
 * SLG+
 * OPS+
 */
export const plusStatsHeaders = [
  {
    text: 'OBP+',
    value: 'accumulated.obpplus',
    class: 'softball_red',
    width: '85px',
    sortDescFirst: true
  },
  {
    text: 'SLG+',
    value: 'accumulated.slgplus',
    class: 'softball_red',
    width: '80px',
    sortDescFirst: true
  },
  {
    text: 'OPS+',
    value: 'accumulated.opsplus',
    class: 'softball_red',
    width: '80px',
    sortDescFirst: true
  }
];
