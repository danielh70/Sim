// noprotect - for jsbin
if (typeof require !== 'undefined') {
  var _ = require('underscore');
}

function main() {
  var combatants = [];
  var BASE_SPEED = 255; // Equalize speed for all players so it doesn't factor into simulation.

  // Crystal arrays for convenience
  var allPerfectAirs = [ Item.PerfectAir, Item.PerfectAir, Item.PerfectAir, Item.PerfectAir ];
  var allPerfectWaters = [ Item.PerfectWater, Item.PerfectWater, Item.PerfectWater, Item.PerfectWater ];
  var allPerfectVoids = [ Item.PerfectVoid, Item.PerfectVoid, Item.PerfectVoid, Item.PerfectVoid ];
  var allPerfectFires = [ Item.PerfectFire, Item.PerfectFire, Item.PerfectFire, Item.PerfectFire ];
  var allPerfectPinks = [ Item.PerfectPink, Item.PerfectPink, Item.PerfectPink, Item.PerfectPink ];
  var allPerfectOranges = [ Item.PerfectOrange, Item.PerfectOrange, Item.PerfectOrange, Item.PerfectOrange ];

  // As a general principle, set accuracy and dodge to be about the same.
  var dualcsword = Player.generateFullyTrainedPlayer(
    'Dual C. Swords',
    { hp: 50, speed: 2, accuracy: 66, dodge: 65 },
    [
      Item.TitanGuard,
      Item.CrystalSword,
      Item.CrystalSword,
      Item.Amulet,
      Item.Amulet
    ]
  );
  assert(dualcsword.speed === BASE_SPEED);
  combatants.push(dualcsword);

  var dualscythe = Player.generateFullyTrainedPlayer(
    'Dual Scythes w/ Primes',
    { hp: 50, speed: 6, accuracy: 66, dodge: 61 },
    [
      Item.TitanGuard,
      Item.Scythe,
      Item.Scythe,
      Item.PrimeAmulet,
      Item.PrimeAmulet
    ]
  );
  assert(dualscythe.speed === BASE_SPEED);
  combatants.push(dualscythe);

  var dualrift = Player.generateFullyTrainedPlayer(
    'Dual Rift w/ Primes',
    { hp: 60, speed: 10, accuracy: 4, dodge: 109 },
    [
      Item.TitanGuard,
      Item.RiftGun,
      Item.RiftGun,
      Item.PrimeAmulet,
      Item.PrimeAmulet
    ]
  );
  assert(dualrift.speed === BASE_SPEED);
  combatants.push(dualrift);

  var maxdualrift = Player.generateFullyTrainedPlayer(
    'Maxed Dual Rift /w Infernos',
    { hp: 60, speed: 10, accuracy: 4, dodge: 109 },
    [
      Item.TitanGuard
        .socket(allPerfectVoids),
      Item.RiftGun
        .socket(allPerfectFires),
      Item.RiftGun
        .socket(allPerfectFires),
      Item.InfernoAmulet
        .socket(allPerfectPinks),
      Item.InfernoAmulet
        .socket(allPerfectPinks)
    ]
  );
  assert(maxdualrift.speed === BASE_SPEED);
  combatants.push(maxdualrift);

  var dualvoid = Player.generateFullyTrainedPlayer(
    'Dual Void w/ Primes',
    { hp: 60, speed: 6, accuracy: 65, dodge: 52 },
    [
      Item.TitanGuard,
      Item.VoidSword,
      Item.VoidSword,
      Item.PrimeAmulet,
      Item.PrimeAmulet
    ]
  );
  assert(dualvoid.speed === BASE_SPEED);
  combatants.push(dualvoid);

  var maxdualvoid = Player.generateFullyTrainedPlayer(
    'Maxed Dual Void /w Infernos',
    { hp: 60, speed: 6, accuracy: 65, dodge: 52 },
    [
      Item.TitanGuard
        .socket(allPerfectWaters),
      Item.VoidSword
        .socket(allPerfectFires),
      Item.VoidSword
        .socket(allPerfectFires),
      Item.InfernoAmulet
        .socket(allPerfectOranges),
      Item.InfernoAmulet
        .socket(allPerfectOranges)
    ]
  );
  assert(maxdualvoid.speed === BASE_SPEED);
  combatants.push(maxdualvoid);

  var riftvoid = Player.generateFullyTrainedPlayer(
    'Rift/Void w/ Primes',
    { hp: 60, speed: 8, accuracy: 35, dodge: 80 },
    [
      Item.TitanGuard,
      Item.RiftGun,
      Item.VoidSword,
      Item.PrimeAmulet,
      Item.PrimeAmulet
    ]
  );
  assert(riftvoid.speed === BASE_SPEED);
  combatants.push(riftvoid);

  var maxriftvoid = Player.generateFullyTrainedPlayer(
    'Maxed Rift/Void w/ Infernos',
    { hp: 60, speed: 8, accuracy: 35, dodge: 80 },
    [
      Item.TitanGuard
        .socket(allPerfectWaters),
      Item.RiftGun
        .socket(allPerfectAirs),
      Item.VoidSword
        .socket(allPerfectFires),
      Item.InfernoAmulet
        .socket(allPerfectOranges),
      Item.InfernoAmulet
        .socket(allPerfectOranges)
    ]
  );
  assert(maxriftvoid.speed === BASE_SPEED);
  combatants.push(maxriftvoid);


  // ============================ COMBAT SIMULATION ============================
  var combatResults = function(player1, player2) {
    var fights = 25000;
    var res = CombatSim.simulateCombat(player1, player2, fights);

    console.log('---');
    console.log(player1.name + ' VS ' + player2.name);
    console.log(player1.name + ': ' + res.player1_wins.toLocaleString() + ' (' + (Math.round((res.player1_wins / fights) * 10000) / 100) + '%)');
    console.log(player2.name + ': ' + res.player2_wins.toLocaleString() + ' (' + (Math.round((res.player2_wins / fights) * 10000) / 100) + '%)');
  };

  console.log('Running Simulation');
  combatants.forEach(function(opponent) {
    var attacker = _.extend({}, maxriftvoid);
    combatResults(attacker, opponent);
  });
}

