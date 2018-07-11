const initialSeeding = [
  '-',
  'Revolver',
  'Doublewide',
  'Ring of Fire',
  'Colony',
  'Clapham Ultimate',
  'GOAT',
  'Bad Skid',
  'General Strike',
  'Flying Angels Bern',
  'Nomadic Tribe',
  'Ragnarok',
  'CUSB',
  'TCHAC',
  'FWD>>',
  'OTSO',
  'Hot Chilly',
  'Juggernaut',
  'Wildcats',
  'KFUM Örebro Frisbee',
  'Comunidad El Osos',
  'Freespeed',
  'Ranelagh',
  'Chevron Action Flash',
  'Euforia',
  'Fenix Ultimate',
  'Relámpagos',
  'Family Ultimate',
  'Freezzz Beezzz',
  'Sokol',
  'Heat Haze',
  'Devon',
  'Crackerjacks',
  'Mooncatchers',
  'PELT Ultimate',
  'IZNOGOOD',
  'thebigEZ',
  'Shanghai Chuchai',
  'Warao Ultimate Club',
  'Daione Kumay',
  'Long Donkeys'
];

const numPools = 8;
const numPowerPools = 10;

function seedToPosition(seed) {
  return Math.ceil(seed / numPools);
}

function shouldReverseForPos(position) {
  return Math.floor(position / 2) % 2;
}

function seedToPool(seed, shouldReverse) {
  let pool = seed % numPools;
  if (pool === 0)
    pool = numPools;
  if (shouldReverse)
    pool = numPools + 1 - pool;
  return pool;
}

function seedToPoolIndexMap(seed) {
  var position = seedToPosition(seed);
  var shouldReverse = shouldReverseForPos(position);
  var pool = seedToPool(seed, shouldReverse);

  return {
    pool: pool - 1,
    pos: position - 1
  };
}

function seedToPowerPoolIndexMap(seed) {
  let i = seed - 1;
  let group = 0;
  if (i >= 16 && i < 32) {
    group = 1;
    i -= 16;
  }
  else if (i >= 32 && i < 40) {
    group = 2;
    i -= 32;
  }

  let a = Math.floor(i / 4);
  let b = i % 4;
  if (group === 2) a = Math.floor(i / 2);

  let poolIndex;

  switch (a) {
    case 0:
      poolIndex = [b, a];
      break;
    case 1:
      poolIndex = [(b+2) % 4, a];
      if (group === 2)
        poolIndex = [(b+1) % 2, a];
      break;
    case 2:
      poolIndex = [(5-b) % 4, a];
      if (group === 2)
        poolIndex = [(b+1) % 2, a];
      break;
    case 3:
      poolIndex = [(3-b) % 4, a];
      if (group === 2)
        poolIndex = [b % 2, a];
      break;
  }

  if (group === 1) poolIndex[0] += 4;
  else if (group === 2) poolIndex[0] += 8;

  return {
    pool: poolIndex[0],
    pos: poolIndex[1]
  };
}

let poolData = [];
initialSeeding.forEach((team, i) => {
  if (i === 0)
     return;

  if (i <= numPools) {
    poolData.push({
      name: String.fromCharCode(64 + i),
      teams: [
        team
      ]
    })
  }
  else {
    let teamPoolIndex = seedToPoolIndexMap(i);
    poolData[teamPoolIndex.pool].teams.push(team);
  }
});

Vue.component('pool-results', {
  template: '#pool-results-template',
  props: ['pool', 'poolResults'],
  methods: {
    seedForTeam(team) {
      return initialSeeding.indexOf(team);
    }
  }
});

Vue.component('bracket', {
  template: '#bracket-template',
  props: ['teams', 'initialRounds'],
  data() {
    return {
      rounds: _.cloneDeep(this.initialRounds)
    }
  },
  methods: {
    teamsForMatch: function(match, round) {
      if (round == 0) {
        var teamIndices = this.rounds[0][match].teams;
        return [
          teamIndices[0],
          teamIndices[1]
        ]
      }
      else {
        var previousRound = this.rounds[round - 1]
        return [
          previousRound[match * 2].winner,
          previousRound[match * 2 + 1].winner]
      }
    },
    onSelectWinner: function(team, match, round) {
      var teams = this.teamsForMatch(match, round);

      if (teams[team] === 0)
        return

      var match = this.rounds[round][match];
      match.winner = teams[team]
      match.selected = team
    }
  },
  computed: {
    roundsWithTeams() {
      let roundsWithTeams = _.cloneDeep(this.rounds);
      roundsWithTeams.forEach((round, roundIdx) => {
        round.forEach((match, matchIdx) => {
          let teamIndices = this.teamsForMatch(matchIdx, roundIdx);
          match.teams = [
            this.teams[teamIndices[0]],
            this.teams[teamIndices[1]]
          ]
          if (!_.includes(teamIndices, match.winner)) {
            match.winner = 0;
            match.selected = null;

            var origMatch = this.rounds[roundIdx][matchIdx]
            origMatch.winner = 0;
            origMatch.selected = null;
          }
        })
      })
      return roundsWithTeams;
    }
  }
});

