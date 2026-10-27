import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { ageFromBirth } from "@/lib/refugio/reading-local";
import { PACTO_VERSION, keepBirth, knownBirth, parseBirth, takePactNext, writePact } from "@/lib/refugio/pacto";
import { savePacto } from "@/lib/refugio/pacto-cloud";
import type { Lang } from "@/lib/refugio/stories";

export function PactPage({ initialLang }: { initialLang?: Lang }) {
  const { lang, setLang, t } = useHouse();
  const [birth, setBirth] = useState("");
  const [marks, setMarks] = useState<boolean[]>(() => t.pactoItems.map(() => false));
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  useEffect(() => {
    setBirth(knownBirth());
  }, []);
  const iso = parseBirth(birth);
  const age = iso ? ageFromBirth(iso) : null;
  const tooYoung = age !== null && age < 16;
  const ready = Boolean(iso && age !== null && age >= 16 && marks.every(Boolean));
  function toggle(index: number) {
    setMarks((current) => current.map((item, i) => (i === index ? !item : item)));
  }
  function accept() {
    if (!iso || !ready) return;
    keepBirth(iso);
    writePact();
    void savePacto({ data: { version: PACTO_VERSION } }).catch(() => undefined);
    window.location.assign(takePactNext());
  }
  return (
    <StoryShell>
      <section className="house-block pacto">
        <p className="soon-kicker">{t.pactoLink}</p>
        <h1>{t.pactoTitle}</h1>
        <label>
          {t.pactoDate}
          <input
            value={birth}
            placeholder={t.pactoHint}
            inputMode="numeric"
            autoComplete="bday"
            onChange={(event) => setBirth(maskBirth(event.target.value))}
          />
        </label>
        {tooYoung ? <p>{t.ageYoung}</p> : null}
        <ul>
          {t.pactoItems.map((item, index) => (
            <li key={item}>
              <label className="soon-check">
                <input type="checkbox" checked={marks[index]} onChange={() => toggle(index)} />
                <span>
                  {index === t.pactoItems.length - 1 ? (
                    lang === "en" ? (
                      <>
                        I have read and accept the <a href="/regras">Community rules</a>, the <a href="/termos">Terms</a> and the <a href="/privacidade">Privacy</a> policy.
                      </>
                    ) : lang === "es" ? (
                      <>
                        Leí y acepto las <a href="/regras">Reglas de la comunidad</a>, los <a href="/termos">Términos</a> y la <a href="/privacidade">Privacidad</a>.
                      </>
                    ) : (
                      <>
                        Li e aceito as <a href="/regras">Regras da Comunidade</a>, os <a href="/termos">Termos</a> e a <a href="/privacidade">Privacidade</a>.
                      </>
                    )
                  ) : (
                    item
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button type="button" disabled={!ready} onClick={accept}>
          {t.pactoAccept}
        </button>
        <p className="house-note">{t.pactoFine}</p>
      </section>
    </StoryShell>
  );
}

function maskBirth(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}
