import type { Story } from "@/lib/refugio/stories";

export const ticketEn: Story = {
  slug: "o-bilhete",
  title: "The note on the last shelf",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mystery", "slow burn"],
  minutes: 12,
  synopsis: "After closing, a book with no card waits on the desk. The note inside does not ask to be read. It asks not to be returned.",
  place: "Old library",
  start: "mesa",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "mesa",
      music: "calma",
      body: "Rain leans on the glass. The last reader has gone, and the library keeps only the smell of wet paper from someone who came in off the street. On the return desk there is a novel with no card. Inside, a narrow note, written in a steady hand: “Do not return this book. If you want to know why, the last shelf is still lit.”",
      choices: [
        { id: "abrir", label: "Open the book before you leave", to: "corredor", affinity: 1, clue: "The note asks that the book not be returned." },
        { id: "ir", label: "Go straight to the last shelf", to: "helena", affinity: 1, clue: "Someone left the last shelf lit on purpose." },
        { id: "apagar", label: "Leave the note and turn off the light", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "corredor",
      speaker: "You",
      body: "The first page holds a dried flower, thin as tissue. In the margin, a name almost gone: Helena. It is not a dedication. It looks like a warning someone was afraid to finish.",
      choices: [
        { id: "guardar", label: "Slip the flower into your pocket", to: "helena", affinity: 1, clue: "A dried flower marks the name Helena." },
        { id: "chamar", label: "Call for Helena, quietly", to: "helena", affinity: 2 },
      ],
    },
    {
      id: "helena",
      music: "romance",
      speaker: "Helena",
      body: "She is on her knees among the large volumes, the lamp cutting only her face. Hair pinned up any way it would stay, hands stained with restoration glue. She is not startled. “You didn’t return it,” she says, and it sounds less like a question than relief. “This book is not the library’s. It’s mine. I left it for whoever could break the rule.”",
      choices: [
        { id: "porque", label: "Ask why it had to be you", to: "margem", affinity: 1 },
        { id: "medo", label: "Say this feels like a trap", to: "margem", affinity: 0 },
        { id: "devolver", label: "Hold the book out to her", to: "fim-espera", affinity: -1 },
      ],
    },
    {
      id: "margem",
      music: "suspense",
      speaker: "Helena",
      body: "“Because the person who wrote with me in this book left without saying goodbye. The name in the margin was how she said she would come back. It’s been a year. I stay after hours so that if she walks in, someone is still here. Tonight you got here first.” The rain thickens. Helena looks at your mouth and then away, like someone correcting herself.",
      choices: [
        { id: "ficar", label: "Say you’ll stay until the rain passes", to: "porta", affinity: 2 },
        { id: "nome", label: "Ask the name of the one who vanished", to: "porta", affinity: 1, clue: "Someone wrote with Helena and left without saying goodbye." },
        { id: "ir", label: "Say it is already too late for this story", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Helena",
      body: "The two of you stand at the back door. The city is only a wet shine. Helena holds the book to her chest. “If you leave with me, I’ll tell you the rest on the way. If you stay, I’ll leave the book on your desk tomorrow, and we pretend this night didn’t happen. Both are honest. They just aren’t the same.”",
      choices: [
        { id: "sair", label: "Walk out with her into the rain", to: "fim-chuva", affinity: 2 },
        { id: "amanha", label: "Ask for the book tomorrow, with no hurry", to: "fim-espera", affinity: 1 },
        { id: "fechar", label: "Lock the door and leave alone", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "fim-chuva",
      music: "revelacao",
      ending: {
        key: "chuva",
        title: "The rain does not give it back",
        flower: "Night jasmine",
        body: "Helena opens an umbrella too small for two. You laugh at that and walk close anyway. Halfway down the block she says the other woman’s name, low, and then yours, as if trading one secret for another. The kiss is brief, from someone who still has a story to tell. The book stays between you, dry, while the city wets everything else.",
      },
    },
    {
      id: "fim-espera",
      ending: {
        key: "espera",
        title: "Tomorrow, on the same desk",
        flower: "Camellia",
        body: "You return the book, but not the flower. Helena understands. “Tomorrow,” she says, and it does not sound like an excuse. In the morning the novel is on the desk, with a new note: “I’m still here. If you want, the last shelf lights up again.” The night does not close. It only changes its hour.",
      },
    },
    {
      id: "fim-fechado",
      music: "despedida",
      ending: {
        key: "fechado",
        title: "The light that goes out",
        flower: "Dry leaf",
        body: "The library becomes only a room again. You leave the book where you found it, or you never ask who wrote it. Outside, the rain goes on without a witness. Somewhere on the last shelf, a light waits a little longer and then gives up. Not every secret wants to be found on the first night.",
      },
    },
  ],
};

export const cafeEn: Story = {
  slug: "a-chave",
  title: "The café key",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mystery"],
  minutes: 10,
  synopsis: "The café is already closed. The rain will not let you leave. The key on the counter is not yours, and neither is the woman looking for it.",
  place: "Café in the rain",
  start: "balcao",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "balcao",
      body: "The chairs are already up on the tables. You stayed for the last coffee and the rain locked the street. On the counter, a small drawer key with a red thread. The back door opens. A woman comes in, coat soaked, hair stuck to her cheek. “If you took the key, give it back. If you didn’t, forget you saw it.”",
      choices: [
        { id: "devolver", label: "Say the key was already here", to: "gaveta", affinity: 1, clue: "The red-thread key opens a drawer, not the door." },
        { id: "quem", label: "Ask her name before anything else", to: "nome", affinity: 1 },
        { id: "sair", label: "Walk out into the rain anyway", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "nome",
      speaker: "Lia",
      body: "“Lia.” She does not offer her hand. She looks at the key the way someone looks at a person. “I closed the café early because I didn’t want a witness. Then I forgot this. The witness, now, is you.”",
      choices: [
        { id: "ficar", label: "Say you’ll stay, if she tells you", to: "gaveta", affinity: 2 },
        { id: "medo", label: "Say this is too large for a key", to: "gaveta", affinity: 0 },
      ],
    },
    {
      id: "gaveta",
      speaker: "Lia",
      body: "The lower drawer opens with a click. Inside, a photo of two women in a small boat and a paper: “If she comes back, don’t say I waited.” Lia touches the other face. “She came back this morning. She ordered the usual coffee and didn’t recognize me. Or she pretended not to.”",
      choices: [
        { id: "verdade", label: "Ask if Lia wants to be recognized", to: "porta", affinity: 2, clue: "The other woman came back today and did not recognize Lia." },
        { id: "foto", label: "Ask who took the photo", to: "porta", affinity: 1 },
        { id: "fechar", label: "Shut the drawer and say it is not your business", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Lia",
      body: "The rain eases a little. Lia turns the key on her finger. “I can go after her now and ruin both their nights. I can leave the note where it is and open the café tomorrow as if nothing happened. Or you cross the street with me and we only look, without calling out.”",
      choices: [
        { id: "olhar", label: "Cross the street with her, without calling", to: "fim-rua-junta", affinity: 2 },
        { id: "amanha", label: "Talk Lia into opening the café tomorrow", to: "fim-amanha", affinity: 1 },
        { id: "ir", label: "Say each of you goes your own way", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "fim-rua-junta",
      ending: {
        key: "junto",
        title: "The street with no call",
        flower: "Gardenia",
        body: "You cross without an umbrella. On the other side, the other woman gets into a taxi and does not look back. Lia does not run. She leans her shoulder against yours, quickly, like a thank-you that does not know its name yet. The key stays in your hand. “Tomorrow you give it back,” she says. “Or you come for coffee. Either one will do.”",
      },
    },
    {
      id: "fim-amanha",
      ending: {
        key: "amanha",
        title: "The usual coffee",
        flower: "Coffee blossom",
        body: "Lia puts the photo away and leaves the note. “Tomorrow I open on time.” It is not surrender. It is a way to keep existing in the place the other person knows how to find, if she ever wants to. You leave in a finer rain. At the window table, two cups are already turned down, waiting.",
      },
    },
    {
      id: "fim-rua",
      ending: {
        key: "sozinha",
        title: "Key in the rain",
        flower: "Wet petal",
        body: "The street swallows the conversation. Lia closes the drawer, or you never get to see it. The key, if it stayed behind, is no longer an invitation. It is only metal. Some nights you cross alone and the story stays whole on the other side of the counter.",
      },
    },
  ],
};

export const tideEn: Story = {
  slug: "a-mare",
  title: "The tide and the name",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mystery"],
  minutes: 9,
  synopsis: "On the beach at night, a woman tries to rewrite a name before the water erases it. She does not say whether the name is hers.",
  place: "Night beach",
  start: "areia",
  sound: "/sounds/ocean.mp3",
  scenes: [
    {
      id: "areia",
      body: "The city stays behind, only a rumor. On the wet sand, letters half finished. A woman kneels, the hem of her trousers dark with water, starting again a name the tide is eating. She notices you and does not cover what she wrote. “If you come closer, you’ll read it. If you stay there, you can pretend it’s a drawing.”",
      choices: [
        { id: "perto", label: "Step closer and read", to: "nome", affinity: 1, clue: "The name in the sand is only half there. The tide is eating the rest." },
        { id: "ajudar", label: "Offer to hold the light", to: "luz", affinity: 2 },
        { id: "voltar", label: "Go back to the sidewalk", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "luz",
      speaker: "Nara",
      body: "“Nara.” The light is a phone, weak. “It isn’t my name I’m writing. It’s hers. We fought on this same spot last week, and I said something water doesn’t wash off. If the name disappears completely, it looks like I accepted that.”",
      choices: [
        { id: "ouvir", label: "Ask to hear the sentence, without judging", to: "frase", affinity: 2 },
        { id: "escrever", label: "Kneel and help her write it again", to: "frase", affinity: 1, clue: "Nara is writing another woman’s name, not her own." },
      ],
    },
    {
      id: "nome",
      speaker: "Nara",
      body: "All you can read is “—lia.” Nara covers the rest with her hand, too late. “Now you know too much and too little.” She sits back on her heels. “The name is hers. I’m Nara. And I don’t know if I want her to see this in the morning.”",
      choices: [
        { id: "ouvir", label: "Stay and listen", to: "frase", affinity: 1 },
        { id: "apagar", label: "Say the tide can finish the work", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "frase",
      speaker: "Nara",
      body: "“I said loving her was a phase.” Nara laughs without humor. “It wasn’t. The tide comes in a straight line. I can let the name go, apologize out loud to no one, or walk with you up to the street and send the message I’ve been avoiding since Friday.”",
      choices: [
        { id: "mensagem", label: "Walk with her until there’s a signal", to: "fim-rua", affinity: 2 },
        { id: "mar", label: "Stay until the water takes the name, beside her", to: "fim-junto", affinity: 1 },
        { id: "ir", label: "Say sand cannot fix that sentence", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "fim-rua",
      ending: {
        key: "mensagem",
        title: "Where the signal comes back",
        flower: "Morning glory",
        body: "You climb the street still with sand in your shoes. Nara stops under a lamp, writes, deletes, writes again. She does not show the screen. When she sends it, her shoulder leans into yours and stays. “If she answers, I’ll tell you. If she doesn’t, you’ve already seen the name. That is an answer too.”",
      },
    },
    {
      id: "fim-junto",
      ending: {
        key: "mare",
        title: "The tide finishes the sentence",
        flower: "Sand lily",
        body: "The two of you sit until the water undoes the letters. Nara does not chase the name. She rests her forehead on her knee and, a minute later, on your shoulder. It is not forgiveness. It is a night when someone stayed to the end of the sentence, even without being able to rewrite the one before.",
      },
    },
    {
      id: "fim-mar",
      ending: {
        key: "sozinha",
        title: "The sidewalk",
        flower: "Empty shell",
        body: "The beach goes on with the work alone. You walk back to the streetlight, and the name, whole or half, stays with the water. Nara stays too, or vanishes when you look away. Some apologies do not fit a story about someone who was only passing through.",
      },
    },
  ],
};

export const lampEn: Story = {
  slug: "a-lampada",
  title: "The lamp that should not be on",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mystery"],
  minutes: 8,
  synopsis: "After the garden closes, one lamp stays lit in the courtyard. Whoever turned it on asked not to be called by the old name.",
  place: "Sand temple",
  art: "/scenes/templo.jpg",
  start: "patio",
  access: "cheia",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "patio",
      music: "templo",
      body: "The side gate is only pushed to. Inside, the courtyard smells of wet jasmine and stone still warm from the day. Every lamp should be off. One is not. Under it, a pale scarf, folded, and a note: “If it is her, don’t call me by the old name.”",
      choices: [
        { id: "ler", label: "Read the note again", to: "sombra", affinity: 1, clue: "The note asks you not to use the old name." },
        { id: "chamar", label: "Call softly, with no name", to: "sombra", affinity: 2 },
        { id: "ir", label: "Leave and let the lamp stay on", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "sombra",
      music: "luar",
      speaker: "Mali",
      body: "Mali stands barefoot at the edge of the shallow water. Her hair is tied with the same scarf you thought was on the ground. She does not turn at once. “I put that lamp out every night. Someone lights it again. For a year I thought it was the wind.”",
      choices: [
        { id: "quem", label: "Ask who she is waiting for", to: "nome", affinity: 1, clue: "For a year the lamp has been lighting itself." },
        { id: "ficar", label: "Say you can wait with her", to: "nome", affinity: 2 },
        { id: "medo", label: "Say this sounds like a letter for someone else", to: "fim-nome", affinity: 0 },
      ],
    },
    {
      id: "nome",
      speaker: "Mali",
      body: "“Her name was Areum, and I haven’t said it aloud since she left for a job that didn’t fit in this courtyard. Yesterday the scarf came back. I don’t know if it’s her. I know you stayed, and that is already more than the lamp does.”",
      choices: [
        { id: "esperar", label: "Stay until the lamp goes out", to: "fim-lampada", affinity: 2 },
        { id: "verdade", label: "Ask what Mali wants, if it is Areum", to: "fim-nome", affinity: 1, clue: "Areum left for work far from the courtyard." },
        { id: "embora", label: "Say an old name is not something you return", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "fim-lampada",
      music: "luar",
      ending: {
        key: "lampada",
        title: "The lamp accepts company",
        flower: "Lotus",
        body: "Mali lets you light the second lamp, the small one, the one that was never a ritual. You sit on the step. When the first one goes out on its own, she laughs low, almost a startle. “Then it wasn’t the wind.” Her shoulder rests against yours. It is not a goodbye and it is not a rush. It is the night agreeing to stay a little larger.",
      },
    },
    {
      id: "fim-nome",
      ending: {
        key: "nome",
        title: "The name that comes back slowly",
        flower: "Gardenia",
        body: "You do not promise to find Areum. Mali does not ask. She folds the scarf and puts it in your hand. “If she comes, give it back. If she doesn’t, stay with me until I learn another way to put out the light.” At the gate the kiss is short, from someone who is still careful. The lamp stays on behind you, but it no longer looks like a summons. It looks like a house.",
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "The gate left ajar",
        flower: "Smooth stone",
        body: "You leave before you know the name. The lamp stays behind, faithful to someone who may not return tonight. The courtyard does not run after you. Some waits belong to one person, and forcing the door would be another way of not listening.",
      },
    },
  ],
};

export const moonEn: Story = {
  slug: "antes-da-lua",
  title: "A day before the moon",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance"],
  minutes: 6,
  synopsis: "The full moon is tomorrow. The note under the door arrived today, in the handwriting of a woman who said she would only come back when the moon was whole.",
  place: "Balcony",
  art: "/scenes/varanda.jpg",
  start: "porta",
  access: "antecipada",
  opensOn: "2026-11-05",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "porta",
      music: "calma",
      body: "The building is quiet. Under the door, a paper folded in four. “Don’t wait for the moon. I got the day wrong, or the moon did. I’m on the third-floor balcony, if you still want the conversation we never had.”",
      choices: [
        { id: "subir", label: "Go up now", to: "varanda", affinity: 2, clue: "The note arrived a day before the full moon." },
        { id: "esperar", label: "Wait for the real moon", to: "fim-tarde", affinity: 0 },
        { id: "guardar", label: "Keep the note and not answer", to: "fim-gaveta", affinity: -1 },
      ],
    },
    {
      id: "varanda",
      music: "luar",
      speaker: "Nima",
      body: "Nima is sitting on the balcony floor, her back to the rail, a mug in both hands. “I said full moon because I was afraid of arriving too early. Then I arrived early anyway.” The city below is only lit windows.",
      choices: [
        { id: "cedo", label: "Say that early, tonight, is right", to: "fim-cedo", affinity: 2 },
        { id: "medo", label: "Ask what she was afraid of", to: "fim-cedo", affinity: 1, clue: "Nima came back early because she was afraid of arriving late." },
        { id: "descer", label: "Say the conversation was for tomorrow", to: "fim-tarde", affinity: -1 },
      ],
    },
    {
      id: "fim-cedo",
      music: "luar",
      ending: {
        key: "cedo",
        title: "The moon is not offended",
        flower: "Jasmine",
        body: "Nima makes room on the floor. You watch a sky that is not whole yet. “Tomorrow the moon comes,” she says, “and I’m already here.” The kiss tastes of cold tea. Neither of you gets up to leave. The missing conversation fits before the date.",
      },
    },
    {
      id: "fim-tarde",
      ending: {
        key: "tarde",
        title: "Tomorrow, as promised",
        flower: "White camellia",
        body: "You don’t go up, or you go up and come back down. Nima accepts it. “Then tomorrow,” she says, and this time it doesn’t sound like fear. In the morning the note is no longer under the door. In its place, a grain of sweet rice wrapped in paper: “The moon can arrive on time. So can I.”",
      },
    },
    {
      id: "fim-gaveta",
      music: "despedida",
      ending: {
        key: "gaveta",
        title: "The paper in the drawer",
        flower: "Leaf",
        body: "The note stays shut with things you are not ready to answer. Tomorrow the moon will be whole just the same. Not every call has to be answered the night it arrives. Some only need to be kept, unopened and unharmed.",
      },
    },
  ],
};
