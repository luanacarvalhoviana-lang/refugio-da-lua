import type { Story } from "@/lib/refugio/stories";

const passageiraEn: Story = {
  slug: "passageira",
  title: "Passenger",
  author: "Luana Viana",
  rating: "16",
  genres: ["thriller", "crime", "romance"],
  minutes: 14,
  synopsis: "She gets into your car after midnight with the spare key you never asked back. The coat on the rear seat is still warm. She tells you to drive, and not to look.",
  place: "The overpass",
  art: "/scenes/varanda.jpg",
  start: "banco",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "banco",
      music: "suspense",
      body: "Rain stitches the overpass. The lamp above you flickers and gives up. Someone taps the passenger glass with the ease of a person who does not ask. It is Renata. Eleven months without a sentence. She holds up the spare key, the one you gave her on a Tuesday and forgot in the middle of the ending. The back seat carries a dark coat, folded too carefully to be empty of heat. “Drive. Don’t look back. If you look, we lose the only minute in which the car behind us still doesn’t know I got into yours.”",
      choices: [
        { id: "dirigir", label: "Drive without looking", to: "marginal", affinity: 1, clue: "Renata still has the spare key to your car.", thought: "If I look, I become a witness. If I drive, I become an accomplice. Both hurt less than leaving her in the rain." },
        { id: "olhar", label: "Look at the back seat first", to: "tras", affinity: 1, clue: "The coat is still warm.", thought: "I need the size of the night before I lend her my car." },
        { id: "descer", label: "Tell her to get out", to: "fim-porta", affinity: -1, thought: "Eleven months taught my hand to lock. The hand obeys. The rest of me does not applaud." },
      ],
    },
    {
      id: "tras",
      speaker: "Renata",
      music: "suspense",
      body: "The coat smells of rain and of a perfume you met only once, at a party where Renata spent the whole night looking at another woman. In the pocket, a hotel key card with the number 4 penciled on it, and a dark lipstick that is not hers. Renata does not try to hide it. “Marina got out alive. I swear it on the most idiotic thing I have, which is you. The car behind us is not mine. It’s Celina’s. Marina left her today. I only opened a door. Then the door got dangerous, and the only key Celina doesn’t know is the one to your car.”",
      choices: [
        { id: "guardar", label: "Keep the key to room 4", to: "marginal", affinity: 2, clue: "The hotel card is for room 4, written in pencil.", thought: "Keeping this means the night will have proof. I keep it anyway." },
        { id: "ferida", label: "Ask if Marina is hurt", to: "marginal", affinity: 1, thought: "The right question arrives late. I ask it anyway, because late is still arriving." },
        { id: "devolver", label: "Give the coat back and stop", to: "fim-casaco", affinity: 0, thought: "If I give the coat back, I give the whole night back. Part of me wants clean hands." },
      ],
    },
    {
      id: "marginal",
      speaker: "Renata",
      music: "suspense",
      body: "The city opens a wet corridor. Renata watches the mirror the way you watch a person. A car keeps the same distance, unhurried, which is the oldest way to threaten. “Celina thinks Marina left with me. She didn’t. Marina left her. I showed up because Marina called me from a closed gas station and her voice was small. When I got there, she had already stepped out of my car and asked me not to follow. I saw the other headlights. I got into yours because yours is the one she doesn’t mark.” Renata’s hand stays on her knee. Not asking for a lap. Only so it doesn’t shake alone.",
      choices: [
        { id: "quem", label: "Ask who Celina is to Marina", to: "posto", affinity: 1, clue: "Celina is Marina’s wife.", thought: "A name moves fear from one place to another. I want the name." },
        { id: "silencio", label: "Don’t talk. Just drive", to: "posto", affinity: 2, thought: "She tells more when I don’t pull the sentence out. I’ve known that since before." },
        { id: "encostar", label: "Pull over now", to: "fim-casaco", affinity: -1, thought: "Stopping is a kind of courage that looks like abandonment. I stop." },
      ],
    },
    {
      id: "posto",
      music: "revelacao",
      body: "The station is closed, the shop light cut in half. Renata’s phone lights up in the cup holder: Marina. It rings as if the sound could give you away to the whole street. In the mirror, the other car went past and vanished at the curve, which is not relief. It is someone choosing another angle. Renata doesn’t pick up. She looks at you like a woman who already handed over the wheel and is now handing over the rest. “If you answer, she’ll ask for something. If I answer, I’ll promise. Both options keep us inside.”",
      choices: [
        { id: "atender", label: "Answer Marina", to: "farol", affinity: 2, clue: "Marina asked you not to let Celina find you.", thought: "Her voice makes me responsible. I’m already driving. Responsible is only the new name." },
        { id: "tocar", label: "Let it ring out", to: "farol", affinity: 0, thought: "Silence chooses too. I pretend it is neutral." },
        { id: "viva", label: "Put her on speaker", to: "farol", affinity: 1, clue: "Marina is two blocks away, on foot, without a coat.", thought: "I want the sentence without owning it. Polite cowardice." },
      ],
    },
    {
      id: "farol",
      speaker: "Marina",
      music: "suspense",
      body: "Marina stands under the light, no coat, hair stuck to her mouth. She does not run. People who run look guilty. Celina’s car comes down the lower street, slow, searching for a face. Marina sees your car and does not know it. She knows Renata in the seat. Her mouth shapes a sentence with no sound: don’t stop, or stop; you can’t tell. Renata opens her hand on the console, between the brake and you. “If we stop, she gets in and Celina passes without seeing her face. If we go on, I get out at the next corner and take the coat. You keep only the night. I won’t hate you. I’ll remember you.”",
      choices: [
        { id: "parar", label: "Stop and open the door for Marina", to: "fim-curva", affinity: 2, thought: "Opening the door is the tallest thing I’ve done in months. The handle is cold." },
        { id: "reto", label: "Drive past", to: "fim-casaco", affinity: -1, thought: "The light stays behind like a person I could have been." },
        { id: "buzina", label: "Honk so she knows which car", to: "fim-curva", affinity: 1, clue: "The horn also warns Celina.", thought: "The sound gives me away. It also gives Marina a way out. I accept both." },
      ],
    },
    {
      id: "fim-curva",
      music: "romance",
      ending: {
        key: "curva",
        title: "The curve",
        flower: "Night jasmine",
        body: "You stop. Marina gets in without theater, wet, alive, and lies low under the coat the way you put out your own outline. Celina passes half a meter away. She does not see the face. She sees some car in the rain, and ordinary cars are the only kindness the city has. At the next light, too long, Renata rests her forehead on your shoulder. She does not kiss you. She says tomorrow in the voice of someone who intends to pay what she owes. Marina, behind, says your name. She should not know it. Renata told her. No one explains the year of silence. The light changes. You drive the three of them to the ugly light of a hospital and you do not get out. Staying at the wheel, tonight, is also staying.",
        letter: { from: "Renata", text: "Marina is in the room, actually asleep. Celina did not come in. I will not turn you into an alibi or a heroine. Tomorrow, if you want the key back, I’ll bring it. If you want me to keep it one more day, say so. I know the difference." },
      },
    },
    {
      id: "fim-casaco",
      music: "despedida",
      ending: {
        key: "casaco",
        title: "What stayed in the pocket",
        flower: "White carnation",
        body: "Marina stays under the light. Renata opens the door on the next breath and runs with the coat open, two people trying to fit inside one piece of cloth. You keep going because stopping now would be choosing a side with an audience. Two streets later the seat smells of them and not of you. In the pocket that remained, a strip of wet paper: “If she is the one driving, tell her I saw the car.” You don’t know which she. In the morning the paper dries crooked and is still true. The spare key does not come back. Some nights do not close. They only change owners.",
        letter: { from: "Marina", text: "I saw your car go past. I don’t blame you. Renata reached me on foot, which is more than I asked of either of you. If the sentence in the pocket was for you, now you know: I saw. You don’t have to answer. Just don’t give the paper to Celina." },
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "The door you closed",
        flower: "Wet leaf",
        body: "Renata gets out before the light changes. She does not slam the door. That is worse: she is still being careful with something of yours. In the mirror, two women share a coat in the rain and neither looks at your car. You were the only door Celina did not know. You closed it. The overpass goes on smooth, innocent, full of people who owe this night nothing. The spare key stays off your ring. You will remember it every time you lock something.",
        letter: { from: "Renata", text: "I won’t ask again. Marina got home. Not to mine. I would return the key if I knew how to see you without it sounding like a request. Keep the silence. You already chose its size." },
      },
    },
  ],
};

