/**
 * This is an array of header objects for the shared set of base stats:
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
    value: 'pa',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'AB',
    value: 'ab',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'H',
    value: 'h',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'R',
    value: 'r',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '1B',
    value: 'b1',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '2B',
    value: 'b2',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: '3B',
    value: 'b3',
    class: 'softball_red',
    width: '65px',
    sortDescFirst: true
  },
  {
    text: 'HR',
    value: 'hr',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'RBI',
    value: 'rbi',
    class: 'softball_red',
    width: '70px',
    sortDescFirst: true
  },
  {
    text: 'BB',
    value: 'bb',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'SO',
    value: 'so',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: false
  },
  {
    text: 'SAC',
    value: 'sac',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'FoulOut',
    value: 'fo',
    class: 'softball_red',
    width: '95px',
    sortDescFirst: false
  },
  {
    text: 'HR4O',
    value: 'hr4O',
    class: 'softball_red',
    width: '85px',
    sortDescFirst: false
  },
  {
    text: 'GIDP',
    value: 'gidp',
    class: 'softball_red',
    width: '85px',
    sortDescFirst: false
  },
  {
    text: 'BA',
    value: 'avg',
    class: 'softball_red',
    width: '67px',
    sortDescFirst: true
  },
  {
    text: 'OBP',
    value: 'obp',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'SLG',
    value: 'slg',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  },
  {
    text: 'OPS',
    value: 'ops',
    class: 'softball_red',
    width: '75px',
    sortDescFirst: true
  }
];

/**
 * This is an array of header objects for the shared set of plus stats:
 * OBP+
 * SLG+
 * OPS+
 */
export const plusStatsHeaders = [
  {
    text: 'OBP+',
    value: 'obpplus',
    class: 'softball_red',
    width: '85px',
    sortDescFirst: true
  },
  {
    text: 'SLG+',
    value: 'slgplus',
    class: 'softball_red',
    width: '80px',
    sortDescFirst: true
  },
  {
    text: 'OPS+',
    value: 'opsplus',
    class: 'softball_red',
    width: '80px',
    sortDescFirst: true
  }
];