new Vue({
  el: '#app',
  data() {
    return {
      tournament: 'WUCC 2018',
      title: 'Men\'s Division',
      poolData: poolData,
      teamsAfterPools: [],
      powerPoolData: [],
      teamsAfterPowerPools: [],
      rounds: [[
        {
          info: 'Bye (1)',
          teams: [1, 0],
          winner: 1,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (14 vs 19)',
          teams: [14, 19],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (8)',
          teams: [8, 0],
          winner: 8,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (11 vs 22)',
          teams: [11, 22],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (4)',
          teams: [4, 0],
          winner: 4,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (15 vs 18)',
          teams: [15, 18],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (5)',
          teams: [5, 0],
          winner: 5,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (10 vs 23)',
          teams: [10, 23],
          winner: 0,
          selected: null
        }, {
          info: 'Bye (2)',
          teams: [2, 0],
          winner: 2,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (13 vs 20)',
          teams: [13, 20],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (7)',
          teams: [7, 0],
          winner: 7,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (12 vs 21)',
          teams: [12, 21],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (3)',
          teams: [3, 0],
          winner: 3,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (16 vs 17)',
          teams: [16, 17],
          winner: 0,
          selected: null
        },
        {
          info: 'Bye (6)',
          teams: [6, 0],
          winner: 6,
          selected: 0,
          bye: true
        },
        {
          info: 'RO32 (9 vs 24)',
          teams: [9, 24],
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'RO16 (1 vs 14)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (8 vs 11)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (4 vs 15)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (5 vs 10)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (2 vs 13)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (7 vs 12)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (3 vs 16)',
          winner: 0,
          selected: null
        },
        {
          info: 'RO16 (6 vs 9)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'QF (1 vs 8)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (4 vs 5)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (2 vs 7)',
          winner: 0,
          selected: null
        },
        {
          info: 'QF (3 vs 6)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'SF (1 vs 4)',
          winner: 0,
          selected: null
        },
        {
          info: 'SF (2 vs 3)',
          winner: 0,
          selected: null
        }
      ], [
        {
          info: 'Final (1 vs 2)',
          winner: 0,
          selected: null
        }
      ]]
    }
  },
  created() {
    this.updatePowerPoolInitialData();
    this.updateBracketInitialData();
  },
  methods: {
    updatePowerPoolInitialData() {
      this.teamsAfterPools = this.teamListAfterPools();
    this.powerPoolData = this.updatePowerPoolData();
    },
    updateBracketInitialData() {
      this.teamsAfterPowerPools = this.teamListAfterPowerPools();
    },
    teamListAfterPools() {
      let teamList = [
        '-'
      ]
      for (let i = 1; i < initialSeeding.length; i++) {
        let teamIndex = seedToPoolIndexMap(i);
        let pool = teamIndex.pool;
        let pos = teamIndex.pos;
        teamList.push(poolData[pool].teams[pos]);
      }
      return teamList;
    },
    updatePowerPoolData() {
      let poolData = [];
      this.teamsAfterPools.forEach((team, i) => {
        if (i === 0)
           return;

        let teamPoolIndex = seedToPowerPoolIndexMap(i);
        if (!poolData[teamPoolIndex.pool]) {
          poolData.push({
            name: String.fromCharCode(64 + teamPoolIndex.pool + 9),
            teams: []
          })
        }
        poolData[teamPoolIndex.pool].teams.push(team);
      });
      return poolData;
    },
    teamListAfterPowerPools() {
      let teamList = [
        '-'
      ]
      for (let i = 1; i < initialSeeding.length; i++) {
        let teamIndex = seedToPowerPoolIndexMap(i);
        let pool = teamIndex.pool;
        let pos = teamIndex.pos;
        teamList.push(this.powerPoolData[pool].teams[pos]);
      }
      return teamList;
    }
  }
})
