/* ---------- static data: animals, areas, objects ---------- */
// patch / part: [focusX, focusY, zoom] inside the animal picture (for the clue cards)
const ANIMALS = {
  tiger:    {img: 'tiger',    w: 134, h: 141, patch: [.50, .62, 3.2], part: [.13, .40, 2.1], pitch: .85},
  monkey:   {img: 'monkey',   w: 152, h: 161, patch: [.44, .40, 3.2], part: [.14, .78, 2.2], pitch: 1.45},
  elephant: {img: 'elephant', w: 155, h: 152, patch: [.30, .60, 3.2], part: [.64, .64, 2.0], pitch: .75},
  zebra:    {img: 'zebra',    w: 146, h: 159, patch: [.42, .58, 3.2], part: [.72, .28, 1.9], pitch: 1.1},
  parrot:   {img: 'parrot',   w: 139, h: 137, patch: [.40, .45, 3.0], part: [.86, .30, 2.4], pitch: 1.6},
  giraffe:  {img: 'giraffe',  w: 120, h: 189, patch: [.42, .62, 3.2], part: [.66, .22, 1.7], pitch: 1.0},
  deer:     {img: 'deer',     w: 109, h: 172, pitch: 1.3},
};
const SUSPECTS = ['tiger', 'monkey', 'elephant', 'zebra', 'parrot', 'giraffe'];
const CLUE_ORDER = ['patch', 'part', 'shadow'];
const ITEM_IMG = {berries: 'berry', apples: 'apple', bananas: 'banana', eggs: 'egg', gems: 'gem', stars: 'star', cherries: 'cherry'};
// object kinds. h = display height as a share of the stage height. acts = activities it can host as a clue.
const KINDS = {
  log:        {img: 'log', h: .15, acts: ['count', 'add'], items: ['berries', 'cherries', 'apples'], sur: 'star'},
  fern:       {img: 'fern', h: .24, acts: ['sound'], sur: 'nothing'},
  crate:      {img: 'crate', h: .15, acts: ['count', 'add'], items: ['apples', 'gems', 'stars'], sur: 'map'},
  chest:      {img: 'chest', h: .15, acts: ['count'], items: ['gems', 'stars'], sur: 'gem'},
  nest:       {img: 'nest', h: .12, acts: ['count'], items: ['eggs'], sur: 'egg'},
  barrel:     {img: 'barrel', h: .14, acts: ['count', 'add'], items: ['apples'], sur: 'splash'},
  bananas:    {img: 'banana2', h: .12, hang: 1, acts: ['count', 'add'], items: ['bananas'], sur: 'star'},
  cherries:   {img: 'cherry', h: .11, hang: 1, acts: ['count', 'add'], items: ['cherries'], sur: 'star'},
  binoculars: {img: 'binoculars', h: .09, acts: ['sound'], sur: 'waterfall'},
  mushroom:   {img: 'mushroom', h: .12, sur: 'mushroom'},
  flowers:    {img: 'flowers', h: .16, sur: 'flower'},
  egg:        {img: 'egg', h: .12, sur: 'egg'},
  palm:       {img: 'palm', h: .30, sur: 'palm'},
  lantern:    {img: 'lantern', h: .13, hang: 1, sur: 'lantern'},
  water:      {spot: 1, sur: 'splash'},
  waterfall:  {spot: 1, sur: 'waterfall'},
  orchid:     {spot: 1, sur: 'orchid'},
};
// Areas. Coordinates are fractions of the background picture. path = where feet go.
const AREAS = {
  trail: {
    bg: 'trail', iw: 1672, ih: 405, leoH: .36, feet: .80,
    path: [[.03, .80], [.97, .80]],
    pool: ['monkey', 'elephant', 'parrot'],
    groups: [
      {spots: [[.15, .785], [.26, .785], [.37, .785], [.49, .785], [.60, .785], [.71, .785], [.84, .785]],
       kinds: ['log', 'fern', 'crate', 'chest', 'mushroom', 'flowers', 'egg']},
      {spots: [[.215, .27], [.865, .25]], kinds: [['bananas', 'cherries']], pick: 1},
    ],
    deco: {mist: [.722, .42, .045, .25], ray: [.74, 0, .14, .6]},
  },
  river: {
    bg: 'river', iw: 1294, ih: 454, leoH: .27, feet: .66,
    path: [[.03, .64], [.20, .62], [.31, .63], [.44, .705], [.57, .74], [.70, .715], [.80, .66], [.88, .63], [.97, .64]],
    pool: ['elephant', 'zebra', 'tiger'],
    groups: [
      {spots: [[.07, .64], [.20, .615], [.885, .625], [.965, .64]], kinds: ['fern', 'palm', 'flowers', 'mushroom']},
      {spots: [[.43, .69], [.64, .73]], kinds: ['crate', 'nest'], scale: .85},
      {spots: [[.50, .93]], kinds: ['barrel'], bob: 1},
      {spots: [[.13, .16], [.93, .13]], kinds: [['bananas', 'cherries']], pick: 1},
    ],
    hot: [['water', .64, .90, .10], ['waterfall', .785, .33, .09]],
    deco: {mist: [.752, .17, .06, .36]},
  },
  canopy: {
    bg: 'canopy', iw: 1536, ih: 1024, leoH: .33, feet: .76,
    path: [[.04, .745], [.96, .745]],
    pool: ['monkey', 'parrot', 'giraffe'],
    groups: [
      {spots: [[.14, .74], [.26, .74], [.38, .74], [.51, .74], [.64, .74], [.77, .74], [.89, .74]],
       kinds: ['binoculars', 'nest', 'crate', 'chest', 'flowers', 'egg', 'mushroom'], take: 6, keep: 'binoculars'},
      {spots: [[.31, .30], [.58, .25], [.80, .33]], kinds: [['bananas', 'cherries'], 'lantern']},
    ],
    hot: [['orchid', .045, .37, .07], ['orchid', .955, .47, .07]],
    deco: {mist: [.765, .40, .06, .12]},
  },
};
const AREA_IDS = ['trail', 'river', 'canopy'];
const EN_LETTERS = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'M', 'N', 'P', 'R', 'S', 'T', 'Z'];
