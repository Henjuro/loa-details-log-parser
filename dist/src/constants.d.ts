interface HealingSkills {
    [key: string]: HealingSkillDetails;
}
interface HealingSkillDetails {
    duration: number;
}
export declare const healingSkills: HealingSkills;
export declare enum HitFlag {
    HIT_FLAG_NORMAL = 0,
    HIT_FLAG_CRITICAL = 1,
    HIT_FLAG_MISS = 2,
    HIT_FLAG_INVINCIBLE = 3,
    HIT_FLAG_DOT = 4,
    HIT_FLAG_IMMUNE = 5,
    HIT_FLAG_IMMUNE_SILENCED = 6,
    HIT_FLAG_FONT_SILENCED = 7,
    HIT_FLAG_DOT_CRITICAL = 8,
    HIT_FLAG_DODGE = 9,
    HIT_FLAG_REFLECT = 10,
    HIT_FLAG_DAMAGE_SHARE = 11,
    HIT_FLAG_DODGE_HIT = 12,
    HIT_FLAG_MAX = 13,
    HIT_OPTION_BACK_ATTACK = 16,
    HIT_OPTION_FRONTAL_ATTACK = 32,
    HIT_OPTION_FLANK_ATTACK = 64
}
export {};