const correspondenciaEn: Story = {
  slug: "correspondencia",
  title: "Correspondence",
  author: "Luana Viana",
  rating: "16",
  genres: ["drama", "psychological drama", "unrequited love"],
  minutes: 13,
  synopsis: "Letters arrive for a name you buried. The woman who writes them never heard the answer. The doorman says she was here yesterday and that she is coming back today.",
  place: "A new apartment",
  art: "/scenes/biblioteca.jpg",
  start: "caixa",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "caixa",
      music: "calma",
      body: "Three weeks at this address and the mailbox still smells of paint. Between the electric bill and a flyer, an envelope with no stamp, in the handwriting you would know in the dark: A. Varela. That name lasted a year, in a city you left, and only one person used it without irony. Helena. The doorman left a message on the intercom, the voice of a man who does not want drama on his shift. “The woman from yesterday asked for that name. I said she doesn’t live here. She said she’ll come back today. She didn’t come up.” The letter weighs as if someone braver had already read it.",
      choices: [
        { id: "abrir", label: "Open the letter", to: "leitura", affinity: 1, clue: "The letter calls you A. Varela.", thought: "Opening is letting her in without the key. I open it." },
        { id: "nao", label: "Go up with the letter sealed", to: "escada", affinity: 0, thought: "If I don’t read it, I can still pretend the name died of natural causes." },
        { id: "descer", label: "Go down now, before she comes back", to: "portaria", affinity: 2, thought: "I want the face before the sentence. I always did, and I always did the opposite." },
      ],
    },
    {
      id: "leitura",
      music: "luar",
      body: "Helena writes the way you speak softly so you don’t wake the house. She describes the kitchen of that night: the unpaid bill, the kettle, the question stay. You said you had a train. You didn’t. You had fear, and a life already too arranged to hold a truth. “I didn’t need you to stay. I needed you to say you wanted to. I spent a year thinking I invented what I felt on your mouth when you didn’t kiss me.” It is not a letter of accusation. It is worse. It is an accurate letter. At the end: “If A. Varela doesn’t live there anymore, tear it up. If she does, you don’t have to answer beautifully. You have to answer.”",
      choices: [
        { id: "escrever", label: "Write back, with no ornament", to: "mesa", affinity: 2, clue: "You wanted to stay in that kitchen too.", thought: "The true sentence fits in three lines. It took me a year to deserve the paper." },
        { id: "jogar", label: "Tear the letter up", to: "fim-nome", affinity: -1, thought: "Tearing it is leaving all over again. I’m good at that. It isn’t a compliment." },
        { id: "guardar", label: "Keep it and don’t answer", to: "escada", affinity: 0, thought: "Keeping it is a compromise that only protects me." },
      ],
    },
    {
      id: "escada",
      speaker: "Helena",
      music: "calma",
      body: "Helena is on the landing below. She does not climb the last flight. The coat is the same. The mouth is not. She holds the strap of her bag the way you hold an apology. “If it isn’t you, I’ll apologize to the building and go. If it is, I won’t come up until you say a name. Either one. I just don’t want to talk alone in the hall again.” The floor light flickers. No neighbor opens. For one minute the whole city is a step.",
      choices: [
        { id: "sou", label: "Say: it’s me", to: "fim-escada", affinity: 2, thought: "The name I use now comes out first. The old one stays in my throat, alive." },
        { id: "morto", label: "Say that name doesn’t live here", to: "fim-nome", affinity: -1, thought: "The lie fits in my mouth with an ease that shames me." },
        { id: "carta", label: "Show her the letter and say nothing", to: "fim-resposta", affinity: 1, thought: "The paper says what my voice is still negotiating." },
      ],
    },
    {
      id: "portaria",
      music: "revelacao",
      body: "The doorman pushes a second envelope across the desk, this one in your current name, written slowly, as if each letter had to be confirmed. “She waited forty minutes. Left this and a number. Said not to call if it hurts. Call if it doesn’t hurt more than last time.” He doesn’t ask. A good desk has already seen worse. Outside, the rain erases the sidewalk. It does not erase the fact: Helena knows both names. The old one was not a fantasy only you were carrying.",
      choices: [
        { id: "ler", label: "Read the second letter", to: "mesa", affinity: 2, clue: "She already knows the name you use now.", thought: "She found me without the old name. So it wasn’t the name she wanted. It was me." },
        { id: "devolver", label: "Give it back unread", to: "fim-nome", affinity: -1, thought: "Giving it back is elegant. It is also cowardly. Both fit me the same." },
        { id: "endereco", label: "Ask for the number she left", to: "mesa", affinity: 1, thought: "Having the number isn’t using it. I still want the possibility in my hand." },
      ],
    },
    {
      id: "mesa",
      music: "romance",
      body: "You sit on the floor because the new table has not earned this sentence. Three lines fit on the back of the electric bill. It is not forever. It is: I wanted to stay too. I lied about the train. A. Varela was me, and I took her with me because I didn’t know how to stay beside her. The intercom rings once, without insisting. Helena, downstairs, giving you the last choice with too much manners. The doorman does not announce her. He already understands that announcing ruins it.",
      choices: [
        { id: "descer", label: "Go down with the answer in your hand", to: "fim-resposta", affinity: 2, thought: "The paper shakes less than I do. Good that the truth is on it." },
        { id: "subir", label: "Ask her to come up", to: "fim-escada", affinity: 2, thought: "If she crosses the door, the apartment stops being a hiding place. I want that and I’m afraid of it in equal measure." },
        { id: "nao", label: "Don’t answer the intercom", to: "fim-nome", affinity: -1, thought: "The ring stops. The year starts over, identical." },
      ],
    },
    {
      id: "fim-resposta",
      music: "romance",
      ending: {
        key: "resposta",
        title: "The answer",
        flower: "Camellia",
        body: "You hand her the paper. Helena reads it standing up, in the lobby, without theater. When she reaches the sentence about the train, her mouth does something small, almost a smile it does not permit itself. She does not kiss you. She folds the page and puts it in the inner pocket, where you keep what you will reread on the bus. “Then it wasn’t only me.” Rain hits the sidewalk and misses both of you, for a second, under the awning. She does not ask to come up. You do not ask her to stay. For the first time the lack of a request is not an escape. It is measure. She touches your wrist, two fingers, and lets go. “You can write to this name. I’ll answer.”",
        letter: { from: "Helena", text: "I read it again on the bus. The sentence about the train hurt less on paper than it did for a year in my head. I won’t show up tomorrow. I’ll write. If you answer one line, I won’t turn this into a whole life without your permission. I only needed to know the kitchen was real." },
      },
    },
    {
      id: "fim-escada",
      music: "luar",
      ending: {
        key: "escada",
        title: "The last step",
        flower: "Violet",
        body: "One of you crosses the step. It doesn’t matter which. Helena asks for the name you use now, first, so the old one doesn’t hunt you. You say it. She repeats it quietly, trying it, and then says A. Varela the way you return a coat without demanding that someone put it on. Nothing is solved. Her city is still the city you left. The new apartment still has no table worthy of this. She asks if she may write to this address. You say yes. It is more than you said in the kitchen, and less than a film would promise. She stays twenty minutes. Drinks water. Does not sleep here. When she goes down, the hall returns to its size. You go up knowing the exact weight of a small yes.",
        letter: { from: "Helena", text: "I got home. I won’t romanticize the stairs. You gave me a new name and twenty minutes of water. I kept both. I’ll write on Thursday, if Thursday isn’t too soon. If it is, tear it up and I’ll understand the time." },
      },
    },
    {
      id: "fim-nome",
      music: "despedida",
      ending: {
        key: "nome",
        title: "The dead name",
        flower: "Burnt paper",
        body: "A. Varela dies a second time, and this time you watch. Helena accepts the empty building with the manners of someone who already rehearsed the loss. She does not argue. An argument would be an intimacy you did not offer. The letters stop after one more, which arrives on Friday and stays sealed until the paper yellows. There are loves that are accurate and unfinished. Yours was both. The new apartment does its job: no one here knows the name you could not carry. At night the mailbox makes a metal sound. Almost always it is the wind.",
        letter: { from: "Helena", text: "This is the last one. I won’t turn your refusal into a mystery, because it isn’t a mystery. It is an answer. I invented less than I thought and more than you could carry. Be well. I will be too, only I won’t write to a name you buried twice." },
      },
    },
  ],
};