// =============================================================================
//                                   Utilities
// =============================================================================
// Returns a random number between min and max
function getRandom(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

function ceil(num) {
  // Because of floating number arithmetic, subtract some epsilon first before
  // applying ceil. That way expressions like ceil(110 * 1.1) === 110.
  var EPSILON = 0.0000000001;
  return Math.ceil(num - EPSILON);
}

function idx(obj, key, def) {
  if (obj && typeof obj[key] !== 'undefined') {
    return obj[key];
  } else {
    return def;
  }
}

function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}

function deepFreeze(o) {
  var prop, propKey;
  Object.freeze(o); // First freeze the object.
  for (propKey in o) {
    prop = o[propKey];
    if (!o.hasOwnProperty(propKey) || typeof prop !== 'object' || Object.isFrozen(prop)) {
      // If the object is on the prototype, not an object, or is already frozen,
      // skip it. Note that this might leave an unfrozen reference somewhere in the
      // object if there is an already frozen object containing an unfrozen object.
      continue;
    }

    deepFreeze(prop); // Recursively call deepFreeze.
  }
  return o;
}

// =============================================================================
//                                   CombatSim
// =============================================================================
function CombatSim() {}
// Perform combat assuming each player is the attacker 50% of the time
CombatSim.simulateCombat = function(player1, player2, fights) {
  var player1_wins = 0;
  var player2_wins = 0;

  for (var i = 0; i < fights; i++) {
    var r;

    if (player1.speed > player2.speed) {
      r = this.fight(player1, player2);
    } else if (player2.speed > player1.speed) {
      r = this.fight(player2, player1);
    } else if (i <= (fights / 2)) {
      r = this.fight(player1, player2);
    } else {
      r = this.fight(player2, player1);
    }

    if (r === player1) {
      player1_wins++;
    } else {
      player2_wins++;
    }
  }

  var results = {
    player1_wins: player1_wins,
    player2_wins: player2_wins,
  };
  return results;
};

