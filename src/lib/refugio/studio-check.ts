export type StudioChoice = {
  id: string;
  texto: string;
  vai: string;
  afinidade: number;
  pista: string;
  diario: string;
};

export type StudioScene = {
  id: string;
  quem: string;
  texto: string;
  musica: string;
  final: boolean;
  endingTitle: string;
  endingBody: string;
  flower: string;
  carta: string;
  cartaDe: string;
  choices: StudioChoice[];
};

export type StudioIssue =
  | { code: "empty" }
  | { code: "dead"; scene: number }
  | { code: "many"; scene: number }
  | { code: "lost"; scene: number }
  | { code: "ending"; scene: number }
  | { code: "nowhere" }
  | { code: "orphan"; scene: number };

export function checkStory(scenes: StudioScene[]): StudioIssue[] {
  const issues: StudioIssue[] = [];
  if (scenes.length === 0) return [{ code: "empty" }];
  const ids = new Set(scenes.map((scene) => scene.id));
  scenes.forEach((scene, index) => {
    const sceneNumber = index + 1;
    if (scene.final) {
      if (!scene.endingTitle.trim() || !scene.endingBody.trim() || !scene.flower.trim()) {
        issues.push({ code: "ending", scene: sceneNumber });
      }
      return;
    }
    if (scene.choices.length === 0) issues.push({ code: "dead", scene: sceneNumber });
    if (scene.choices.length > 3) issues.push({ code: "many", scene: sceneNumber });
    scene.choices.forEach((choice) => {
      if (!choice.texto.trim() || !ids.has(choice.vai)) issues.push({ code: "lost", scene: sceneNumber });
    });
  });
  const seen = new Set<string>();
  const stack = [scenes[0].id];
  while (stack.length) {
    const id = stack.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const scene = scenes.find((item) => item.id === id);
    if (!scene || scene.final) continue;
    scene.choices.forEach((choice) => {
      if (ids.has(choice.vai)) stack.push(choice.vai);
    });
  }
  if (!scenes.some((scene) => scene.final && seen.has(scene.id))) issues.push({ code: "nowhere" });
  scenes.forEach((scene, index) => {
    if (!seen.has(scene.id)) issues.push({ code: "orphan", scene: index + 1 });
  });
  return issues;
}
