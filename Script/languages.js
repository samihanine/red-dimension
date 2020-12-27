var text = {}

function languages(lang){
  if (lang == 'fr') {
    text = {
      audio : 'Audio',
      music : 'Rendre muet la musique',
      son : "Rendre muet les sons du jeu",

      controle : "Contrôles",
      haut : "Haut",
      bas : "Bas",
      interagir : "Interagir",
      gauche : "Gauche",
      droite : "Droite",
      teleport : "Téléportation",

      langues : "Langues",
      fr : "Français",
      eng : "Anglais",

      option : "Option",
      jouer : "Jouer",

      moulin1 : "Entrez dans le moulin",
      moulin2 : "    avant de continuer.",

      entrer : 'Appuyez sur [entrée] pour intéragir.',
      tp : "TELEPORT",
      tpimpo : "Téléportation Impossible",
      continuer : "Continuer",
      nsort : "Nouveau Sort !",
      compris : "Compris !",

      sort1a : "Émet une flamme qui inflige des dégâts aux",
      sort1b : "ennemis qu'elle touche.",
      sort1c : "(pour lancer le sort, il vous suffit de cliquer dans",
      sort1d : "la direction que vous souhaitez viser.)",

      sort2a : "Invoque un double qui attaque les ennemis à",
      sort2b : "proximité du joueur.",
      sort2c : "Sa durée de vie est limitée, il disparaît au bout",
      sort2d : "d'un certain temps.",

      sort3a : "Regénère une partie des points de vie du",
      sort3b : "joueur.",
      sort3c : "Le sort ne peut pas être utilisé à l'intérieur",
      sort3d : "de la dimension rouge.",

      tombea : "Il s'agit d'une tombe sur laquelle est",
			tombeb : 'gravée :',
			tombec : 'Libitina, 532 - 556',

      pancarte : '        "Territoire des gobelins"',
      pancarte2 : "     N'appuyez pas sur le bouton.",

      tablea : "Il s'agit d'une feuille avec une unique",
      tableb : "phrase inscrite dessus :",
      tablec : ' "Que contient réellement la boîte ?"',

      tuto1a : "Pour changer de dimension, il te suffit d'appuyer sur [espace] ou de cliquer sur",
      tuto1b : "l'icône en haut à droite de l'écran.",
      tuto1c : "Téléporte-toi afin de passer la rivière et récupérer un maximum de pièces.",

      tuto2a : "Des interupteurs interdimensionnels sont présents sur cette map.",
      tuto2b : "Les actionner aura un impact sur l'autre dimension.",
      tuto2c : "Utilise-les pour accéder au moulin.",

      tuto3a : "Utilise ton nouveau sort en cliquant sur son icône en bas à gauche.",
      tuto3b : "N'oublie pas que tu peux te téléporter pour échapper aux ennemis.",
      tuto3c : "Et fais attention à ne pas te brûler avec le feu !",

      suivant : "Suivant",
      passer : "Passer",

      i1 : "Il existe une légende selon laquelle une boîte serait cachée quelque part...",
      i2 : "Cette boîte pourrait réaliser n'importe quel voeu, quel qu’il soit,",
      i3 : "sans aucune règle ou limite.",
      i4 : "Cependant voilà des siècles que les humains ne cessent de la chercher",
      i4b : "sans aucun résultat.",
      i5 : "Alors les hommes demandèrent aux dieux de leur apporter une aide pour la trouver.",
      i6 : "Les dieux pleins de clémence acceptèrent.",
      i7 : "Tous les 100 ans, un nouveau-né naîtra avec le pouvoir de voyager ",
      i8 : "entre les dimensions.",
      i9 : "Cette capacité devrait donner une chance à l'humanité de mettre la main",
      i10 : "sur la mystérieuse boîte.",

      e1 : "Ce jeu est une démo, l'objectif principal de celle-ci est d'illustrer une idée de gameplay.",
      e2 : "Il est donc probable que cette démo n'ai jamais de suite.",
      e3 : "Les musiques et sons utilisés proviennent de bibliothèques libres de droit.",
      e4 : "Une partie des images utilisées ont été récupérées à divers endroits sur internet, elles ne m'appartiennent pas.",
      e5 : "Si vous avez des suggestions concernant le jeu ou que vous rencontrez des bugs critiques,",
      e6 : "vous êtes libre de me contacter via twitter.",
      e7 : "Jouez à mon dernier jeu !",
      e8 : "(il est toutefois possible que je fasse un jeu complet reprenant le même concept sous Unity)",
      e10 : "Merci d'avoir joué !"
    }

  } else {
    text = {
      audio : 'Audio',
      music : 'Mute the music',
      son : "Mute game sounds",

      controle : "Controls",
      haut : "Up",
      bas : "Down",
      interagir : "Interact",
      gauche : "Left",
      droite : "Right",
      teleport : "Teleportation",

      langues : "Languages",
      fr : "French",
      eng : "English",

      option : "Option",
      jouer : "Play",

      moulin1 : "   Enter into the mill",
      moulin2 : "    before continuing.",

      entrer : 'Press [enter] to interact.',
      tp : "TELEPORT",
      tpimpo : "Teleport Impossible",
      continuer : "Continue",
      nsort : "New Spell !",
      compris : "Understood !",

      sort1a : "Emits a flame that deals damage to enemies",
      sort1b : "it touches.",
      sort1c : "to cast the spell, just click in on which",
      sort1d : "direction you want to aim.)",

      sort2a : "Summons a double that attacks enemies at",
      sort2b : "proximity to the player.",
      sort2c : "Its lifespan is limited, it disappears at the end",
      sort2d : "of a certain time.",

      sort3a : "Regenerates part of the life points of the",
      sort3b : "player.",
      sort3c : "The spell cannot be used inside",
      sort3d : "the red dimension.",

      tombea : "It's a tomb on which is engraved:",
			tombeb : '',
			tombec : 'Libitina, 532 - 556',

      pancarte : '          "Goblin Territory"',
      pancarte2 : "        Do not press the button.",
      tablea : "It is a sheet with a single sentence",
      tableb : "written on it:",
      tablec : '"What is in the box?" ',

      tuto1a : "To change dimension, just press [space] or click on the icon",
      tuto1b : "at the top right of the screen.",
      tuto1c : "Teleport yourself to cross the river and collect as many coins as possible.",

      tuto2a : "Interdimensional switches are present on this place.",
      tuto2b : "Activating them will have an impact on the other dimension.",
      tuto2c : "Use them to access the mill.",

      tuto3a: "Use your new spell by clicking on its icon at the bottom left.",
      tuto3b: "Remember that you can teleport to escape enemies.",
      tuto3c: "And be careful not to burn yourself with fire!",

      suivant : "Next",
      passer : "Skip",

      i1 : "There is a legend that says a box is hidden somewhere ...",
      i2 : "This box could make any wish come true, whatever it may be,",
      i3 : "without any rules or limits.",
      i4 : "However, humans have been looking for it for centuries",
      i4b : "with no result.",
      i5 : "So men asked the gods to help them find it.",
      i6 : "The gods full of mercy accepted.",
      i7 : "Every 100 years, a newborn baby is gifted with the power to travel ",
      i8 : "between dimensions.",
      i9 : "This ability should give humanity a chance to find",
      i10 : "the mysterious box.",

      e1: "This game is a demo, the main purpose of it is to illustrate a gameplay idea.",
      e2: "So it's possible that this demo will never have a sequel.",
      e3: "The music and sounds used come from copyright free libraries.",
      e4: "Some of the images used were collected from various places on the internet, they do not belong to me.",
      e5: "If you have any suggestions regarding the game or if you encounter critical bugs,",
      e6: "you are free to contact me via twitter.",
      e7: "Play my last game!",
      e8: "(it is however possible that I make a complete game using the same concept under Unity)",

      e10 : "Thanks for playing!"
    }
  }

}