// Complete the fight
CombatSim.fight = function(att, def) {
  var att_hp = att.max_hp;
  var def_hp = def.max_hp;

  while (att_hp > 0 && def_hp > 0) {
    def_hp -= this.attemptHit(att, def, att.weapon1);
    def_hp -= this.attemptHit(att, def, att.weapon2);
    att_hp -= this.attemptHit(def, att, def.weapon1);
    att_hp -= this.attemptHit(def, att, def.weapon2);
  }

  return def_hp > 0 ? def : att;
};

// Returns damage given to p2 by p1 in one hit
CombatSim.attemptHit = function(att, def, weapon) {
  // Roll to-hit
  if (!this.rollCombat(att.accuracy, def.dodge)) {
    return 0;
  }

  // Roll to-damage
  var weapon_skill = att[WEAPON_TYPE_TO_SKILL[weapon.type]];
  if (!this.rollCombat(weapon_skill, def.def_skill)) {
    return 0;
  }

  // Calculate armor absorption
  var damage = getRandom(weapon.min_damage, weapon.max_damage);
  var absorb;
  if ((damage * 0.6) < def.armor) {
    absorb = Math.floor(damage * 0.6);
  } else {
    absorb = def.armor;
  }

  damage -= absorb;
  damage = (damage < 1 ? 1 : damage);

  return damage;
};

// Rolls stats against each other
CombatSim.rollCombat = function(stat1, stat2) {
  var p1Roll = getRandom(stat1 / 4, stat1);
  var p2Roll = getRandom(stat2 / 4, stat2);

  if (p1Roll === p2Roll) {
    return Math.random() > 0.5;
  } else {
    return p1Roll > p2Roll;
  }
};

var WEAPON_TYPE_TO_SKILL = Object.freeze({
  melee:      'melee_skill',
  gun:        'gun_skill',
  projectile: 'proj_skill',
  unarmed:    'def_skill',
});

// =============================================================================
//                                    Player
// =============================================================================
function Player() {}
Player.emptyStats = function() {
  return {
    max_hp:      0,
    armor:       0,
    speed:       0,
    accuracy:    0,
    dodge:       0,
    melee_skill: 0,
    gun_skill:   0,
    proj_skill:  0,
    def_skill:   0,
    weapon1: { type: 'unarmed', min_damage: 0, max_damage: 0 },
    weapon2: { type: 'unarmed', min_damage: 0, max_damage: 0 },
  };
};

Player.fullyTrainedStats = function() {
  return {
    max_hp:      0,                  // Base 0
    armor:       5,                  // 5 from 'Resilience' Ability
    speed:       50,                 // 50 from 'Time Control' Ability
    accuracy:    10,                 // 10 from 'Target Practice' Ability
    dodge:       10,                 // 10 from 'Agility Training' Ability
    melee_skill: 450,                // Maximum of 400 + 50 from 'Weapon Training' Ability
    gun_skill:   450,
    proj_skill:  450,
    def_skill:   450,                // Maximum of 400 + 50 from 'Self Defense' Ability
    weapon1:     { type: 'unarmed', min_damage: 5, max_damage: 5 }, // +5 Damage bonus from 'Combat Tactics'
    weapon2:     { type: 'unarmed', min_damage: 5, max_damage: 5 },
  };
};