const sobremesaEn: Story = {
  slug: "sobremesa",
  title: "The Last Course",
  author: "Luana Viana",
  rating: "16",
  genres: ["comedy", "betrayal", "romance"],
  minutes: 12,
  synopsis: "You cook your ex’s dinner. Her date is the woman you have been seeing for six weeks. The wine is perfect. No one in that room is.",
  place: "The service kitchen",
  art: "/scenes/cafe.jpg",
  start: "forno",
  sound: "/sounds/fireplace.mp3",
  scenes: [
    {
      id: "forno",
      music: "calma",
      body: "The oven timer is the only honest creature in the house. Inside, a fish you could cook with your eyes closed. Outside, Clara’s dining room, your ex, the long table, the candles she always lights too early, the speech she rehearses even to the mirror. You took the job because this month’s bill has no sense of humor. Clara comes into the kitchen with two glasses. “Taste. Like before.” The kiss on the cheek lasts a second longer than what people who have ended are allowed. Nanda comes in behind her for ice and stops with the bucket at her chest. Six weeks. She had said she was almost single. Clara smiles with every tooth.",
      choices: [
        { id: "voz", label: "Say it out loud: she’s my ex", to: "sala", affinity: 1, clue: "Clara kissed your cheek on purpose.", thought: "If I say it now, the fish burns. Let it burn." },
        { id: "gelo", label: "Send Nanda back into the dining room", to: "gelo", affinity: 0, thought: "Taking her out of the audience doesn’t erase what she saw. It only delays the melting ice." },
        { id: "beijo", label: "Kiss Clara back to kill the joke", to: "fim-cozinha", affinity: -2, thought: "I pick the wrong joke. Nanda sees the version that isn’t ours." },
      ],
    },
    {
      id: "gelo",
      speaker: "Nanda",
      music: "calma",
      body: "The pantry fits two people if one of them isn’t angry. Nanda is. The ice has already become water and an opinion. “She called me this morning. I didn’t know the cook was you. I was going to end it on Sunday. Not in the middle of the fish, not with her mouth on your face.” She laughs once, short, graceless, which on another night would be your kind of joke. “You’re going to look at me as if I were the whole betrayal. Look at her too. Nobody sets a dinner this size without knowing the menu.”",
      choices: [
        { id: "rir", label: "Laugh, even if it’s ugly", to: "sal", affinity: 2, thought: "The laugh comes out crooked and true. It is the first relief of the night." },
        { id: "terminar", label: "Ask: you were going to end it?", to: "sal", affinity: 1, clue: "Nanda was already leaving before the dinner.", thought: "The question hurts in the wrong order. I ask it because I want the right one." },
        { id: "muda", label: "Go back to the risotto and say nothing", to: "fim-prato", affinity: 0, thought: "If I have no voice, I have a plate. Pathetic, and mine." },
      ],
    },
    {
      id: "sala",
      speaker: "Clara",
      music: "revelacao",
      body: "The room understands everything one second too late, which is how dining rooms understand. Someone thinks it is a toast. Clara lifts her glass toward you, beautiful and cruel in the exact measure you already knew in bed and in a fight. “To the woman who cooks what I don’t know how to say.” Nanda is standing by the window, empty glass, deciding whether to laugh or leave. The guests smile at the wrong part of the sentence. The fish, on the platter, looks embarrassed.",
      choices: [
        { id: "brinde", label: "Toast, and sit beside Nanda", to: "fim-conta", affinity: 2, thought: "I choose the chair, not the speech. The chair is more honest." },
        { id: "corrigir", label: "Correct Clara in front of everyone", to: "fim-conta", affinity: 1, thought: "It will be ugly. Ugly is still better than her sentence alone in the air." },
        { id: "cozinha", label: "Go back to the kitchen as if this were only work", to: "fim-prato", affinity: 0, thought: "The apron is a ridiculous hiding place. I put it on." },
      ],
    },
    {
      id: "sal",
      speaker: "Clara",
      music: "revelacao",
      body: "You laugh in the pantry, an awful necessary laugh, the kind that unblocks a chest. The door opens. Clara has no wine. She has empty hands, which on her is serious anger. “I wanted to see if either of you would tell the truth without an audience. Nanda said your first name yesterday, without knowing. I had already hired you. I didn’t cancel.” She looks at the coarse salt in your hand as if it were a small weapon. “I won’t make a scene. A scene is intimacy, and I won’t borrow it. But someone here is going to speak before dessert, or dessert goes out alone and I charge for the whole night.”",
      choices: [
        { id: "desculpa", label: "Apologize with no audience", to: "fim-conta", affinity: 2, thought: "Sorry doesn’t erase the dinner. It keeps it from becoming a legend." },
        { id: "armou", label: "Say she set the night up", to: "fim-conta", affinity: 1, clue: "Clara hired you knowing.", thought: "I hand the plot back to its owner. The owner makes an almost respectful face." },
        { id: "servir", label: "Serve dessert and leave without a word", to: "fim-prato", affinity: 0, thought: "Dessert can carry what my mouth refuses." },
      ],
    },
    {
      id: "fim-conta",
      music: "romance",
      ending: {
        key: "conta",
        title: "The bill",
        flower: "Lemon",
        body: "The truth comes out between the main course and the sweet, badly told, with a joke in the wrong place and a silence someone tries to cover with a fork. Clara tells the table to eat. It is not forgiveness. It is control, and you recognize it, and you are still grateful for the lack of a scene. Nanda takes your hand in the service alley, furious and tender, which has been your dialect since the third week. “Sunday still stands. No dinner. No ex. No fish.” You leave the refund and a short apology on Clara’s counter. She does not come out to read it in front of you. On Sunday, Nanda shows up. She doesn’t end it. She starts a harder conversation, which is better.",
        letter: { from: "Nanda", text: "Sunday. No candle, no toast, no your ex narrating us. I was still going to end it, you know. Then you laughed ugly in the pantry and I remembered why not. I’ll be there at four. If there’s lunch, make it bread. I don’t trust you near an oven on a night of crisis." },
      },
    },
    {
      id: "fim-prato",
      music: "calma",
      ending: {
        key: "prato",
        title: "Under the plate",
        flower: "Burnt sugar",
        body: "You don’t make a speech. Speech is Clara’s genre. Under Nanda’s plate, on the back of a receipt: “I didn’t know it was her. If you were already going to end it, end it looking at me.” Clara’s plate goes out clean of notes. She understands the night anyway, because Clara always understood an hour late and with precision. She pays double. She doesn’t say goodbye. Nanda texts from the taxi, one word that saves what can be saved: come down. You go down with the apron still tied, ridiculous, exact. The burnt sugar stays for the guests. They will think it was technique.",
        letter: { from: "Clara", text: "The money went through. Don’t thank me and don’t explain Nanda. I wanted to see your face. I saw it. It wasn’t as sweet as I imagined, which is fair. Don’t call me for the next dinner. I won’t call you either. This bill is closed." },
      },
    },
    {
      id: "fim-cozinha",
      music: "despedida",
      ending: {
        key: "cozinha",
        title: "Service",
        flower: "Napkin",
        body: "You return Clara’s kiss on the cheek the way you return a joke. Nanda sees the wrong version and does not stay for the correction. The ice bucket sits in the sink, absurd, melting. Dessert goes out on time. No one notices that the host’s date has already left, or they notice and decide that dessert is more polite than a question. Later, only you and Clara and the pans. “I wanted it to hurt the same,” she says, without victory. It doesn’t. You wash up. The comedy ends with no tip. On your phone, Nanda does not leave the Sunday note. She leaves the blank, which is also a text.",
        letter: { from: "Nanda", text: "I saw what you chose to do with your mouth. You don’t have to tell me it was a joke. A joke is a choice too. Don’t come on Sunday. Don’t come on Monday. When you have a sentence that isn’t service, then we’ll see if there’s still a person on the other side." },
      },
    },
  ],
};

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

export const sharpEn: Story[] = [passageiraEn, correspondenciaEn, sobremesaEn, corredorEn, depoimentoEn];
