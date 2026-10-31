import { cartasEn } from "@/lib/refugio/stories-cartas";
import { passageiraEn } from "@/lib/refugio/stories-passageira";
import type { Story } from "@/lib/refugio/stories";

const corredorEn: Story = {
  slug: "corredor",
  title: "The Corridor",
  author: "Luana Viana",
  rating: "16",
  genres: ["horror", "psychological drama"],
  minutes: 11,
  synopsis: "The hotel corridor is longer on the way back. The woman from 714 asks you to walk her to the elevator. If you hear her voice behind you, don’t turn. The one behind asks to come in. She doesn’t.",
  place: "Hotel",
  art: "/scenes/templo.jpg",
  start: "porta714",
  sound: "/sounds/wind.mp3",
  scenes: [
    {
      id: "porta714",
      speaker: "Iara",
      music: "templo",
      body: "The hotel pretends at silence with a hum of air. It is twenty minutes to three, the hour when the corridor belongs to people who don’t sleep. Iara stands in the doorway of 714, barefoot, hair tied any way it would stay, the eyes of someone who has already explained this and was not believed. You have seen her at breakfast three times. She doesn’t eat. She watches your table the way you check an exit. “Walk me to the elevator. If you hear my voice behind you, don’t turn. The one behind asks to come in. I don’t. I only want to get down to where the light is ugly and she doesn’t cross.” The number on the door, behind her, seems to have stepped back half a hand.",
      choices: [
        { id: "braco", label: "Offer her your arm", to: "corredor", affinity: 2, clue: "Iara does not ask to come in. The other one does.", thought: "An arm is a concrete thing. I offer concrete." },
        { id: "perguntar", label: "Ask what stays behind", to: "corredor", affinity: 1, thought: "I want the whole rule before I walk inside it." },
        { id: "fechar", label: "Close your door", to: "fim-batida", affinity: -1, thought: "Locking is an old instinct. Tonight it may be right, or late." },
      ],
    },
    {
      id: "corredor",
      music: "suspense",
      body: "Your room was four doors to the left. You count eight. The carpet swallows the step and gives it back, behind you, a step that is not yours. Iara’s hand is cold and very human, which frightens you more than if it weren’t. Then the voice. Her voice, sweeter, at the exact point of your nape. It says your whole name, including the one you don’t use at the hotel. Iara, beside you, grips your arm until it hurts in a useful way. Her mouth shapes: don’t. The other insists, soft: let me in, you’re tired, I know the bed. No door in the corridor has a number now. Only the distance to the elevator, which has grown.",
      choices: [
        { id: "nao", label: "Don’t turn", to: "elevador", affinity: 2, thought: "The nape wants to obey the sweetness. Iara’s arm is the clearest sentence in the corridor." },
        { id: "responder", label: "Answer without turning", to: "elevador", affinity: 1, clue: "The voice behind you knows your whole name.", thought: "If I speak, I confirm that I heard. I speak anyway, low: no." },
        { id: "virar", label: "Turn around", to: "fim-virar", affinity: -1, thought: "I need to see. That need is exactly what she uses." },
      ],
    },
    {
      id: "elevador",
      speaker: "Iara",
      music: "templo",
      body: "The elevator opens with a sigh of old metal. In the mirror, for a second, two Iaras. Then one. The one on your arm steps in backward, refusing the corridor her spine. “Come down with me to the lobby. She doesn’t come in there. Don’t ask me which of us is in here. A question is a way of turning.” The mirror insists on showing a corridor longer than the building. One lamp blinks in the rhythm of something breathing. Iara looks at the ground-floor button as if it could be persuaded.",
      choices: [
        { id: "descer", label: "Go down with her", to: "fim-saguao", affinity: 2, thought: "The lobby is ugly. Ugly, tonight, is a sanctuary." },
        { id: "segurar", label: "Hold the door until she is all the way in", to: "fim-saguao", affinity: 1, thought: "I won’t let the elevator decide alone who stays outside." },
        { id: "qual", label: "Ask which of the two is in the elevator", to: "fim-virar", affinity: -1, thought: "The question leaves and I already know I turned without using my neck." },
      ],
    },
    {
      id: "fim-saguao",
      music: "luar",
      ending: {
        key: "saguao",
        title: "The lobby",
        flower: "Lily",
        body: "The lobby is yellow, loud with a refrigerator, safe in a way that has no poetry. Iara drinks the bad coffee like a person returning to hunger. She thanks you without touching you. “Tomorrow at breakfast I’ll be in blue. If I don’t eat, it isn’t me. If I eat and don’t look at your table, it isn’t me either. You can sit across from me. I’ll know.” The horror doesn’t end. It gains a rule, and the rule is a way of caring. You go up alone when the sun is already lying on the sidewalk. In the morning the corridor is the size of a corridor. 714 is shut. At breakfast she is in blue. She eats. She looks. You sit across from her.",
        letter: { from: "Iara", text: "I ate. It was me. Don’t go up the corridor alone after one, for a while. If I knock, it’s three knocks, and I say the color of my clothes before you open. If the voice doesn’t say the color, it isn’t a visit. Thank you for not turning. Almost no one can." },
      },
    },
    {
      id: "fim-virar",
      music: "suspense",
      ending: {
        key: "virar",
        title: "The one who asks",
        flower: "Glass",
        body: "You turn, or you ask the question that is a way of turning. The woman behind has Iara’s mouth and none of her caution. She smiles like someone already invited. “I only want to come in. You’re tired.” The Iara on your arm is no longer on your arm. The elevator closes with one person, and you are not the one who chooses which. In the morning Iara’s chair at breakfast is empty. Your card opens 714. The bed is warm. You don’t remember lying down. In the bathroom mirror, for an instant, someone behind you blinks with your face and the wrong patience.",
        letter: { from: "Iara", text: "If this note is in your handwriting, I didn’t write it. I leave notes with the color of my clothes and three knocks. Any other sweet sentence, in the corridor, you don’t open. If you already opened, leave the door ajar and go down. The lobby still works. I’ll wait in blue, if I’m still me." },
      },
    },
    {
      id: "fim-batida",
      music: "despedida",
      ending: {
        key: "batida",
        title: "Three knocks",
        flower: "Cold key",
        body: "You close the door. The lock is loud and small. At three-twelve, three knocks, patient, in the rhythm Iara would have used on the elevator button. You don’t open. In the morning the clerk says 714 checked out at midnight, which is impossible and is in the system. Under your door, a paper in your handwriting: “I turned.” You didn’t. Not yet. The room key, in your hand, is cold on both sides. At breakfast, no one in blue. The chair across from your table has been taken away, as if the hotel preferred not to count places.",
        letter: { from: "Iara", text: "I knocked three times. You didn’t open, and that may have been right. The paper under the door isn’t mine if it’s in your handwriting. Don’t come up looking for me. If I’m still anywhere in this building, I’m in the lobby, in blue, eating. If I’m not eating, walk past." },
      },
    },
  ],
};

