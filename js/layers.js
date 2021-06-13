addLayer("a", {
    infoboxes: {
        0: {
            title: "故事线？",
            body() { return "你闲得发慌,所以决定去冒险.没有为什么." },
        },
    },
    name: "adventure", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires() {if(layers.a.gainMult().gte(1)) return new ExpantaNum(2);return new ExpantaNum(2.0000000001)}, // Can be a function that takes requirement increases into account
    resource: "冒险经验", // Name of prestige currency
    baseResource: "?", // Name of resource prestige is based on
    baseAmount() {return new ExpantaNum(2)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = player.points.add(1).pow(layers.a.gainExp())
	    mult = mult.mul(player.a.points.pow(0.25).add(1))
        mult = mult.sub(player.a.points)
        mult = mult.div(player.points.add(1).pow(layers.a.gainExp()))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new ExpantaNum(0.2)
        if(hasMilestone("a", 1)) exp=exp.add(0.1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: 冒险", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return !hasMilestone("e",0)},
    milestones: {
        0: {
            requirementDescription: "1exp",
            effectDescription: "你发现冒险需要一定的准备.你现在可以进行准备.",
            done() { return player.a.points.gte(1) }
        },
        1: {
            requirementDescription: "4exp",
            effectDescription: "你逐渐熟练起来.准备的效果提高.",
            done() { return player.a.points.gte(4) },
            unlocked(){return hasMilestone("a",0)}
        },
        2: {
            requirementDescription: "6exp",
            effectDescription: "你冒险中的经验告诉你准备什么最为关键.解锁一个可重复升级.",
            done() { return player.a.points.gte(6) },
            unlocked(){return hasMilestone("a",1)}
        },
        3: {
            requirementDescription: "10exp",
            effectDescription: "你发现了一个奇怪的大门.",
            done() { return player.a.points.gte(6) },
            unlocked(){return hasMilestone("a",2)}
        }
    },
    buyables: {
        11: {
            cost(x) { return OmegaNum(2).pow(x.pow(0.5)) },
            display() { return `花费一定经验来学习如何更好地准备.<br />+${buyableEffect("a",11)}(+1)准备效率.<br />费用:${format(OmegaNum(2).pow(getBuyableAmount("a",11).pow(0.5)))}exp` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return getBuyableAmount("a",11)
            },
            unlocked(){return hasMilestone("a",2)}
        },
        
    }
}
)


//探索!


addLayer("e", {
    infoboxes: {
        0: {
            title: "发现",
            body() { return "你发现了这道隐藏着的神秘大门-至少你认为现在的技术做不到造出这样一个大门.你发现你只能携带一定质量的物资进入,所以你根据你的经验选择了最重要的几样并进入了大门." },
        },
    },
    unlocked(){return hasMilestone("a",3)&&!hasMilestone("e",0)},
    name: "explore", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "yellow",
    requires: new ExpantaNum(1), // Can be a function that takes requirement increases into account
    resource: "探索准备", // Name of prestige currency
    baseResource: "exp", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: 开始探索", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    milestones: {
        0: {
            requirementDescription: "选择物资",
            effectDescription: "进入大门.",
            done() { return player.a.points.gt(0) }
        },
}
}
)

//物资使用...

addLayer("hp", {
    infoboxes: {
        0: {
            title: "危机",
            body() { return "在你进去的那一刻,你发现你出不去了.你知道这种超越现在技术的东西你是不可能破坏的,尝试后发现也是这样." },
        },
    },
    unlocked(){return hasMilestone("e",0)},
    name: "decay", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "res", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0.2),
    }},
    color: "red",
    requires: new ExpantaNum("10^^^10"), // Can be a function that takes requirement increases into account
    resource: "资源减少速度", // Name of prestige currency
    baseResource: "准备", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(-1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(0)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true}
})
addLayer("cave", {
    name: "cave", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Cave", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(player.points)
        mult = mult.pow(0.25)
        mult = mult.mul(player.a.points.pow(0.5).add(1)).sub(player.a.points)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(0)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true}
})
/*
addLayer("a", {
    name: "adventure", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(player.points)
        mult = mult.pow(0.25)
        mult = mult.mul(player.a.points.pow(0.5).add(1)).sub(player.a.points)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(0)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
*/