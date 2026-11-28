/* ---------- static data: animals, areas, objects ---------- */
// patch / part: [focusX, focusY, zoom] inside the animal picture (for the clue cards)
const ANIMALS = {
  tiger:    {img: 'tiger',    w: 507, h: 520, patch: [.50, .66, 3.0], part: [.09, .50, 2.4], pitch: .85},
  monkey:   {img: 'monkey',   w: 469, h: 520, patch: [.45, .68, 3.0], part: [.13, .50, 2.4], pitch: 1.45},
  elephant: {img: 'elephant', w: 512, h: 520, patch: [.45, .70, 3.0], part: [.86, .28, 2.4], pitch: .75},
  zebra:    {img: 'zebra',    w: 419, h: 520, patch: [.45, .60, 3.0], part: [.11, .55, 2.4], pitch: 1.1},
  parrot:   {img: 'parrot',   w: 481, h: 485, patch: [.45, .50, 3.0], part: [.80, .22, 2.4], pitch: 1.6},
  giraffe:  {img: 'giraffe',  w: 297, h: 520, patch: [.40, .60, 3.0], part: [.70, .14, 1.9], pitch: 1.0},
  deer:     {img: 'deer',     w: 359, h: 520, pitch: 1.3},
};
const SUSPECTS = ['tiger', 'monkey', 'elephant', 'zebra', 'parrot', 'giraffe'];
const CLUE_ORDER = ['patch', 'part', 'shadow'];
const ITEM_IMG = {berries: 'berry1', apples: 'apple', bananas: 'banana1', eggs: 'egg1', gems: 'gem', stars: 'star', cherries: 'cherry1'};
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
    bg: 'trail', iw: 1536, ih: 1024, leoH: .34, feet: .80,
    path: [[.04, .77], [.96, .77]],
    pool: ['monkey', 'elephant', 'parrot'],
    groups: [
      {spots: [[.15, .765], [.27, .765], [.39, .765], [.51, .765], [.63, .765], [.75, .765], [.87, .765]],
       kinds: ['log', 'fern', 'crate', 'chest', 'mushroom', 'flowers', 'egg']},
      {spots: [[.25, .16], [.86, .10]], kinds: [['bananas', 'cherries']], pick: 1},
    ],
  },
  river: {
    bg: 'river', iw: 1536, ih: 1024, leoH: .30, feet: .70,
    path: [[.04, .625], [.96, .625]],
    pool: ['elephant', 'zebra', 'tiger'],
    groups: [
      {spots: [[.11, .62], [.89, .62]], kinds: ['fern', 'flowers']},
      {spots: [[.36, .625], [.63, .625]], kinds: ['crate', 'nest'], scale: .85},
      {spots: [[.47, .87]], kinds: ['barrel'], bob: 1},
      {spots: [[.13, .09], [.92, .07]], kinds: [['bananas', 'cherries']], pick: 1},
    ],
    hot: [['water', .62, .86, .10], ['waterfall', .77, .30, .09]],
    deco: {mist: [.77, .40, .07, .22]},
  },
  canopy: {
    bg: 'canopy', iw: 1536, ih: 1024, leoH: .32, feet: .76,
    path: [[.04, .695], [.96, .695]],
    pool: ['monkey', 'parrot', 'giraffe'],
    groups: [
      {spots: [[.14, .69], [.26, .69], [.38, .69], [.51, .69], [.64, .69], [.77, .69], [.89, .69]],
       kinds: ['binoculars', 'nest', 'crate', 'chest', 'flowers', 'egg', 'mushroom'], take: 6, keep: 'binoculars'},
      {spots: [[.45, .12], [.66, .10]], kinds: [['bananas', 'cherries'], 'lantern']},
    ],
    hot: [['orchid', .05, .27, .07], ['orchid', .96, .36, .07]],
  },
};
const AREA_IDS = ['trail', 'river', 'canopy'];
const EN_LETTERS = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'M', 'N', 'P', 'R', 'S', 'T', 'Z'];