const depoimentoEn: Story = {
  slug: "depoimento",
  title: "The Statement",
  author: "Luana Viana",
  rating: "16",
  genres: ["crime", "thriller", "betrayal"],
  minutes: 14,
  synopsis: "You saw what happened on the roof. The person taking your statement is your ex. She already knows which version you are going to tell. She wants the other one.",
  place: "The station",
  art: "/scenes/biblioteca.jpg",
  start: "sala",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "sala",
      speaker: "Elisa",
      music: "suspense",
      body: "The room smells of reheated coffee and of paper that has already heard too many lies. Across the table, Elisa. Your ex. Badge, hair tied back, the same mouth that once asked you to stay and heard that you didn’t know how. Between you, the photo of the roof: the low wall, the city, a broken glass. “Soraia is alive. Duda says she jumped. I need your sentence, not hers.” Elisa does not raise her voice. She never had to. “You were there because my sister asked. Don’t make that face. I know you and Duda were not only talking. I’m her sister, and I’m also the person who still recognizes when you choose the easy sentence.”",
      choices: [
        { id: "tarde", label: "Say Duda’s hand arrived too late", to: "frase", affinity: 1, clue: "You saw Duda’s hand arrive after.", thought: "Too late still isn’t the name of what I saw. It’s the name that fits in this room." },
        { id: "pulo", label: "Say Soraia didn’t jump", to: "frase", affinity: 2, clue: "It was not a jump.", thought: "The true sentence dries my mouth. I say it anyway." },
        { id: "advogada", label: "Refuse to speak without someone on your side", to: "fim-silencio", affinity: 0, thought: "Silence isn’t neutral. I choose it knowing the price." },
      ],
    },
    {
      id: "frase",
      speaker: "Elisa",
      music: "revelacao",
      body: "Elisa waits. The recorder is a small indecent light. “Don’t use the fact that I’m her sister against me. Use it properly. Duda will say she held on. When Soraia woke, she asked for you, not for the police. That interests me and it hurts me, and I won’t mix the two in front of you.” She pushes over a glass of water you don’t drink. “If you protect Duda, I close the file on your sentence and sleep badly. If you say what the wall saw, my sister walks through this night handcuffed to a truth. I’ll sign it anyway. I only don’t want you to lie in order to spare me.”",
      choices: [
        { id: "proteger", label: "Protect Duda", to: "del", affinity: -1, thought: "Loyalty is an animal that bites the wrong person. I feel the tooth." },
        { id: "nome", label: "Say Soraia’s name into the recorder", to: "fim-nome", affinity: 2, thought: "Her name on the recorder doesn’t undo the wall. It keeps the wall from lying alone." },
        { id: "ver", label: "Ask to see Soraia before you sign", to: "hospital", affinity: 1, thought: "I won’t sign a woman I haven’t heard yet." },
      ],
    },
    {
      id: "del",
      speaker: "Duda",
      music: "suspense",
      body: "The station corridor gives you Duda for one second: your jacket, which she never returned, an eye swollen from crying and not from a blow. She moves her mouth. Please. It isn’t a sound. Elisa watches your mouth, not her sister’s. There is a pen and two sentences already printed, one in which Soraia climbs the wall alone, one blank. Duda disappears around the bend. What remains is the smell of rain on a jacket that once slept on your chair. Elisa says, low: “She’s my sister. You’re the only one who isn’t obliged to choose her. That’s why your sentence is worth more than mine.”",
      choices: [
        { id: "repetir", label: "Sign Duda’s version", to: "fim-versao", affinity: -1, thought: "The pen weighs as if Soraia were on the other side of the ink." },
        { id: "rasgar", label: "Tear it up and begin again with Soraia", to: "fim-nome", affinity: 2, thought: "Paper tears easily. The rest doesn’t. I tear it anyway." },
        { id: "sair", label: "Leave without signing", to: "fim-silencio", affinity: 0, thought: "Without a signature, the night stays open. Open still cuts." },
      ],
    },
    {
      id: "hospital",
      speaker: "Soraia",
      music: "luar",
      body: "Soraia is awake. Split lip, hoarse voice, the hand with the IV does not shake. “I didn’t let go. We were leaving together. Duda asked me not to tell, because Elisa doesn’t know about us, and Duda was more afraid of her sister than of the wall. Her hand reached me and opened. It wasn’t a jump. It was fear.” She looks at you with no romance and no hatred, which is harder to hold. “If you repeat her version, I survive and become a liar on paper. If you say my name properly, Duda breaks, and maybe she deserves to break. I won’t ask you to be a heroine. I’ll ask you not to leave me alone in the sentence.”",
      choices: [
        { id: "gravar", label: "Go back and record what she said", to: "fim-nome", affinity: 2, clue: "They were leaving together. Elisa didn’t know.", thought: "I take her sentence whole. No ornament, no sister in the middle." },
        { id: "segredo", label: "Promise secrecy", to: "fim-versao", affinity: -1, thought: "Secrecy, tonight, is only Duda’s version under another name." },
        { id: "ficar", label: "Stay with Soraia and don’t go back to the room", to: "fim-silencio", affinity: 1, thought: "The hospital chair is the only statement I can hold right now." },
      ],
    },
    {
      id: "fim-versao",
      music: "despedida",
      ending: {
        key: "versao",
        title: "The version",
        flower: "Iron",
        body: "You sign the sentence that saves Duda. Elisa closes the file the way you close a family debt, and she does not thank you with her mouth. In the corridor she says only: “You always knew how to be loyal to the person standing in front of you. The problem is who stays behind.” Soraia doesn’t answer you in the days that follow. Duda sends a voice note you don’t play. The jacket remains at the station, or on someone’s chair, or in the past. You were loyal to the wrong silence. The recorder keeps your voice with an offensive calm. At night the city, seen from below, has no wall. You know that is a lie.",
        letter: { from: "Soraia", text: "I read the paper. Your handwriting isn’t on it, but your omission is. I’m going to get well. I don’t need you to show up and complete the version. If one day you want to say the sentence you didn’t say, say it to the recorder, not to me. I’ve already heard enough from that roof." },
      },
    },
    {
      id: "fim-nome",
      music: "revelacao",
      ending: {
        key: "nome",
        title: "Her name",
        flower: "Red thread",
        body: "You say it into the recorder, in the voice Elisa knows from another life: Soraia didn’t jump. Duda’s hand opened. They were leaving, and fear arrived before love. Elisa’s face does the thing it did when you left her, a clean break, no plea. She writes it down anyway. Duda walks past you without the jacket, without the please. Soraia, hoarse, asks why the truth needed a badge to come out. You don’t have a pretty answer. You stay in the chair. Sometimes staying is the only apology that doesn’t lie.",
        letter: { from: "Elisa", text: "I filed it. Don’t come explain my sister to me, or Soraia. You did the part I asked for and the part I was afraid of. They can be the same part. Don’t look for me to be comforted. If Soraia wants you at the hospital, that is hers. The file is no longer a conversation between us." },
      },
    },
    {
      id: "fim-silencio",
      music: "despedida",
      ending: {
        key: "silencio",
        title: "Unsigned",
        flower: "A door ajar",
        body: "You don’t give Elisa a sentence. She switches off the recorder without pleading. “Then the night stays yours. Careful: a night without a sentence is the one other people write.” You go out into the rain with empty hands and a full ear. At home, two knocks, hours apart. You know both rhythms. Your hand stays on the lock for a length of time that does not fit in a statement. Silence chose a side too. You open for Soraia. Duda’s knock goes unanswered, and the lack of an answer is a sentence, finally, said into the wood.",
        letter: { from: "Soraia", text: "Thank you for opening. I didn’t come for the version. I came for a chair that isn’t the hospital’s and isn’t her sister’s. You don’t have to talk about the roof today. If you talk, talk properly. I already survived the easy sentence. I don’t need another." },
      },
    },
  ],
};

export const sharpEn: Story[] = [passageiraEn, cartasEn, corredorEn, depoimentoEn];
