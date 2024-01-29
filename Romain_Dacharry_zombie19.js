// arbre des potentiels infectés

let tree = {
    name: "Yohan",
    isImmune: false,
    canInfect: true,
    isDead: false,
    age: 48,
    variants: ["Zombie-A"],
    children: [
        {
            name: "Dylan",
            isImmune: false,
            canInfect: true,
            isDead: false,
            age: 25,
            variants: [],
            children: [
                {
                    name: "Clement",
                    isImmune: false,
                    canInfect: true,
                    isDead: false,
                    age: 22,
                    variants: [],
                    children: [
                        {
                            name: "Christobinks",
                            isImmune: false,
                            canInfect: true,
                            isDead: false,
                            age: 33,
                            variants: ["Zombie-B"],
                            children: []
                        }
                    ]
                },
                {
                    name: "Kik's",
                    isImmune: false,
                    canInfect: true,
                    isDead: false,
                    age: 45,
                    variants: [],
                    children: []
                }
            ]
        },
        {
            name: "Antoine",
            isImmune: false,
            canInfect: true,
            isDead: false,
            age: 32,
            variants: ["Zombie-C"],
            children: [
                {
                    name: "Zora",
                    isImmune: false,
                    canInfect: true,
                    isDead: false,
                    age: 24,
                    variants: ["Zombie-32"],
                    children: []
                },
                {
                    name: "Pierre",
                    isImmune: false,
                    canInfect: true,
                    isDead: false,
                    age: 26,
                    variants: [],
                    children: [
                        {
                            name: "Charlotte",
                            isImmune: false,
                            canInfect: true,
                            isDead: false,
                            age: 24,
                            variants: ["Zombie-Ultime"],
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
};

function mapParentInChildren(person, parent) {
    person.children.forEach((children) => mapParentInChildren(children, person));
    person.parent = parent;
    return person;
}
function removeParentInChildren(person) {
    person.children.forEach((children) => removeParentInChildren(children));
    delete person.parent;
    return person;
}
tree = mapParentInChildren(tree, null);

// Condition pour savoir si une personne peut être infecté
function canBeInfected(person, variant, conditionFn = () => true) {
    return person.canInfect === true &&
        person.isImmune === false &&
        person.isDead === false &&
        person.variants.includes(variant) === false &&
        conditionFn(person);
}

// Infection du haut vers le bas + cond non-obligatoire
function infectToptoBottom(person, variant, conditionFn) {
    if (canBeInfected(person, variant, conditionFn)) {
        console.log(`${person.name} a été infecté par ${variant}`);
        person.variants.push(variant);
    }

    person.children.forEach((children) => infectToptoBottom(children, variant, conditionFn));
}

// Infection du bas vers le haut + cond non-obligatoire
function infectBottomToTop(person, variant, conditionFn) {
    if (canBeInfected(person, variant, conditionFn)) {
        console.log(`${person.name} a été infecté par le virus ${variant}`);
        person.variants.push(variant);
    }

    if (person.parent !== null) {
        infectBottomToTop(person.parent, variant, conditionFn);
    }
}

// Processus d'infection de l'arbre
function infect(person) {
    person.variants.forEach((variant) => {
        switch (variant) {
            // Zombie-A
            case 'Zombie-A':
                infectToptoBottom(person, 'Zombie-A');
                break;
            // Zombie-B
            case 'Zombie-B':
                infectBottomToTop(person, 'Zombie-B');
                break;
            // Zombie-32
            case 'Zombie-32':
                infectToptoBottom(person, 'Zombie-32', (person) => person.age >= 32);
                infectBottomToTop(person, 'Zombie-32', (person) => person.age >= 32);
                break;
            // Zombie-C
            case 'Zombie-C':
                infectToptoBottom(person, 'Zombie-C', (person, index) => index % 2 !== 0);
                infectBottomToTop(person, 'Zombie-C', (person, index) => index % 2 !== 0);
                break;
            // Zombie-Ultime
            case 'Zombie-Ultime':
                infectBottomToTop(person, 'Zombie-Ultime', (person) => person.parent === null);
                break;
        }
    });

    person.children.map((children) => infect(children));
}


// Vaccin-A.1 contre Zombie-A et Zombie-32 : Pas efficace, nul si age > 30, immunise
function a1Vaccine(person) {
    if ((person.variants.includes('Zombie-A') || person.variants.includes('Zombie-32'))) {
        if (person.age <= 30) {
            console.log(`${person.name} (${person.age} ans) a été vacciné et est immunisé contre tous les variants.`);
            person.variants = [];
            person.isImmune = true;
        } else {
            console.log(`${person.name} (${person.age} ans) est trop vieux, le vaccin est inefficace.`);
        }
    }
    person.children.map((children) => a1Vaccine(children));
}

// Vaccin-B.1 contre Zombie-B et Zombie-C : 50% de chance de tuer lol
function b1Vaccine(person) {
    if ((person.variants.includes('Zombie-B') || person.variants.includes('Zombie-C'))) {
        if (Math.random() < 0.5) {
            console.log(`${person.name} a été vacciné et n'est plus infecté par le virus Zombie-B et Zombie-C.`);
            person.variants = person.variants.filter((variant) => variant !== 'Zombie-B' && variant !== 'Zombie-C');
        } else {
            console.log(`${person.name} a été tué par le vaccin.`);
            person.isDead = true;
        }
        indexOfDeath++;
    }
    person.children.map(children => b1Vaccine(children));
}

// Vaccin-Ultime contre Zombie-Ultime : Parfait mais que parent 0
function ultimateVaccine(person) {
    if (person.variants.includes('Zombie-Ultime')) {
        console.log(`${person.name} a été vacciné et ne pourra plus jamais être infecté et infecter les autres.`);
        person.variants = person.variants = [];
        person.isImmune = true;
        person.canInfect = false;
    }
    person.children.map((children) => ultimateVaccine(children));
}

// début de l'alerte
console.log('----------------------------------------')
console.log(`Alerte ! Yohan a mangé de la viande d'un cadavre (le con)`);
console.log('----------------------------------------')
infect(tree);

console.log('----------------------------------------')
console.log('Déploiement du vaccin A1...');
a1Vaccine(tree);

console.log('----------------------------------------')
console.log('Déploiement du vaccin B1...');
let indexOfDeath = 0;
b1Vaccine(tree);

console.log('----------------------------------------')
console.log('Déploiement du vaccin Ultime...');
ultimateVaccine(tree);

// Résultat final

tree = removeParentInChildren(tree);
console.dir(tree, { depth: null });
