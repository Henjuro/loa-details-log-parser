function i(i,n){i.prototype=Object.create(n.prototype),i.prototype.constructor=i,t(i,n)}function t(i,n){return t=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(i,t){return i.__proto__=t,i},t(i,n)}function n(i,t){if(void 0===t&&(t=0),"number"==typeof i)return isNaN(i)?t:i;var n;try{n=parseInt(i),isNaN(n)&&(n=t)}catch(i){n=t}return n}var o=function(i){this.lineSplit=void 0,this.timestamp=void 0,this.lineSplit=i,this.timestamp=new Date(this.lineSplit[1])},e=/*#__PURE__*/function(t){function n(i){var n;return(n=t.call(this,i)||this).message=void 0,n.message=n.lineSplit[2],n}return i(n,t),n}(o),r=/*#__PURE__*/function(t){function n(i){var n;return(n=t.call(this,i)||this).playerId=void 0,n.playerId=i[2],n}return i(n,t),n}(o),a=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).phaseCode=void 0,o.phaseCode=n(i[2]),o}return i(o,t),o}(o),d=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.classId=void 0,o.class=void 0,o.gearScore=void 0,o.currentHp=void 0,o.maxHp=void 0,o.id=i[2],o.name=i[3]||"Unknown Entity",o.classId=n(i[4]),o.class=i[5]||"UnknownClass",o.gearScore=i[7],o.currentHp=n(i[8]),o.maxHp=n(i[9]),o}return i(o,t),o}(o),s=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.currentHp=void 0,o.maxHp=void 0,o.id=i[2],o.name=i[4]||"Unknown Entity",o.currentHp=n(i[5]),o.maxHp=n(i[6]),o}return i(o,t),o}(o),l=/*#__PURE__*/function(t){function n(i){var n;return(n=t.call(this,i)||this).id=void 0,n.name=void 0,n.killerId=void 0,n.killerName=void 0,n.id=i[2],n.name=i[3]||"Unknown Entity",n.killerId=i[4],n.killerName=i[5]||"Unknown Entity",n}return i(n,t),n}(o),u=/*#__PURE__*/function(t){function n(i){var n;return(n=t.call(this,i)||this).id=void 0,n.name=void 0,n.skillId=void 0,n.skillName=void 0,n.id=i[2],n.name=i[3]||"Unknown Entity",n.skillId=i[4],n.skillName=i[5]||"Unknown Skill",n}return i(n,t),n}(o),c=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.skillId=void 0,o.skillName=void 0,o.skillStage=void 0,o.id=i[2],o.name=i[3]||"Unknown Entity",o.skillId=i[4],o.skillName=i[5]||"Unknown Skill",o.skillStage=n(i[6]),o}return i(o,t),o}(o),v=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.skillId=void 0,o.skillName=void 0,o.skillEffectId=void 0,o.skillEffect=void 0,o.targetId=void 0,o.targetName=void 0,o.damage=void 0,o.damageModifier=void 0,o.isCrit=void 0,o.isBackAttack=void 0,o.isFrontAttack=void 0,o.currentHp=void 0,o.maxHp=void 0,o.id=i[2],o.name=i[3]||"Unknown Entity",o.skillId=n(i[4]),o.skillName=i[5]||"Unknown Skill",o.skillEffectId=n(i[6]),o.skillEffect=i[7],o.targetId=i[8],o.targetName=i[9]||"Unknown Entity",o.damage=n(i[10]),o.damageModifier="1"==i[11],o.isCrit="1"==i[12],o.isBackAttack="1"==i[13],o.isFrontAttack="1"==i[14],o.currentHp=n(i[15]),o.maxHp=n(i[16]),o}return i(o,t),o}(o),m=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.healAmount=void 0,o.id=i[2],o.name=i[3]||"Unknown Entity",o.healAmount=n(i[4]),o}return i(o,t),o}(o),f=/*#__PURE__*/function(t){function o(i){var o;return(o=t.call(this,i)||this).id=void 0,o.name=void 0,o.buffId=void 0,o.buffName=void 0,o.isNew=void 0,o.sourceId=void 0,o.sourceName=void 0,o.shieldAmount=void 0,o.id=i[2],o.name=i[3]||"Unknown Entity",o.buffId=i[4],o.buffName=i[5],o.isNew="1"==i[6],o.sourceId=i[7],o.sourceName=i[8]||"Unknown Entity",o.shieldAmount=n(i[9]),o}return i(o,t),o}(o),k=/*#__PURE__*/function(t){function n(i){var n;return(n=t.call(this,i)||this).id=void 0,n.name=void 0,n.id=i[2],n.name=i[3]||"Unknown Entity",n}return i(n,t),n}(o);exports.LogBuff=f,exports.LogCounterattack=k,exports.LogDamage=v,exports.LogDeath=l,exports.LogHeal=m,exports.LogInitEnv=r,exports.LogMessage=e,exports.LogNewNpc=s,exports.LogNewPc=d,exports.LogPhaseTransition=a,exports.LogSkillStage=c,exports.LogSkillStart=u;
//# sourceMappingURL=log-lines.js.map