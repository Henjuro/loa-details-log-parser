import { EventEmitter } from 'events';

interface DamageStatistics {
    totalDamageDealt: number;
    topDamageDealt: number;
    totalDamageTaken: number;
    topDamageTaken: number;
    totalHealingDone: number;
    topHealingDone: number;
    totalShieldDone: number;
    topShieldDone: number;
}
interface Game {
    startedOn: number;
    lastCombatPacket: number;
    fightStartedOn: number;
    localPlayer: string;
    entities: {
        [name: string]: Entity;
    };
    damageStatistics: DamageStatistics;
}
interface GameNew {
    startedOn: number;
    lastCombatPacket: number;
    fightStartedOn: number;
    entities: {
        [name: string]: Entity;
    };
    damageStatistics: DamageStatistics;
}
interface HealSource {
    source: string;
    expires: number;
}
interface Entity {
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
    healingDone: number;
    shieldDone: number;
    damageTaken: number;
    skills: {
        [name: string]: EntitySkills;
    };
    hits: Hits;
}
interface Breakdown {
    timestamp: number;
    damage: number;
    targetEntity: string;
    isCrit: boolean;
    isBackAttack: boolean;
    isFrontAttack: boolean;
}
interface EntitySkills {
    id: number;
    name: string;
    totalDamage: number;
    maxDamage: number;
    hits: Hits;
    breakdown: Breakdown[];
}
interface Hits {
    casts: number;
    total: number;
    crit: number;
    backAttack: number;
    frontAttack: number;
    counter: number;
}
declare class LogParser extends EventEmitter {
    resetTimer: ReturnType<typeof setTimeout> | null;
    debugLines: boolean;
    isLive: boolean;
    dontResetOnZoneChange: boolean;
    resetAfterPhaseTransition: boolean;
    splitOnPhaseTransition: boolean;
    removeOverkillDamage: boolean;
    phaseTransitionResetRequest: boolean;
    phaseTransitionResetRequestTime: number;
    game: Game;
    encounters: Game[];
    healSources: HealSource[];
    constructor(isLive?: boolean);
    updateOrCreateLocalPlayer(newLocal: string): void;
    resetState(): void;
    softReset(): void;
    cancelReset(): void;
    splitEncounter(softReset?: boolean): void;
    broadcastStateChange(): void;
    parseLogLine(line: string): void;
    updateEntity(entityName: string, values: Record<string, unknown>): {
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
        healingDone: number;
        shieldDone: number;
        damageTaken: number;
        skills: {
            [name: string]: EntitySkills;
        };
        hits: Hits;
    };
    onMessage(lineSplit: string[]): void;
    onInitEnv(lineSplit: string[]): void;
    onPhaseTransition(lineSplit: string[]): void;
    onNewPc(lineSplit: string[]): void;
    onNewNpc(lineSplit: string[]): void;
    onDeath(lineSplit: string[]): void;
    onSkillStart(lineSplit: string[]): void;
    onSkillStage(lineSplit: string[]): void;
    onDamage(lineSplit: string[]): void;
    onHeal(lineSplit: string[]): void;
    onBuff(lineSplit: string[]): void;
    onCounterattack(lineSplit: string[]): void;
}

export { Breakdown, DamageStatistics, Entity, EntitySkills, Game, GameNew, HealSource, LogParser };