Player.generateFullyTrainedPlayer = function(name, stat_points, items) {
  var hp_points       = stat_points.hp;
  var speed_points    = stat_points.speed;
  var dodge_points    = stat_points.dodge;
  var accuracy_points = stat_points.accuracy;

  if (hp_points < 2) {
    throw new Error('HP must be at least 10 (2 points)');
  }

  if (speed_points < 2) {
    throw new Error('Speed must be at least 2 points');
  }

  if (dodge_points < 4) {
    throw new Error(' Dodge must be at least 4 points');
  }

  if (accuracy_points < 4) {
    throw new Error(' Accuracy must be at least 4 points');
  }

  var MAX_STATS = 183; // 12 fixed + 3 base + 158 from leveling + 10 from 'Versatility' ability
  var total_stats = hp_points + speed_points + dodge_points + accuracy_points;
  if (total_stats !== MAX_STATS) {
    throw new Error('Stats dont add up to max. Total:' + total_stats + ' Expected:' + MAX_STATS + '.');
  }

  var stats = this.fullyTrainedStats();
  stats.max_hp   += hp_points * 5;
  stats.speed    += speed_points * 5;
  stats.dodge    += dodge_points;
  stats.accuracy += accuracy_points;

  var player = this.generatePlayer(name, stats, items);
  return player;
};

Player.generatePlayer = function(name, raw_stats, items) {
  var stats = _.extend(this.emptyStats(), raw_stats);
  stats.name = name;

  var equip_stats = Equipment.computeBonuses(items);

  // Player Stats
  stats.armor       += idx(equip_stats, 'armor',       0);
  stats.speed       += idx(equip_stats, 'speed',       0);
  stats.accuracy    += idx(equip_stats, 'accuracy',    0);
  stats.dodge       += idx(equip_stats, 'dodge',       0);
  stats.melee_skill += idx(equip_stats, 'melee_skill', 0);
  stats.gun_skill   += idx(equip_stats, 'gun_skill',   0);
  stats.proj_skill  += idx(equip_stats, 'proj_skill',  0);
  stats.def_skill   += idx(equip_stats, 'def_skill',   0);

  // Weapon 1
  stats.weapon1.type = idx(equip_stats.weapon1, 'type', stats.weapon1.type);
  stats.weapon1.min_damage += idx(equip_stats.weapon1, 'min_damage', 0);
  stats.weapon1.max_damage += idx(equip_stats.weapon1, 'max_damage', 0);

  // Weapon 2
  stats.weapon2.type = idx(equip_stats.weapon2, 'type', stats.weapon2.type);
  stats.weapon2.min_damage += idx(equip_stats.weapon2, 'min_damage', 0);
  stats.weapon2.max_damage += idx(equip_stats.weapon2, 'max_damage', 0);

  return stats;
};

// =============================================================================
//                                   Equipment
// =============================================================================
function Equipment(stats) {
  _.extend(this, stats);
  deepFreeze(this);
}

Equipment.computeBonuses = function(items) {
  var stats = {};

  var weapon1 = items[1];
  stats.weapon1 = weapon1;

  var weapon2 = items[2];
  stats.weapon2 = weapon2;

  var mixed_weap_type = (weapon1 && weapon2) && (weapon1.type !== weapon2.type);

  for (var i = 0; i < 5; i++) {
    stat_mult = {};
    if ((i === 1 || i === 2) && mixed_weap_type) {
      // Weapon skill doubled on mixed types
      stat_mult[WEAPON_TYPE_TO_SKILL[items[i].type]] = 2;
    }

    for (var stat in items[i]) {
      var stat_bonus = idx(items[i], stat, null);
      if (stat_bonus !== null) {
        stats[stat] = idx(stats, stat, 0) + (stat_bonus * idx(stat_mult, stat, 1));
      }
    }
  }

  return stats;
};


Equipment.prototype.socket = function(crystals) {
  if (crystals.size <= 0) {
    return this;
  }

  var new_stats = _.extend({}, this);
  new_stats.crystals = crystals;

  var stat_bonuses = {};
  crystals.forEach(function(c) {
    for (var stat in new_stats) {
      var stat_mult = idx(c, stat + '_mult', null);
      if (stat_mult !== null) {
        stat_bonuses[stat] = idx(stat_bonuses, stat, 0) + (new_stats[stat] * (stat_mult - 1));
      }
    }
  });

  for (var stat in stat_bonuses) {
    // Apply ceiling function after we've calculated partial bonus from all crystals.
    new_stats[stat] += ceil(stat_bonuses[stat]);
  }

  var new_item = new Equipment(new_stats);
  return new_item;
};

