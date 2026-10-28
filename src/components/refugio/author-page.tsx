import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadAuthor, myAuthorProfile, saveAuthorProfile, toggleFollow } from "@/lib/refugio/author-cloud";
import { authorSlug, type Lang } from "@/lib/refugio/stories";
import { useShelf } from "@/components/refugio/use-shelf";
import { MoonCount, TipBox } from "@/components/refugio/shop-page";

export function AuthorPage({ slug, initialLang }: { slug: string; initialLang?: Lang }) {
  const { lang, setLang, t } = useHouse();
  const shelf = useShelf(lang);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof loadAuthor>> | null>(null);
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  useEffect(() => {
    let cancel = false;
    void loadAuthor({ data: { slug } })
      .then((result) => {
        if (!cancel) setProfile(result);
      })
      .catch(() => {
        if (!cancel) setProfile({ found: false });
      });
    return () => {
      cancel = true;
    };
  }, [slug]);
  const stories = shelf.filter((story) => authorSlug(story.author) === slug);
  if (!profile) {
    return (
      <StoryShell>
        <section className="house-hero">
          <p className="soon-kicker">{t.brand}</p>
        </section>
      </StoryShell>
    );
  }
  if (!profile.found) {
    return (
      <StoryShell>
        <section className="house-hero">
          <h1>{t.authorMissing}</h1>
          <a href="/historias">{t.back}</a>
        </section>
      </StoryShell>
    );
  }
  const author = profile.profile;
  return (
    <StoryShell>
      <section className="house-hero author-head">
        <img className="author-photo" src={author.foto} alt="" width={96} height={96} />
        <div>
          {author.fundadora ? <p className="soon-kicker">{t.founder}</p> : null}
          <h1>{author.nome}</h1>
          <p className="soon-lead">{author.bio}</p>
          <p className="house-note">
            {author.followers} {t.followers}
          </p>
          <MoonCount authorSlug={author.slug} />
          <FollowButton slug={author.slug} following={author.following} onChange={(followers, following) => {
            setProfile({ found: true, profile: { ...author, followers, following } });
          }} />
        </div>
      </section>
      <section className="house-block">
        <h2>{t.authorStories}</h2>
        <div className="story-list">
          {stories.map((story) => (
            <a key={story.slug} className="story-card" href={`/historia/${story.slug}`}>
              {story.art ? <img className="story-poster" src={story.art} alt="" /> : null}
              <span className="soon-kicker">{story.place}</span>
              <strong>{story.title}</strong>
              <p>{story.synopsis}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="house-block">
        <TipBox authorSlug={author.slug} />
      </section>
    </StoryShell>
  );
}

function FollowButton({
  slug,
  following,
  onChange,
}: {
  slug: string;
  following: boolean;
  onChange: (followers: number, following: boolean) => void;
}) {
  const { t } = useHouse();
  const { user } = useCurrentUserState();
  const [note, setNote] = useState("");
  if (!user || user.isDevFallback) {
    return (
      <p>
        <a className="house-primary" href="/#entrar">{t.follow}</a>
      </p>
    );
  }
  return (
    <p>
      <button
        type="button"
        className="house-primary"
        onClick={() => {
          setNote("");
          void toggleFollow({ data: { slug } })
            .then((result) => {
              if (!result.ok) {
                setNote(t.authorNeed);
                return;
              }
              onChange(result.followers, result.following);
            })
            .catch(() => setNote(t.authorNeed));
        }}
      >
        {following ? t.following : t.follow}
      </button>
      {note ? <span className="house-note"> {note}</span> : null}
    </p>
  );
}

export function AuthorEditor() {
  const { t, lang } = useHouse();
  const { user } = useCurrentUserState();
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [own, setOwn] = useState(false);
  const [note, setNote] = useState("");
  const [slug, setSlug] = useState("");
  useEffect(() => {
    void myAuthorProfile()
      .then((result) => {
        if (!result.profile) return;
        setNome(result.profile.nome);
        setBio(result.profile.bio);
        setFoto(result.profile.foto);
        setSlug(result.profile.slug);
        setOwn(Boolean(result.profile.foto));
      })
      .catch(() => undefined);
  }, []);
  if (!user || user.isDevFallback) {
    return (
      <section className="house-block">
        <h2>{t.authorEdit}</h2>
        <p>{t.authorNeed}</p>
        <p className="house-note">{t.authorPhotoWarn}</p>
      </section>
    );
  }
  return (
    <section className="house-block">
      <h2>{t.authorEdit}</h2>
      <p className="house-note">{t.authorPhotoWarn}</p>
      <form
        className="soon-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (foto && foto.startsWith("data:") && !own) {
            setNote(t.authorPhotoOwn);
            return;
          }
          setNote("");
          void saveAuthorProfile({ data: { nome, bio, foto, idioma: lang } })
            .then((result) => {
              if (!result.ok) {
                setNote(result.reason === "foto" ? t.authorPhotoBig : t.authorPen);
                return;
              }
              setSlug(result.slug);
              setNote(t.authorSaved);
            })
            .catch(() => setNote(t.authorNeed));
        }}
      >
        <label>
          {t.authorPen}
          <input required minLength={2} maxLength={40} value={nome} onChange={(event) => setNome(event.target.value)} />
        </label>
        <label>
          {t.authorBio}
          <textarea maxLength={300} rows={4} value={bio} onChange={(event) => setBio(event.target.value)} />
        </label>
        <label>
          {t.authorPhoto}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
                setFoto(null);
                setNote(t.authorPhotoBig);
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const value = typeof reader.result === "string" ? reader.result : null;
                setFoto(value);
                setOwn(false);
                setNote("");
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {foto ? <img className="author-photo" src={foto} alt="" width={72} height={72} /> : null}
        <label className="soon-check">
          <input type="checkbox" checked={own} onChange={(event) => setOwn(event.target.checked)} />
          <span>{t.authorPhotoOwn}</span>
        </label>
        <button type="submit">{t.authorEdit}</button>
      </form>
      {note ? <p>{note}</p> : null}
      {slug ? <p><a href={`/autora/${slug}`}>{nome || slug}</a></p> : null}
    </section>
  );
}
