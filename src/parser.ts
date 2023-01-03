import { cloneDeep } from "lodash";
import { EventEmitter } from "events";

import * as LogLines from "./log-lines";
import { tryParseInt } from "./util";
import { healingSkills, HitFlag, HitOption } from "./constants";

export interface DamageStatistics {
  totalDamageDealt: number;
  topDamageDealt: number;
  totalDamageTaken: number;
  topDamageTaken: number;
  totalHealingDone: number;
  topHealingDone: number;
  totalShieldDone: number;
  topShieldDone: number;
}
export interface Game {
  startedOn: number;
  lastCombatPacket: number;
  fightStartedOn: number;
  localPlayer: string;
  entities: { [name: string]: Entity };
  damageStatistics: DamageStatistics;
}
export interface GameNew {
  startedOn: number;
  lastCombatPacket: number;
  fightStartedOn: number;
  entities: { [name: string]: Entity };
  damageStatistics: DamageStatistics;
}
export interface HealSource {
  source: string;
  expires: number;
}

export interface Entity {
  lastUpdate: number;
  id: string;
  npcId: number;
  name: string;
  class: string;
  classId: number;
  isPlayer: boolean;
  isDead: boolean;
  deaths: number;
  deathTime: number;
  gearScore: number;
  currentHp: number;
  maxHp: number;
  damageDealt: number;
  damageDealtDebuffedBySupport: number;
  damageDealtBuffedBySupport: number;
  healingDone: number;
  shieldDone: number;
  damageTaken: number;
  skills: { [name: string]: EntitySkills };
  hits: Hits;
}

export interface Breakdown {
  timestamp: number;
  damage: number;
  targetEntity: string;
  isCrit: boolean;
  isBackAttack: boolean;
  isFrontAttack: boolean;
  isDebuffedBySupport: boolean;
  isBuffedBySupport: boolean;
}

export interface EntitySkills {
  id: number;
  name: string;
  totalDamage: number;
  damageDebuffedBySupport: number;
  damageBuffedBySupport: number;
  maxDamage: number;
  hits: Hits;
  breakdown: Breakdown[];
}

function createEntitySkill(): EntitySkills {
  const newEntitySkill: EntitySkills = {
    id: 0,
    name: "",
    totalDamage: 0,
    damageDebuffedBySupport: 0,
    damageBuffedBySupport: 0,
    maxDamage: 0,
    hits: {
      casts: 0,
      total: 0,
      crit: 0,
      backAttack: 0,
      frontAttack: 0,
      counter: 0,
      hitsDebuffedBySupport: 0,
      hitsBuffedBySupport: 0,
    },
    breakdown: [],
  };
  return newEntitySkill;
}

interface Hits {
  casts: number;
  total: number;
  crit: number;
  backAttack: number;
  frontAttack: number;
  counter: number;
  hitsDebuffedBySupport: number;
  hitsBuffedBySupport: number;
}
function createEntity(): Entity {
  const newEntity: Entity = {
    lastUpdate: 0,
    id: "",
    npcId: 0,
    name: "",
    class: "",
    classId: 0,
    isPlayer: false,
    isDead: false,
    deaths: 0,
    deathTime: 0,
    gearScore: 0,
    currentHp: 0,
    maxHp: 0,
    damageDealt: 0,
    damageDealtDebuffedBySupport: 0,
    damageDealtBuffedBySupport: 0,
    healingDone: 0,
    shieldDone: 0,
    damageTaken: 0,
    skills: {},
    hits: {
      casts: 0,
      total: 0,
      crit: 0,
      backAttack: 0,
      frontAttack: 0,
      counter: 0,
      hitsDebuffedBySupport: 0,
      hitsBuffedBySupport: 0,
    },
  };
  return newEntity;
}

export class LogParser extends EventEmitter {
  resetTimer: ReturnType<typeof setTimeout> | null;

  debugLines: boolean;
  isLive: boolean;
  dontResetOnZoneChange: boolean;
  resetAfterPhaseTransition: boolean;
  splitOnPhaseTransition: boolean;
  removeOverkillDamage: boolean;

  phaseTransitionResetRequest: boolean;
  phaseTransitionResetRequestTime: number;

  game!: Game;
  encounters: Game[];
  healSources!: HealSource[];