var Item = deepFreeze({
  none: {
    name:        'None',
  },

  // === Armor ===
  TitanGuard: new Equipment({
    name:        'Titan Guard',
    armor:       24,
    dodge:       68,
    speed:       55,
    def_skill:   40
  }),

  // === Weapons ===
  RailGun: new Equipment({
    name:        'Rail Gun',
    type:        'gun',
    min_damage:  56,
    max_damage:  88,
    accuracy:    36,
    speed:       70,
    gun_skill:   26,
    def_skill:   14
  }),

  CrystalSword: new Equipment({
    name:        'Crystal Sword',
    type:        'melee',
    min_damage:  68,
    max_damage:  84,
    accuracy:    34,
    speed:       70,
    melee_skill: 26,
    def_skill:   14
  }),

  Scythe: new Equipment({
    name:        'Scythe',
    type:        'melee',
    min_damage:  76,
    max_damage:  92,
    accuracy:    31,
    speed:       60,
    melee_skill: 40,
    def_skill:   10
  }),

  VoidSword: new Equipment({
    name:        'Void Sword',
    type:        'melee',
    min_damage:  90,
    max_damage:  120,
    accuracy:    28,
    speed:       60,
    melee_skill: 20,
    def_skill:   5
  }),

  RiftGun: new Equipment({
    name:        'Rift Gun',
    type:        'gun',
    min_damage:  60,
    max_damage:  65,
    accuracy:    85,
    speed:       50,
    gun_skill:   85,
    def_skill:   5
  }),

  // === Misc ===
  Amulet: new Equipment({
    name:        'Amulet',
    accuracy:    5,
    dodge:       5,
    def_skill:   14,
    gun_skill:   12,
    melee_skill: 12,
    proj_skill:  12
  }),

  PrimeAmulet: new Equipment({
    name:        'Prime Amulet',
    accuracy:    4,
    dodge:       4,
    def_skill:   30,
    gun_skill:   30,
    melee_skill: 30,
    proj_skill:  30
  }),

  InfernoAmulet: new Equipment({
    name:        'Inferno Amulet',
    accuracy:    8,
    dodge:       8,
    def_skill:   40,
    gun_skill:   40,
    melee_skill: 40,
    proj_skill:  40
  }),

  // === Crystals ===
  PerfectFire: {
    name: 'Perfect Fire',
    min_damage_mult: 1.1,
    max_damage_mult: 1.1,
  },

  PerfectVoid: {
    name: 'Perfect Void',
    armor_mult: 1.1,
  },

  PerfectWater: {
    name: 'Perfect Water',
    dodge_mult: 1.05,
  },

  PerfectAir: {
    name: 'Perfect Air',
    accuracy_mult: 1.05,
  },

  PerfectPink: {
    name: 'Perfect Pink',
    def_skill_mult: 1.2,
  },

  PerfectOrange: {
    name: 'Perfect Orange',
    melee_skill_mult: 1.2,
  },

  PerfectGreen: {
    name: 'Perfect Green',
    gun_skill_mult: 1.2,
  },

  PerfectYellow: {
    name: 'Perfect Yellow',
    proj_skill_mult: 1.2,
  },

  PerfectNull: {
    name: 'Perfect Null',
    speed_mult: 1.2,
  }
});

// =============================================================================

// Main entry point
if (typeof require === 'undefined' || require.main === module) {
  main();
}

if (typeof module !== 'undefined') {
  module.exports = {
    CombatSim: CombatSim,
    Player: Player,
    Equipment: Equipment,
    Item: Item,
  };
}