  constructor(isLive = false) {
    super();

    this.resetTimer = null;

    this.debugLines = false;
    this.isLive = isLive;
    this.dontResetOnZoneChange = false;
    this.resetAfterPhaseTransition = false;
    this.splitOnPhaseTransition = false;
    this.removeOverkillDamage = true;

    this.phaseTransitionResetRequest = false;
    this.phaseTransitionResetRequestTime = 0;

    this.resetState();
    this.encounters = [];

    if (this.isLive) {
      setInterval(this.broadcastStateChange.bind(this), 100);
    }
  }
  updateOrCreateLocalPlayer(newLocal: string) {
    //Keep local player if exist, and update id to new one (/!\ we'll have to track the next newpc for localplayer spawn)
    if (this.game && newLocal !== "") {
      const localPlayerEntity = this.game.entities[this.game.localPlayer];
      if (localPlayerEntity) {
        //Update existing
        this.updateEntity(this.game.localPlayer, {
          id: newLocal,
          name: localPlayerEntity.name,
          class: localPlayerEntity.class,
          classId: localPlayerEntity.classId,
          isPlayer: true,
          gearScore: localPlayerEntity.gearScore,
        });
      } else {
        //Create empty localplayer
        this.game.localPlayer = "You";
        this.updateEntity(this.game.localPlayer, {
          id: newLocal,
          name: "You",
          isPlayer: true,
        });
      }
    }
  }
  resetState() {
    if (this.debugLines)
      this.emit("log", {
        type: "debug",
        message: "Resetting state",
      });

    const clone = cloneDeep(this.game);
    const curTime = +new Date();
    let entities: { [key: string]: Entity } = {};
    this.game = {
      startedOn: curTime,
      lastCombatPacket: curTime,
      fightStartedOn: 0,
      localPlayer: this.game?.localPlayer ?? "", //We never reset localplayer outside of initenv or initpc
      entities,
      damageStatistics: {
        totalDamageDealt: 0,
        topDamageDealt: 0,
        totalDamageTaken: 0,
        topDamageTaken: 0,
        totalHealingDone: 0,
        topHealingDone: 0,
        totalShieldDone: 0,
        topShieldDone: 0,
      },
    };

    if (clone && clone.localPlayer !== "") {
      const localPlayerEntity = clone.entities[this.game.localPlayer];
      if (localPlayerEntity)
        this.updateEntity(localPlayerEntity.name, {
          id: localPlayerEntity.id,
          name: localPlayerEntity.name,
          class: localPlayerEntity.class,
          classId: localPlayerEntity.classId,
          isPlayer: true,
          gearScore: localPlayerEntity.gearScore,
        });
    }
    this.healSources = [];
    this.emit("reset-state", clone);
  }
  softReset() {
    this.resetTimer = null;
    const entitiesCopy = cloneDeep(this.game.entities);
    this.resetState();
    for (const entity of Object.values(entitiesCopy)) {
      this.updateEntity(entity.name, {
        name: entity.name,
        npcId: entity.npcId,
        class: entity.class,
        classId: entity.classId,
        isPlayer: entity.isPlayer,
        gearScore: entity.gearScore,
        maxHp: entity.maxHp,
        currentHp: entity.currentHp,
      });
    }
  }
  cancelReset() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = null;
  }
  splitEncounter(softReset = false) {
    const curState = cloneDeep(this.game);
    if (
      curState.fightStartedOn != 0 && // no combat packets
      (curState.damageStatistics.totalDamageDealt != 0 || curState.damageStatistics.totalDamageTaken) // no player damage dealt OR taken
    )
      this.encounters.push(curState);
    if (softReset) this.softReset();
    else this.resetState();
  }

  broadcastStateChange() {
    const clone: Game = cloneDeep(this.game);
    // Dont send breakdowns; will hang up UI
    Object.values(clone.entities).forEach((entity) => {
      Object.values(entity.skills).forEach((skill) => {
        skill.breakdown = [];
      });
    });

    this.emit("state-change", clone);
  }

  parseLogLine(line: string) {
    if (!line) return;

    const lineSplit = line.trim().split("|");
    if (lineSplit.length < 1 || !lineSplit[0]) return;

    const logType = tryParseInt(lineSplit[0]);

    try {
      switch (logType) {
        case 0:
          this.onMessage(lineSplit);
          break;
        case 1:
          this.onInitEnv(lineSplit);
          break;
        case 2:
          this.onPhaseTransition(lineSplit);
          break;
        case 3:
          this.onNewPc(lineSplit);
          break;
        case 4:
          this.onNewNpc(lineSplit);
          break;
        case 5:
          this.onDeath(lineSplit);
          break;
        case 6:
          this.onSkillStart(lineSplit);
          break;
        case 7:
          this.onSkillStage(lineSplit);
          break;
        case 8:
          this.onDamage(lineSplit);
          break;
        case 9:
          this.onHeal(lineSplit);
          break;
        case 10:
          this.onBuff(lineSplit);
          break;
        case 12:
          this.onCounterattack(lineSplit);
          break;
      }
    } catch (e) {
      this.emit("log", { type: "error", message: e });
    }
  }

  updateEntity(entityName: string, values: Record<string, unknown>) {
    const updateTime = { lastUpdate: +new Date() };
    let entity;
    if (!(entityName in this.game.entities)) {
      entity = {
        ...createEntity(),
        ...values,
        ...updateTime,
      };
    } else {
      entity = {
        ...createEntity(),
        ...this.game.entities[entityName],
        ...values,
        ...updateTime,
      };
    }
    this.game.entities[entityName] = entity;
    return entity;
  }

  // logId = 0
  onMessage(lineSplit: string[]) {
    const logLine = new LogLines.LogMessage(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onMessage: ${logLine.message}`,
      });
    }

    if (!logLine.message.startsWith("Arguments:")) {
      this.emit("message", logLine.message);
    }
  }

  // logId = 1
  onInitEnv(lineSplit: string[]) {
    const logLine = new LogLines.LogInitEnv(lineSplit);
    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: "onInitEnv",
      });
    }
    //Update localplayer
    this.updateOrCreateLocalPlayer(logLine.playerId);

    if (this.isLive) {
      //Cleanup entities that are not displayed (we keep others in case user want to keep his previous encounter)
      for (const key in this.game.entities) {
        if (this.game.entities[key]?.name !== this.game.localPlayer && this.game.entities[key]?.hits.total === 0)
          delete this.game.entities[key];
      }

      if (this.dontResetOnZoneChange === false && this.resetTimer == null) {
        if (this.debugLines) {
          this.emit("log", {
            type: "debug",
            message: "Setting a reset timer",
          });
        }

        //Then
        this.resetTimer = setTimeout(() => {
          this.softReset();
        }, 6000);
        this.emit("message", "new-zone");
      }
    } else {
      this.splitEncounter();
      this.emit("message", "new-zone");
    }
  }

  // logId = 2
  onPhaseTransition(lineSplit: string[]) {
    const logLine = new LogLines.LogPhaseTransition(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onPhaseTransition: ${logLine.phaseCode}`,
      });
    }

    if (this.isLive) {
      this.emit("message", `phase-transition-${logLine.phaseCode}`);

      if (this.resetAfterPhaseTransition) {
        this.phaseTransitionResetRequest = true;
        this.phaseTransitionResetRequestTime = +new Date();
      }
    }

    if (!this.isLive && this.splitOnPhaseTransition) {
      this.splitEncounter(true);
    }
  }

  // logId = 3
  onNewPc(lineSplit: string[]) {
    const logLine = new LogLines.LogNewPc(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onNewPc: ${logLine.id}, ${logLine.name}, ${logLine.classId}, ${logLine.class}, ${logLine.gearScore}, ${logLine.currentHp}, ${logLine.maxHp}`,
      });
    }
    if (this.game && this.game.localPlayer !== "") {
      const localPlayerEntity = this.game.entities[this.game.localPlayer];
      if (localPlayerEntity && localPlayerEntity.id === logLine.id) {
        //We tracked new localPlayer
        //We don't delete old one, in case user want to keep log active,
        //but it's not local player so it'll be delete on zone change
        //delete this.game.entities[this.game.localPlayer];
        this.game.localPlayer = logLine.name;
      }
    }
    this.updateEntity(logLine.name, {
      id: logLine.id,
      name: logLine.name,
      class: logLine.class,
      classId: logLine.classId,
      isPlayer: true,
      ...(logLine.gearScore && logLine.gearScore != 0 && { gearScore: logLine.gearScore }),
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp,
    });
  }

  // logId = 4
  onNewNpc(lineSplit: string[]) {
    const logLine = new LogLines.LogNewNpc(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onNewNpc: ${logLine.id}, ${logLine.name}, ${logLine.currentHp}, ${logLine.maxHp}`,
      });
    }

    this.updateEntity(logLine.name, {
      id: logLine.id,
      name: logLine.name,
      npcId: logLine.npcId,
      isPlayer: false,
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp,
    });
  }

  // logId = 5
  onDeath(lineSplit: string[]) {
    const logLine = new LogLines.LogDeath(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onDeath: ${logLine.name} ${logLine.killerName}`,
      });
    }

    const entity = this.game.entities[logLine.name];

    let deaths = 0;
    if (!entity) deaths = 1;
    else if (entity.isDead) deaths = entity.deaths;
    else deaths = entity.deaths + 1;

    this.updateEntity(logLine.name, {
      name: logLine.name,
      isDead: true,
      deathTime: +logLine.timestamp,
      deaths,
    });
  }

  // logId = 6
  onSkillStart(lineSplit: string[]) {
    const logLine = new LogLines.LogSkillStart(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onSkillStart: ${logLine.id}, ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}`,
      });
    }
    const healingSkill = healingSkills[logLine.skillName];
    if (healingSkill) {
      this.healSources.push({
        source: logLine.name,
        expires: +logLine.timestamp + healingSkill.duration,
      });
    }

    this.updateEntity(logLine.name, {
      name: logLine.name,
      isDead: false,
    });

    const entity = this.game.entities[logLine.name];
    if (entity) {
      entity.hits.casts += 1;
      let skill = entity.skills[logLine.skillName];
      if (!skill) {
        skill = {
          ...createEntitySkill(),
          ...{ id: logLine.skillId, name: logLine.skillName },
        };
        entity.skills[logLine.skillName] = skill;
        skill.hits.casts += 1;
      }
    }
  }

  // logId = 7
  onSkillStage(lineSplit: string[]) {
    const logLine = new LogLines.LogSkillStage(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onSkillStage: ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}, ${logLine.skillStage}`,
      });
    }
  }

  // logId = 8
  onDamage(lineSplit: string[]) {
    if (lineSplit.length < 13) return;
    const logLine = new LogLines.LogDamage(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onDamage: ${logLine.id}, ${logLine.name}, ${logLine.skillId}, ${logLine.skillName}, ${logLine.skillEffectId}, ${logLine.skillEffect}, ${logLine.targetId}, ${logLine.targetName}, ${logLine.damage}, ${logLine.currentHp}, ${logLine.maxHp}`,
      });
    }

    if (
      this.phaseTransitionResetRequest &&
      this.phaseTransitionResetRequestTime > 0 &&
      this.phaseTransitionResetRequestTime < +new Date() - 8000
    ) {
      this.softReset();
      this.phaseTransitionResetRequest = false;
    }

    this.updateEntity(logLine.name, {
      id: logLine.id,
      name: logLine.name,
    });

    this.updateEntity(logLine.targetName, {
      id: logLine.targetId,
      name: logLine.targetName,
      currentHp: logLine.currentHp,
      maxHp: logLine.maxHp,
    });

    const damageOwner = this.game.entities[logLine.name];
    const damageTarget = this.game.entities[logLine.targetName];
    if (!damageOwner || !damageTarget) return;
    if (!damageTarget.isPlayer && this.removeOverkillDamage && logLine.currentHp < 0) {
      logLine.damage = logLine.damage + logLine.currentHp;
    }

    if (logLine.skillId === 0 && logLine.skillEffectId !== 0) {
      logLine.skillId = logLine.skillEffectId;
      logLine.skillName = logLine.skillEffect;
    }
    let skill = damageOwner.skills[logLine.skillName];
    if (!skill) {
      skill = {
        ...createEntitySkill(),
        ...{ id: logLine.skillId, name: logLine.skillName },
      };
      damageOwner.skills[logLine.skillName] = skill;
    }

    const hitFlag: HitFlag = logLine.damageModifier & 0xf;
    const hitOption: HitOption = ((logLine.damageModifier >> 4) & 0x7) - 1;

    // TODO: Keeping for now; Not sure if referring to damage share on Valtan G1 or something else
    // TODO: Not sure if this is fixed in the logger
    if (logLine.skillName === "Bleed" && logLine.damage > 10000000) return;

    // Remove 'sync' bleeds on G1 Valtan
    if (logLine.skillName === "Bleed" && hitFlag === HitFlag.HIT_FLAG_DAMAGE_SHARE) return;

    const isCrit = hitFlag === HitFlag.HIT_FLAG_CRITICAL || hitFlag === HitFlag.HIT_FLAG_DOT_CRITICAL;
    const isBackAttack = hitOption === HitOption.HIT_OPTION_BACK_ATTACK;
    const isFrontAttack = hitOption === HitOption.HIT_OPTION_FRONTAL_ATTACK;

    const critCount = isCrit ? 1 : 0;
    const backAttackCount = isBackAttack ? 1 : 0;
    const frontAttackCount = isFrontAttack ? 1 : 0;
    const debuffAttackCount = logLine.targetIsDebuffedBySupport ? 1 : 0;
    const buffAttackCount = logLine.sourceIsBuffedBySupport ? 1 : 0;

    skill.totalDamage += logLine.damage;
    skill.damageBuffedBySupport += logLine.sourceIsBuffedBySupport ? logLine.damage : 0;
    skill.damageDebuffedBySupport  += logLine.targetIsDebuffedBySupport ? logLine.damage : 0;
    if (logLine.damage > skill.maxDamage) skill.maxDamage = logLine.damage;

    damageOwner.damageDealt += logLine.damage;
    damageTarget.damageTaken += logLine.damage;
    damageOwner.damageDealtBuffedBySupport += logLine.sourceIsBuffedBySupport ? logLine.damage : 0;
    damageOwner.damageDealtDebuffedBySupport += logLine.targetIsDebuffedBySupport ? logLine.damage : 0;

    if (logLine.skillName !== "Bleed") {
      damageOwner.hits.total += 1;
      damageOwner.hits.crit += critCount;
      damageOwner.hits.backAttack += backAttackCount;
      damageOwner.hits.frontAttack += frontAttackCount;
      damageOwner.hits.hitsBuffedBySupport += buffAttackCount;
      damageOwner.hits.hitsDebuffedBySupport += debuffAttackCount;

      skill.hits.total += 1;
      skill.hits.crit += critCount;
      skill.hits.backAttack += backAttackCount;
      skill.hits.frontAttack += frontAttackCount;
      skill.hits.hitsBuffedBySupport += buffAttackCount;
      skill.hits.hitsDebuffedBySupport += debuffAttackCount;
    }

    if (damageOwner.isPlayer) {
      this.game.damageStatistics.totalDamageDealt += logLine.damage;
      this.game.damageStatistics.topDamageDealt = Math.max(
        this.game.damageStatistics.topDamageDealt,
        damageOwner.damageDealt
      );

      const breakdown: Breakdown = {
        timestamp: +logLine.timestamp,
        damage: logLine.damage,
        targetEntity: damageTarget.id,
        isCrit,
        isBackAttack,
        isFrontAttack,
        isBuffedBySupport: logLine.sourceIsBuffedBySupport,
        isDebuffedBySupport: logLine.targetIsDebuffedBySupport,
      };

      skill.breakdown.push(breakdown);
    }

    if (damageTarget.isPlayer) {
      this.game.damageStatistics.totalDamageTaken += logLine.damage;
      this.game.damageStatistics.topDamageTaken = Math.max(
        this.game.damageStatistics.topDamageTaken,
        damageTarget.damageTaken
      );
    }

    if (this.game.fightStartedOn === 0) this.game.fightStartedOn = +logLine.timestamp;
    this.game.lastCombatPacket = +logLine.timestamp;
  }

  // logId = 9
  onHeal(lineSplit: string[]) {
    const logLine = new LogLines.LogHeal(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onHeal: ${logLine.id}, ${logLine.name}, ${logLine.healAmount}`,
      });
    }

    let sourceName = "";
    for (const source of this.healSources) {
      if (source.expires >= +logLine.timestamp) {
        sourceName = source.source;
        break;
      }
    }
    if (!sourceName) return;

    const entity = this.updateEntity(sourceName, {
      name: sourceName,
    });

    entity.healingDone += logLine.healAmount;

    if (entity.isPlayer) {
      this.game.damageStatistics.totalHealingDone += logLine.healAmount;
      this.game.damageStatistics.topHealingDone = Math.max(
        this.game.damageStatistics.topHealingDone,
        entity.healingDone
      );
    }
  }

  // logId = 10
  onBuff(lineSplit: string[]) {
    const logLine = new LogLines.LogBuff(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onBuff: ${logLine.id}, ${logLine.name}, ${logLine.buffId}, ${logLine.buffName}, ${logLine.sourceId}, ${logLine.sourceName}, ${logLine.shieldAmount}`,
      });
    }

    if (logLine.shieldAmount && logLine.isNew) {
      const entity = this.updateEntity(logLine.name, {
        name: logLine.name,
      });

      entity.shieldDone += logLine.shieldAmount;

      if (entity.isPlayer) {
        this.game.damageStatistics.totalShieldDone += logLine.shieldAmount;
        this.game.damageStatistics.topShieldDone = Math.max(
          this.game.damageStatistics.topShieldDone,
          entity.shieldDone
        );
      }
    }
  }

  // logId = 12
  onCounterattack(lineSplit: string[]) {
    const logLine = new LogLines.LogCounterattack(lineSplit);

    if (this.debugLines) {
      this.emit("log", {
        type: "debug",
        message: `onCounterattack: ${logLine.id}, ${logLine.name}`,
      });
    }

    const entity = this.updateEntity(logLine.name, {
      name: logLine.name,
    });

    // TODO: Add skill name from logger
    entity.hits.counter += 1;
  }
}
