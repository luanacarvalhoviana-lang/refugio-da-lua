// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, Route, Switch, useLocation, useRoute } from "@/components/refugio/router";
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, Crown, BookHeart, Check, ChevronRight, CircleHelp,
  Heart, Home, Droplets, Leaf, Loader2, LockKeyhole, LogOut, Mail, MapPin, Menu, Moon,
  MoreHorizontal, PencilLine, Pause, Play, Plus, Settings, Search, ShieldCheck, ShieldAlert,
  Sparkles, Star, SunMedium, Volume2, UserRound, X, Sprout,
} from "lucide-react";
import { Button } from "@/components/refugio/button";
import CheckoutModal from "@/components/refugio/checkout-modal";
import { vipPlanCatalog, hasVipAccess, freePlanBenefits, hourBuckets, emptyEntitlements, weeklyLetterLimit, REST_MESSAGE, emotionOptions } from "@/lib/refugio/vip";
import { avatars, papers, seals, envelopes, letterFonts } from "@/lib/refugio/collection";
import { CollectionPicker, EmpathyTree, IslandTree, MuralVipFilters, ScreenshotGuard, WeeklyChart, AmazonGrove, AmazonGrovePreview, seedToastLabel, EnvelopeAdvice, StylePicker } from "@/components/refugio/vip-surfaces";
import { useEntitlements } from "@/lib/refugio/use-entitlements";
import { trpc } from "@/lib/refugio/trpc";
import { addLocalDiary, addLocalMemory, loadLocalDiary, loadLocalFavorites, loadLocalMemories, toggleLocalFavorite } from "@/lib/refugio/localGarden";
import { peaceSounds } from "@/lib/refugio/sounds";
import { useRefugioStore, isValidNickname } from "@/lib/refugio/store";
import { listPresenceSeals } from "@/lib/refugio/seals";
import { CarePage } from "@/components/refugio/care-page";
import { ScreenProtect } from "@/components/refugio/screen-protect";
import { muralTopics, writeTopics } from "@/lib/refugio/topics";
import { reviewLetterText, canPublish } from "@/lib/refugio/letterReview";
import { pickNightLetters, moonPhaseLabel } from "@/lib/refugio/nightLetter";
import { dewPhase } from "@/lib/refugio/dew";
import { lunaGardenLine } from "@/lib/refugio/luna";
import { AboutPage, PrivacyPage, TermsPage } from "@/components/refugio/public-info";
import { ThemeToggle } from "@/components/refugio/theme-toggle";
import { MoonMascot, LunaCompanion } from "@/components/refugio/moon-mascot";
import { PeacePlayer } from "@/components/refugio/peace-player";
import { WelcomeSplash } from "@/components/refugio/welcome-splash";
import { useAuth, startLogin } from "@/lib/refugio/use-auth";
import { useGardenSync } from "@/lib/refugio/garden-sync";
import { useLiveNotices } from "@/lib/refugio/live-notices";
import { useMuralLetters } from "@/lib/refugio/use-mural";
import { askNoticePermission } from "@/lib/refugio/notify";
import { sendContactNote } from "@/lib/refugio/contact-cloud";
import { energyKinds, energyLabel } from "@/lib/refugio/energies";
import { authEnabled, signIn, signInGoogle, signInEmail, signUpEmail, requestPasswordReset, confirmPasswordReset } from "@/lib/auth/client";
import { registerRefugioPwa, useInstallPrompt } from "@/lib/refugio/pwa";

var logo = "/icons/logo.png";
var cards = [
	{
		id: "carta-1",
		title: "Hoje eu consegui respirar um pouco melhor",
		author: "Maré Serena",
		initials: "MS",
		topic: "Pequenas vitórias",
		time: "há 12 min",
		excerpt: "Não foi um dia perfeito, mas encontrei uma janela de calma entre uma coisa e outra. Estou aprendendo a reconhecer esses pequenos espaços.",
		color: "lavender",
		energy: 18
	},
	{
		id: "carta-2",
		title: "Quando o corpo pede uma pausa",
		author: "Nuvem Baixa",
		initials: "NB",
		topic: "Burnout",
		time: "há 28 min",
		excerpt: "Escrevo daqui, do sofá, tentando não transformar descanso em culpa. Talvez hoje o cuidado seja justamente não produzir nada.",
		color: "blue",
		energy: 31
	},
	{
		id: "carta-3",
		title: "Queria aprender a ficar sem me diminuir",
		author: "Jardim Aberto",
		initials: "JA",
		topic: "Relacionamentos",
		time: "há 1 h",
		excerpt: "Estou tentando entender que pedir espaço não é abandonar ninguém. Que caber em mim também é uma forma de amor.",
		color: "peach",
		energy: 12
	},
	{
		id: "carta-4",
		title: "Guardei o chá e abri a janela",
		author: "Girassol sereno",
		initials: "GS",
		topic: "Autocuidado",
		time: "há 2 h",
		excerpt: "Deixei o dia ser só isso por um minuto. O chá, a janela, o corpo ainda aqui.",
		color: "lavender",
		energy: 9
	},
	{
		id: "carta-5",
		title: "A casa ficou grande demais depois",
		author: "Lua Quente",
		initials: "LQ",
		topic: "Luto",
		time: "há 4 h",
		excerpt: "Ainda falo no plural, por costume. Estou aprendendo o singular com cuidado.",
		color: "blue",
		energy: 44
	},
	{
		id: "carta-6",
		title: "O trabalho cabe, eu que não estou cabendo",
		author: "Porta Entreaberta",
		initials: "PE",
		topic: "Trabalho",
		time: "ontem",
		excerpt: "Entrego tudo no prazo e mesmo assim sinto que estou atrasada da minha própria vida.",
		color: "peach",
		energy: 21
	}
];
var topics = muralTopics;
function Logo({ compact = true }) {
	return /* @__PURE__ */ jsxs(Link, {
		href: "/inicio",
		className: `brand ${compact ? "brand-compact" : ""}`,
		"aria-label": "Voltar ao início",
		children: [/* @__PURE__ */ jsx("img", {
			src: "/icons/brand-v3-192.png",
			alt: ""
		}), /* @__PURE__ */ jsx("span", {
			children: /* @__PURE__ */ jsx("strong", { children: "Refúgio" })
		})]
	});
}
function BrandMark() {
	const theme = useRefugioStore((s) => s.theme);
	const src = theme === "night" ? "/icons/logo-night-sm.png" : "/icons/logo-day-sm.png";
	return /* @__PURE__ */ jsx("img", {
		className: "brand-hero-mark",
		src,
		alt: "Refúgio da Lua",
		width: "240",
		height: "240",
		decoding: "async"
	});
}
function IconButton({ label, children, onClick }) {
	return /* @__PURE__ */ jsx("button", {
		className: "icon-button",
		"aria-label": label,
		onClick,
		children
	});
}
function App() {
	const [location, navigate] = useLocation();
	const auth = useAuth();
	useGardenSync();
	useLiveNotices();
	const loggedIn = useRefugioStore((s) => s.loggedIn);
	const nickChosen = useRefugioStore((s) => s.nickChosen);
	const [userName, setUserName] = useState("Girassol sereno");
	const [isAnonymous, setIsAnonymous] = useState(false);
	const storedName = useRefugioStore((s) => s.userName);
	const storedAnon = useRefugioStore((s) => s.isAnonymous);
	const unreadCount = useRefugioStore((s) => s.notices.filter((item) => !item.read).length);
	const [onboarded, setOnboarded] = useState(false);
	const [draft, setDraft] = useState("");
	const [published, setPublished] = useState(false);
	const [toast, setToast] = useState("");
	const [favorites, setFavorites] = useState(() => typeof window === "undefined" ? [] : loadLocalFavorites());
	const [audioPlaying, setAudioPlaying] = useState(false);
	const vip = useEntitlements();
	const storeLoggedIn = useRefugioStore((s) => s.loggedIn);
	const signedIn = Boolean(auth.user) || storeLoggedIn;
	const remoteFavorites = trpc.vip.favorites.useQuery(undefined, {
		enabled: Boolean(auth.user),
		retry: false
	});
	const toggleFavoriteMutation = trpc.vip.toggleFavorite.useMutation({ onSuccess: (_data, variables) => {
		setFavorites((current) => current.includes(variables.letterId) ? current.filter((item) => item !== variables.letterId) : [...current, variables.letterId]);
	} });
	useEffect(() => {
		registerRefugioPwa();
		useRefugioStore.getState().evaporateDue();
	}, []);
	useEffect(() => {
		if (storedName) setUserName(storedName);
	}, [storedName]);
	useEffect(() => {
		setIsAnonymous(storedAnon);
	}, [storedAnon]);
	useEffect(() => {
		if (remoteFavorites.data) setFavorites(remoteFavorites.data);
	}, [remoteFavorites.data]);
	const handleFavorite = (id) => {
		if (auth.user) {
			toggleFavoriteMutation.mutate({ letterId: id });
			return;
		}
		setFavorites(toggleLocalFavorite(id));
	};
	const storePactOk = useRefugioStore((s) => s.pactOk);
	const acceptPact = useRefugioStore((s) => s.acceptPact);
	const pactOk = storePactOk;
	useEffect(() => {
		if (auth.pending) return;
		const open = new Set([
			"/", "/inicio", "/mapa", "/sobre", "/privacidade", "/termos", "/instalar",
			"/apoio", "/contato", "/mural-publico", "/onboarding/pacto",
			"/conta", "/login", "/conta/recuperar-senha", "/conta/redefinir-senha",
		]);
		const allowed = open.has(location) || location.startsWith("/carta/");
		const signedIn = Boolean(auth.user || loggedIn);
		if (signedIn && !pactOk && location !== "/onboarding/pacto") {
			navigate("/onboarding/pacto");
			return;
		}
		if (!pactOk) {
			if (!allowed) navigate("/onboarding/pacto");
			return;
		}
		if (!signedIn) {
			if (!allowed) navigate("/conta");
			return;
		}
		if (location === "/" || location === "/inicio" || location === "/login") {
			navigate(nickChosen ? "/mural" : "/onboarding/perfil");
			return;
		}
		if (!nickChosen && location !== "/onboarding/perfil" && location !== "/conta" && location !== "/onboarding/pacto") {
			navigate("/onboarding/perfil");
		}
	}, [auth.pending, auth.user, loggedIn, location, nickChosen, pactOk, navigate]);
	const theme = useRefugioStore((s) => s.theme);
	const protectScreen = useRefugioStore((s) => s.protectScreen);
	useEffect(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);
	const go = (path) => navigate(path);
	const showToast = (message) => {
		setToast(message);
		window.setTimeout(() => setToast(""), 3200);
	};
	const markPact = () => {
		window.localStorage.setItem("refugio-age-ok", "18");
		acceptPact();
	};
	const enterAs = (anonymous = false) => {
		if (anonymous) {
			useRefugioStore.getState().enterAnonymous();
			setIsAnonymous(true);
			setOnboarded(true);
		} else {
			startLogin();
			setIsAnonymous(false);
			setOnboarded(true);
		}
		const session = useRefugioStore.getState();
		if (!anonymous && !pactOk) go("/onboarding/pacto");
		else if (!anonymous && !session.nickChosen && !isValidNickname(session.userName, session.email)) go("/onboarding/perfil");
		else go(pactOk ? "/mural" : "/onboarding/pacto");
	};
	if (!pactOk && !(/* @__PURE__ */ new Set([
		"/",
		"/inicio",
		"/mapa",
		"/sobre",
		"/privacidade",
		"/termos",
		"/instalar",
		"/conta",
		"/conta/recuperar-senha",
		"/conta/redefinir-senha",
		"/login",
		"/apoio",
		"/contato",
		"/onboarding/pacto",
		"/mural-publico"
	])).has(location) && !location.startsWith("/carta/")) return /* @__PURE__ */ jsxs("div", {
		className: `app-root theme-${theme ?? "day"}`,
		children: [/* @__PURE__ */ jsx(Pact, { onContinue: () => {
			markPact();
			go("/conta");
		} })]
	});
	const inShell = [
		"/mural",
		"/jardim",
		"/escrever",
		"/cuidar",
		"/perfil",
		"/configuracoes",
		"/diario",
		"/selos",
		"/memorias",
		"/planos",
		"/apoio",
		"/notificacoes"
	].some((route) => location === route || location.startsWith(`${route}/`));
	return /* @__PURE__ */ jsxs("div", {
		className: `app-root theme-${theme ?? "day"}`,
		children: [
			inShell && /* @__PURE__ */ jsx(AppShell, {
				userName,
				anonymous: isAnonymous,
				notifications: unreadCount,
				onNotifications: () => {
					go("/notificacoes");
				},
				onNavigate: go,
				onLogout: () => {
					auth.logout().catch(() => undefined);
					setIsAnonymous(false);
					setOnboarded(false);
					go("/inicio");
				}
			}),
			/* @__PURE__ */ jsx("main", {
				className: inShell ? "app-main with-shell" : "app-main",
				children: /* @__PURE__ */ jsxs(Switch, { children: [
					/* @__PURE__ */ jsx(Route, {
						path: "/",
						children: /* @__PURE__ */ jsx(Landing, {
							onEnter: () => go("/conta"),
							onExplore: () => go("/mural-publico")
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/inicio",
						children: /* @__PURE__ */ jsx(Landing, {
							onEnter: () => go("/conta"),
							onExplore: () => go("/mural-publico")
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/mapa",
						children: /* @__PURE__ */ jsx(Landing, {
							onEnter: () => go("/conta"),
							onExplore: () => go("/mural-publico")
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/sobre",
						children: /* @__PURE__ */ jsx(AboutPage, {})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/privacidade",
						children: /* @__PURE__ */ jsx(PrivacyPage, {})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/termos",
						children: /* @__PURE__ */ jsx(TermsPage, {})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/instalar",
						children: /* @__PURE__ */ jsx(InstallHelp, {})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/conta",
						children: /* @__PURE__ */ jsx(Auth, {
							onLogin: () => enterAs(false),
							onAnonymous: () => go("/mural-publico"),
							onBack: () => go("/inicio")
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/conta/recuperar-senha",
						children: /* @__PURE__ */ jsx(Recover, { onBack: () => go("/conta") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/conta/redefinir-senha",
						children: /* @__PURE__ */ jsx(ResetPassword, { onBack: () => go("/conta") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/onboarding/pacto",
						children: /* @__PURE__ */ jsx(Pact, { onContinue: () => {
							markPact();
							go("/conta");
						} })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/onboarding/perfil",
						children: /* @__PURE__ */ jsx(ProfileSetup, {
							name: userName,
							setName: setUserName,
							onFinish: () => {
								setOnboarded(true);
								go("/mural");
							}
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/mural-publico",
						children: /* @__PURE__ */ jsx(PublicMural, {
							onEnter: () => go("/conta"),
							onCard: (id) => go(`/carta/${id}`)
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/mural",
						children: /* @__PURE__ */ jsx(Mural, {
							userName,
							anonymous: isAnonymous,
							favorites,
							onFavorite: handleFavorite,
							onWrite: () => go("/escrever"),
							onCard: (id) => go(`/carta/${id}`),
							onEnergy: () => showToast("Energia enviada com carinho"),
							onViewAll: () => showToast("Você já está vendo todas as cartas disponíveis"),
							entitlements: vip.entitlements
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/carta/:id",
						children: /* @__PURE__ */ jsx(CardDetail, {
							onBack: () => go("/mural"),
							onEnergy: (grew) => showToast(grew ? "Uma energia chegou no seu Bosque. A semente agradece." : "Energia enviada · alguém recebeu seu cuidado"),
							onDew: () => showToast("Uma gota de orvalho caiu no jardim de quem te ouviu."),
							onAdvice: (seed) => {
								const name = seedToastLabel(seed);
								const planNow = useRefugioStore.getState().plan;
								if (name) showToast(`Conselho enviado · você ganhou uma semente de ${name}`);
								else if (planNow === "annual") showToast("Conselho enviado. Você já tem todas as sementes da floresta.");
								else showToast("Conselho enviado · gotas e energias fazem a sua árvore crescer.");
							},
							onRetire: (destiny) => showToast(destiny === "humus" ? "Sua carta virou húmus no jardim." : "Sua carta foi para o diário privado.")
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/escrever",
						children: /* @__PURE__ */ jsx(Write, {
							draft,
							setDraft,
							anonymous: isAnonymous,
							onCancel: () => go("/mural"),
							onPublish: () => {
								setPublished(true);
								go("/escrever/confirmacao");
							},
							onSave: () => {
								addLocalDiary(draft || "Rascunho guardado no Jardim.");
								showToast("Rascunho guardado no seu diário");
								go("/jardim");
							},
							onAskLogin: () => go("/conta"),
							entitlements: vip.entitlements,
							plan: vip.plan ?? "free"
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/escrever/confirmacao",
						children: /* @__PURE__ */ jsx(Confirmation, {
							onMural: () => go("/mural"),
							onGarden: () => go("/jardim"),
							published
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/jardim",
						children: /* @__PURE__ */ jsx(Garden, {
							anonymous: isAnonymous,
							onAction: (path) => go(path),
							onSync: () => {
								setIsAnonymous(false);
								go("/conta");
							},
							entitlements: vip.entitlements
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/cuidar",
						children: /* @__PURE__ */ jsx(CareHub, { onNavigate: go })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/diario",
						children: /* @__PURE__ */ jsx(Diary, {
							draft,
							onBack: () => go("/jardim"),
							onSaved: () => showToast("Nova anotação guardada no seu diário"),
							authenticated: signedIn,
							entitlements: vip.entitlements
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/selos",
						children: /* @__PURE__ */ jsx(Badges, { onBack: () => go("/jardim") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/memorias",
						children: /* @__PURE__ */ jsx(Memories, {
							onBack: () => go("/jardim"),
							authenticated: signedIn,
							entitlements: vip.entitlements
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/planos",
						children: /* @__PURE__ */ jsx(Plans, {
							onBack: () => go("/cuidar"),
							audioPlaying,
							onToggleAudio: () => setAudioPlaying(!audioPlaying),
							userEmail: auth.user?.email ?? "",
							userName: auth.user?.name ?? userName
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/notificacoes",
						children: /* @__PURE__ */ jsx(Notifications, { onBack: () => go("/mural") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/apoio",
						children: /* @__PURE__ */ jsx(Support, { onBack: () => go("/jardim") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/contato",
						children: /* @__PURE__ */ jsx(Contact, { onBack: () => go("/inicio") })
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/perfil",
						children: /* @__PURE__ */ jsx(Profile, {
							name: userName,
							onBack: () => go("/mural"),
							onEdit: () => showToast("Escolha salva no seu Jardim"),
							entitlements: vip.entitlements,
							plan: vip.plan ?? "free"
						})
					}),
					/* @__PURE__ */ jsx(Route, {
						path: "/configuracoes",
						children: /* @__PURE__ */ jsx(SettingsPage, {
							onBack: () => go("/mural"),
							onLogout: () => {
								setIsAnonymous(false);
								go("/inicio");
							}
						})
					}),
					/* @__PURE__ */ jsx(Route, { children: /* @__PURE__ */ jsx(NotFound, { onHome: () => go("/inicio") }) })
				] })
			}),
			/* @__PURE__ */ jsx(ScreenProtect, { vipGuard: Boolean(vip.entitlements.screenshotGuard) }),
			toast && /* @__PURE__ */ jsxs("div", {
				className: "toast",
				role: "status",
				children: [/* @__PURE__ */ jsx(Check, { size: 17 }), toast]
			}),
		]
	});
}
function Landing({ onEnter, onExplore }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "public-page landing-page",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "topbar public-topbar page-wrap",
				children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsxs("div", {
					className: "topbar-actions",
					children: [/* @__PURE__ */ jsx(ThemeToggle, { compact: true }), /* @__PURE__ */ jsx(Link, {
						href: "/onboarding/pacto",
						className: "text-link",
						children: "Pacto"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/privacidade",
						className: "text-link",
						children: "Privacidade"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/conta",
						className: "button button-small",
						children: "Entrar"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "hero-grid page-wrap",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "hero-copy",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "eyebrow",
							children: [/* @__PURE__ */ jsx("span", { className: "eyebrow-dot" }), " um lugar para pousar"]
						}),
						/* @__PURE__ */ jsx(BrandMark, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-with-luna",
							children: [
								/* @__PURE__ */ jsxs("h1", { className: "hero-line slogan", children: [
									"Seu lugar de ",
									/* @__PURE__ */ jsx("em", { className: "gold", children: "paz" }),
									" em meio ao ",
									/* @__PURE__ */ jsx("em", { className: "blue", children: "caos" }),
									"."
								] })
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "hero-lead",
							children: "Escreva, respire e encontre companhia em noites difíceis — sem ranking, sem julgamento."
						}),
						/* @__PURE__ */ jsx(LunaCompanion, { scene: "landing", size: 88 }),
						/* @__PURE__ */ jsxs("div", {
							className: "hero-actions",
							children: [/* @__PURE__ */ jsx(Link, {
								href: "/conta",
								className: "button button-primary button-large",
								children: "Entrar no Refúgio"
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/mural-publico",
								className: "button-quiet",
								children: ["Olhar o mural ", /* @__PURE__ */ jsx(ChevronRight, { size: 16 })]
							}), /* @__PURE__ */ jsx(Link, {
								href: "/instalar",
								className: "button-quiet",
								children: "Baixar o app"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "trust-note",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 16 }), /* @__PURE__ */ jsx("span", { children: "Privacidade primeiro · você decide o que fica só seu" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "landing-strip page-wrap",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "strip-kicker",
					children: "COMO FUNCIONA"
				}), /* @__PURE__ */ jsx("h2", { children: "Um cuidado de cada vez." })] }), /* @__PURE__ */ jsxs("div", {
					className: "strip-steps",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("b", { children: "01" }),
							/* @__PURE__ */ jsx("strong", { children: "Coloque para fora" }),
							/* @__PURE__ */ jsx("span", { children: "Escreva sem precisar encontrar as palavras perfeitas." })
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("b", { children: "02" }),
							/* @__PURE__ */ jsx("strong", { children: "Encontre presença" }),
							/* @__PURE__ */ jsx("span", { children: "Leia cartas e envie uma energia para alguém." })
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("b", { children: "03" }),
							/* @__PURE__ */ jsx("strong", { children: "Cultive seu Jardim" }),
							/* @__PURE__ */ jsx("span", { children: "Acompanhe o que você está construindo por dentro." })
						] })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "landing-vip page-wrap",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", { className: "eyebrow", children: "refúgio vip" }),
						/* @__PURE__ */ jsx("h2", { children: "Um jardim com mais espaço." }),
						/* @__PURE__ */ jsx("p", { children: "No Mensal, a árvore da Mata e até cinco conselhos por dia. No Anual, o bosque amazônico, sons de paz e a caixa da memória. O mural e o cuidado de crise continuam livres." })
					] }),
					/* @__PURE__ */ jsxs(Button, {
						className: "button button-primary",
						onClick: onEnter,
						children: ["Entrar para ver os planos ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "landing-institutional page-wrap",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "institutional-intro",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "eyebrow",
								children: "institucional"
							}),
							/* @__PURE__ */ jsx("h2", { children: "Quem cuida deste espaço." }),
							/* @__PURE__ */ jsx("p", { children: "O Refúgio da Lua é uma plataforma de acolhimento, escrita e autocuidado. Não é consultório, emergência nem rede social de exposição. Aqui, cada pessoa escolhe o que quer guardar e o que quer compartilhar." })
						]
					}),
					/* @__PURE__ */ jsxs("aside", {
						className: "age-callout",
						children: [/* @__PURE__ */ jsx(ShieldAlert, { size: 22 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Este ambiente não é para menores de 18 anos." }), /* @__PURE__ */ jsx("p", { children: "O mural fala de luto, burnout, relacionamentos e noites difíceis. A confirmação de idade acontece junto do Pacto de Empatia, antes de chegar às cartas." })] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "institutional-grid",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								href: "/sobre",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(Moon, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Sobre o Refúgio" }),
									/* @__PURE__ */ jsx("span", { children: "O que somos, o que não somos e como o cuidado acontece aqui." })
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/privacidade",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(LockKeyhole, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Privacidade" }),
									/* @__PURE__ */ jsx("span", { children: "Seus dados, o que fica só seu e o que pode aparecer no mural." })
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/termos",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(ShieldCheck, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Termos e convivência" }),
									/* @__PURE__ */ jsx("span", { children: "As regras que sustentam escuta, respeito e responsabilidade." })
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/onboarding/pacto",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(Heart, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Pacto de empatia" }),
									/* @__PURE__ */ jsx("span", { children: "O acordo de escuta, respeito e 18 anos, antes do mural." })
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/apoio",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(Heart, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Apoio imediato" }),
									/* @__PURE__ */ jsx("span", { children: "CVV 188 e caminhos de ajuda profissional em uma crise." })
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/contato",
								className: "info-tile",
								children: [
									/* @__PURE__ */ jsx(Mail, { size: 18 }),
									/* @__PURE__ */ jsx("strong", { children: "Fale com o Refúgio" }),
									/* @__PURE__ */ jsx("span", { children: "Relatar uma carta, um problema no site ou falar com a gente." })
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "public-footer page-wrap",
				children: [/* @__PURE__ */ jsx("span", { children: "© 2026 Refúgio da Lua" }), /* @__PURE__ */ jsxs("nav", {
					className: "footer-links",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: "/sobre",
							children: "Sobre"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/onboarding/pacto",
							children: "Pacto"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/privacidade",
							children: "Privacidade"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/termos",
							children: "Termos"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/apoio",
							children: "Apoio"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/contato",
							children: "Contato"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/instalar",
							children: "Instalar app"
						})
					]
				})]
			})
		]
	});
}
function Auth({ onLogin, onAnonymous, onBack }) {
	const [tab, setTab] = useState("login");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const googleIn = () => {
		setError("");
		void signInGoogle({ callbackURL: "/inicio", errorCallbackURL: "/conta" }).catch((err) => {
			setError(err instanceof Error ? err.message : "Não foi possível entrar com o Google.");
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "auth-page public-page",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "auth-header page-wrap",
			children: [/* @__PURE__ */ jsxs("button", {
				className: "back-link",
				onClick: onBack,
				children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar"]
			}), /* @__PURE__ */ jsx(Logo, { compact: true })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "auth-layout page-wrap",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "auth-intro",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ jsx(Moon, { size: 14 }), " seu lugar de paz"]
					}),
					/* @__PURE__ */ jsx("h1", { children: tab === "login" ? "Bom te ver por aqui." : "Guarde seu Jardim." }),
					/* @__PURE__ */ jsx("p", { children: tab === "login" ? "Entre para reencontrar suas cartas, energias e um espaço que é só seu." : "Crie uma conta para levar seu cuidado com você, onde estiver." }),
					/* @__PURE__ */ jsxs("button", {
						className: "anonymous-link",
						onClick: onAnonymous,
						children: ["Olhar o mural sem conta ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "auth-card",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "tabs",
						role: "tablist",
						children: [/* @__PURE__ */ jsx("button", {
							role: "tab",
							"aria-selected": tab === "login",
							className: tab === "login" ? "active" : "",
							onClick: () => setTab("login"),
							children: "Entrar"
						}), /* @__PURE__ */ jsx("button", {
							role: "tab",
							"aria-selected": tab === "register",
							className: tab === "register" ? "active" : "",
							onClick: () => setTab("register"),
							children: "Criar conta"
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						className: "google-button",
						type: "button",
						onClick: googleIn,
						children: [/* @__PURE__ */ jsx("span", { children: "G" }), " Continuar com Google"]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "divider",
						children: /* @__PURE__ */ jsx("span", { children: "ou use seu e-mail" })
					}),
					/* @__PURE__ */ jsxs("form", {
						noValidate: true,
						onSubmit: (e) => {
							e.preventDefault();
							setError("");
							const form = e.currentTarget;
							const email = String(form.elements.namedItem("email")?.value || "").trim();
							const password = String(form.elements.namedItem("password")?.value || "");
							const name = String(form.elements.namedItem("name")?.value || "").trim() || "Girassol sereno";
							const isAdult = tab === "register" ? Boolean(form.elements.namedItem("isAdult")?.checked) : true;
							if (!email || !email.includes("@")) {
								setError("Escreva um e-mail para entrar.");
								return;
							}
							if (password.length < 8) {
								setError("A senha precisa ter pelo menos 8 caracteres.");
								return;
							}
							if (tab === "register" && !isAdult) {
								setError("Aceite os Termos e a Privacidade para criar a conta.");
								return;
							}
							setPending(true);
							const run = tab === "register"
								? signUpEmail({ name, email, password })
								: signInEmail(email, password);
							void run.then(() => {
								useRefugioStore.getState().login({ email, name });
								onLogin();
							}).catch((err) => {
								setError(err instanceof Error ? err.message : "Não foi possível entrar com e-mail.");
							}).finally(() => setPending(false));
						},
						children: [
							tab === "register" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "auth-name",
								children: "Como podemos chamar você?"
							}), /* @__PURE__ */ jsx("input", {
								id: "auth-name",
								name: "name",
								placeholder: "Seu pseudônimo",
								autoComplete: "nickname"
							})] }),
							/* @__PURE__ */ jsx("label", {
								htmlFor: "auth-email",
								children: "E-mail"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "input-with-icon",
								children: [/* @__PURE__ */ jsx(Mail, { size: 17 }), /* @__PURE__ */ jsx("input", {
									id: "auth-email",
									name: "email",
									type: "email",
									placeholder: "voce@email.com",
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ jsx("label", {
								htmlFor: "auth-password",
								children: "Senha"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "input-with-icon",
								children: [
									/* @__PURE__ */ jsx(LockKeyhole, { size: 17 }),
									/* @__PURE__ */ jsx("input", {
										id: "auth-password",
										name: "password",
										type: showPassword ? "text" : "password",
										placeholder: "Pelo menos 8 caracteres",
										autoComplete: tab === "login" ? "current-password" : "new-password"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": showPassword ? "Ocultar senha" : "Visualizar senha",
										onClick: () => setShowPassword(!showPassword),
										children: /* @__PURE__ */ jsx(MoreHorizontal, { size: 18 })
									})
								]
							}),
							tab === "register" && /* @__PURE__ */ jsxs("label", {
								className: "check-row",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									name: "isAdult",
									required: true
								}), /* @__PURE__ */ jsxs("span", { children: [
									"Aceito os ",
									/* @__PURE__ */ jsx("a", {
										href: "/termos",
										children: "Termos"
									}),
									" e a ",
									/* @__PURE__ */ jsx("a", {
										href: "/privacidade",
										children: "Privacidade"
									}),
									". A idade e o Pacto vêm na próxima tela."
								] })]
							}),
							error && /* @__PURE__ */ jsx("p", {
								className: "checkout-error",
								role: "alert",
								children: error
							}),
							tab === "login" && /* @__PURE__ */ jsx(Link, {
								href: "/conta/recuperar-senha",
								className: "forgot-link",
								children: "Esqueci minha senha"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "secure-note",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 15 }), " O Google só confirma seu nome e e-mail. Não abrimos Gmail, fotos, contatos nem arquivos. Com outro e-mail, a caixa de entrada também continua só sua."]
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: pending,
								className: "button button-primary full-button",
								children: [pending ? "Aguarde..." : tab === "login" ? "Entrar no Refúgio" : "Criar minha conta", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "auth-optional",
						children: "A conta é opcional. Depois disto vem o Pacto de Empatia, com o aviso de 18 anos."
					})
				]
			})]
		})]
	});
}
function Recover({ onBack }) {
	const [sent, setSent] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "center-page public-page",
		children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsxs("div", {
			className: "simple-card",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "icon-disc",
					children: /* @__PURE__ */ jsx(Mail, { size: 24 })
				}),
				/* @__PURE__ */ jsx("h1", { children: sent ? "Se essa conta existir, o e-mail saiu." : "Vamos encontrar seu acesso." }),
				/* @__PURE__ */ jsx("p", { children: sent ? "Abra o e-mail e toque no link para escolher uma senha nova. Olhe também o spam." : "Digite o e-mail da conta. Se ele existir, mandamos um link. Contas só do Google não usam senha — entre pelo botão Google." }),
				!sent && /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						setError("");
						if (!email.includes("@")) {
							setError("Escreva um e-mail.");
							return;
						}
						setPending(true);
						void requestPasswordReset(email).then(() => setSent(true)).catch((err) => {
							setError(err instanceof Error ? err.message : "Não foi possível enviar.");
						}).finally(() => setPending(false));
					},
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "recover-email",
							children: "E-mail"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "recover-email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "voce@email.com",
							required: true
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "checkout-error",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ jsxs(Button, {
							className: "button button-primary full-button",
							disabled: pending,
							children: [
								pending ? "Enviando..." : "Enviar link",
								" ",
								/* @__PURE__ */ jsx(ArrowRight, { size: 17 })
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("button", {
					className: "button-quiet",
					onClick: onBack,
					children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar para entrar"]
				})
			]
		})]
	});
}
function ResetPassword({ onBack }) {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const [done, setDone] = useState(false);
	const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "";
	return /* @__PURE__ */ jsxs("div", {
		className: "center-page public-page",
		children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsxs("div", {
			className: "simple-card",
			children: [
				/* @__PURE__ */ jsx("h1", { children: done ? "Senha nova guardada." : "Escolha uma senha nova." }),
				/* @__PURE__ */ jsx("p", { children: done ? "Pode entrar no Refúgio com o e-mail e a senha nova." : "Use pelo menos 8 caracteres. O link do e-mail só funciona uma vez." }),
				!done && /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						setError("");
						if (!token) {
							setError("Abra o link que chegou no e-mail. Este endereço sozinho não troca a senha.");
							return;
						}
						if (password.length < 8) {
							setError("A senha precisa ter pelo menos 8 caracteres.");
							return;
						}
						if (password !== confirm) {
							setError("As duas senhas não são iguais.");
							return;
						}
						setPending(true);
						void confirmPasswordReset(password, token).then(() => setDone(true)).catch((err) => {
							setError(err instanceof Error ? err.message : "Não foi possível salvar a senha.");
						}).finally(() => setPending(false));
					},
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "reset-pass",
							children: "Senha nova"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "reset-pass",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: "new-password",
							required: true
						}),
						/* @__PURE__ */ jsx("label", {
							htmlFor: "reset-pass-2",
							children: "Repetir senha"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "reset-pass-2",
							type: "password",
							value: confirm,
							onChange: (e) => setConfirm(e.target.value),
							autoComplete: "new-password",
							required: true
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "checkout-error",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ jsx(Button, {
							className: "button button-primary full-button",
							disabled: pending,
							children: pending ? "Salvando..." : "Guardar senha"
						})
					]
				}),
				/* @__PURE__ */ jsxs("button", {
					className: "button-quiet",
					onClick: onBack,
					children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar para entrar"]
				})
			]
		})]
	});
}
function Pact({ onContinue }) {
	const [accepted, setAccepted] = useState(false);
	const [isAdult, setIsAdult] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "onboarding-page public-page",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "onboarding-top",
			children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsx("span", { children: "antes do mural" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "onboarding-card pact-card",
			children: [
				/* @__PURE__ */ jsx(LunaCompanion, { scene: "pacto", size: 96 }),
				/* @__PURE__ */ jsx("span", {
					className: "eyebrow",
					children: "pacto de empatia"
				}),
				/* @__PURE__ */ jsx("h1", { children: "Cuidamos deste espaço juntos." }),
				/* @__PURE__ */ jsx("p", {
					className: "lead-copy",
					children: "Isto não é um termo escondido. É o acordo da casa. Sem ele, o mural não abre."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "age-callout pact-age",
					children: [/* @__PURE__ */ jsx(ShieldAlert, { size: 22 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Este ambiente não é para menores de 18 anos." }), /* @__PURE__ */ jsx("p", { children: "Aqui se fala de luto, esgotamento, relacionamentos e noites difíceis. Se você ainda não tem 18 anos, este não é o seu lugar por agora — e isso também é uma forma de cuidado." })] })]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "pact-chapter",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Como falamos" }),
						/* @__PURE__ */ jsxs("div", {
							className: "pact-list",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Falamos de nós com honestidade e de outras pessoas com respeito. Sem caça, sem plateia." })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Cada carta merece tempo. Sem ranking, sem cobrança de resposta, sem “já resolveu?”." })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "O encontro é a carta. O jardim de cada pessoa é fechado — ninguém visita o do outro." })] })
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "pact-chapter",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Como o mural vive" }),
						/* @__PURE__ */ jsxs("div", {
							className: "pact-list",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Cartas evaporam como orvalho. Sem cuidado, em dois dias. Com energia ou conselho, em uma semana." })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Quem escreveu escolhe o depois: húmus no próprio jardim ou diário só seu." })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "A Luna olha a planta. Nunca cita o que você escreveu." })] })
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "pact-chapter",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "O que este lugar não é" }),
						/* @__PURE__ */ jsxs("div", {
							className: "pact-list",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Não é consultório, diagnóstico nem emergência. Se o chão sumir, o CVV 188 atende 24h, de graça." })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Check, { size: 17 }), /* @__PURE__ */ jsx("span", { children: "Não pedimos nome civil no mural. O pseudônimo é o que as outras pessoas veem." })] })
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: `check-row ${isAdult ? "checked" : ""}`,
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: isAdult,
							onChange: (e) => setIsAdult(e.target.checked)
						}),
						/* @__PURE__ */ jsx("span", {
							className: "fake-check",
							children: /* @__PURE__ */ jsx(Check, { size: 14 })
						}),
						/* @__PURE__ */ jsx("span", { children: "Declaro ter 18 anos ou mais." })
					]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: `check-row ${accepted ? "checked" : ""}`,
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: accepted,
							onChange: (e) => setAccepted(e.target.checked)
						}),
						/* @__PURE__ */ jsx("span", {
							className: "fake-check",
							children: /* @__PURE__ */ jsx(Check, { size: 14 })
						}),
						/* @__PURE__ */ jsx("span", { children: "Eu li o Pacto e quero cuidar deste espaço junto." })
					]
				}),
				/* @__PURE__ */ jsxs(Button, {
					disabled: !(accepted && isAdult),
					className: "button button-primary button-large full-button",
					onClick: onContinue,
					children: ["Assinar o Pacto ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "age-gate-note",
					children: [
						"Dá para reler depois, em Cuidar ou nas configurações. Também estão o ",
						/* @__PURE__ */ jsx(Link, {
							href: "/privacidade",
							children: "aviso de privacidade"
						}),
						" e os ",
						/* @__PURE__ */ jsx(Link, {
							href: "/termos",
							children: "termos"
						}),
						"."
					]
				})
			]
		})]
	});
}
function ProfileSetup({ name, setName, onFinish }) {
	const saveName = useRefugioStore((s) => s.setUserName);
	const email = useRefugioStore((s) => s.email);
	const plan = useRefugioStore((s) => s.plan);
	const avatarKey = useRefugioStore((s) => s.avatarKey);
	const saveAvatar = useRefugioStore((s) => s.setAvatar);
	const [nick, setNick] = useState("");
	const [hint, setHint] = useState("");
	const [selected, setSelected] = useState(["Autocuidado", "Pequenas vitórias"]);
	const ready = isValidNickname(nick, email);
	return /* @__PURE__ */ jsxs("div", {
		className: "onboarding-page public-page",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "onboarding-top",
				children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsx("span", { children: "2 de 2" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "progress-line",
				children: /* @__PURE__ */ jsx("span", { style: { width: "100%" } })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "onboarding-card profile-setup",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "eyebrow",
						children: "só o necessário"
					}),
					/* @__PURE__ */ jsxs("h1", { children: [
						"Como você quer ser",
						/* @__PURE__ */ jsx("br", {}),
						"encontrado por aqui?"
					] }),
					/* @__PURE__ */ jsx("p", {
						className: "lead-copy",
						children: "Escolha um pseudônimo. O nome da conta Google ou do e-mail nunca aparece no mural."
					}),
					/* @__PURE__ */ jsx("label", {
						htmlFor: "nickname",
						children: "Pseudônimo"
					}),
					/* @__PURE__ */ jsx("input", {
						id: "nickname",
						value: nick,
						onChange: (e) => {
							setNick(e.target.value);
							setHint("");
						},
						placeholder: "Ex.: Maré Serena",
						maxLength: 28,
						autoComplete: "nickname"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "field-hint",
						children: "Esse será o nome que acompanha suas cartas."
					}),
					/* @__PURE__ */ jsx("span", {
						className: "form-label",
						children: "Um símbolo para você"
					}),
					/* @__PURE__ */ jsx(CollectionPicker, {
						kind: "avatar",
						plan,
						value: avatarKey,
						onChange: saveAvatar
					}),
					/* @__PURE__ */ jsx("span", {
						className: "field-hint",
						children: "No plano livre: broto e folha. Lua, girassol e os outros abrem no VIP."
					}),
					/* @__PURE__ */ jsx("span", {
						className: "form-label",
						children: "O que mora com você?"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "chip-list",
						children: writeTopics.slice(0, 10).map((t) => /* @__PURE__ */ jsx("button", {
							className: selected.includes(t) ? "selected" : "",
							onClick: () => setSelected(selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t]),
							children: t
						}, t))
					}),
					/* @__PURE__ */ jsxs(Button, {
						className: "button button-primary button-large full-button",
						onClick: () => {
							const chosen = nick.trim();
							if (!isValidNickname(chosen, email)) {
								setHint(chosen.includes("@") || chosen.toLowerCase() === email.split("@")[0]?.toLowerCase()
									? "Use um apelido, não o nome do e-mail."
									: "Escreva um pseudônimo com 2 a 28 letras.");
								return;
							}
							setName(chosen);
							saveName(chosen);
							onFinish();
						},
						disabled: !ready,
						children: ["Entrar no Mural ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
					}),
					!ready && /* @__PURE__ */ jsx("p", { className: "field-hint", children: hint || "Escreva um pseudônimo. Não use o nome do e-mail." })
				]
			})
		]
	});
}
function PublicMural({ onEnter, onCard }) {
	const mural = useMuralLetters();
	const shown = mural.data.length ? mural.data : cards;
	return /* @__PURE__ */ jsxs("div", {
		className: "public-page public-mural",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "topbar public-topbar page-wrap",
				children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsxs("div", {
					className: "topbar-actions",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/sobre",
						className: "text-link",
						children: "Sobre"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/conta",
						className: "button button-small",
						children: "Entrar"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "public-mural-wrap",
				children: [
					/* @__PURE__ */ jsx(PageIntro, {
						eyebrow: "mural aberto",
						title: "Cartas que já chegaram.",
						description: "Você pode ler sem criar conta. O jardim de ninguém se abre — o encontro é a carta."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "cards-grid public-cards",
						children: shown.slice(0, 12).map((card) => /* @__PURE__ */ jsx(CardPreview, {
							card,
							onOpen: () => onCard(card.id),
							onEnergy: onEnter
						}, card.id))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "anonymous-note",
						children: "Este é o mural. Entre para escrever. O jardim fica só com quem plantou."
					})
				]
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "public-footer page-wrap",
				children: [/* @__PURE__ */ jsx("span", { children: "© 2026 Refúgio da Lua" }), /* @__PURE__ */ jsxs("nav", {
					className: "footer-links",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: "/sobre",
							children: "Sobre"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/onboarding/pacto",
							children: "Pacto"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/privacidade",
							children: "Privacidade"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/termos",
							children: "Termos"
						})
					]
				})]
			})
		]
	});
}
function AppShell({ userName, anonymous, notifications, onNotifications, onNavigate, onLogout }) {
	const [location] = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);
	const [installPrompt, setInstallPrompt] = useState(null);
	const avatarKey = useRefugioStore((s) => s.avatarKey);
	const frameKey = useRefugioStore((s) => s.frameKey);
	const glyph = avatars.find((item) => item.key === avatarKey)?.glyph ?? "🌿";
	const nav = [
		{
			path: "/mural",
			label: "Mural",
			icon: Home
		},
		{
			path: "/escrever",
			label: "Desabafar",
			icon: PencilLine
		},
		{
			path: "/jardim",
			label: "Jardim",
			icon: Leaf
		},
		{
			path: "/cuidar",
			label: "Cuidar",
			icon: Heart
		}
	];
	useEffect(() => {
		const handler = (event) => {
			event.preventDefault();
			setInstallPrompt(event);
		};
		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);
	const installApp = async () => {
		if (!installPrompt) return;
		await installPrompt.prompt();
		await installPrompt.userChoice;
		setInstallPrompt(null);
		setMenuOpen(false);
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("header", {
			className: "app-header",
			children: /* @__PURE__ */ jsxs("div", {
				className: "app-header-inner",
				children: [
					/* @__PURE__ */ jsx(Logo, { compact: true }),
					/* @__PURE__ */ jsx("nav", {
						className: "desktop-nav",
						"aria-label": "Navegação principal",
						children: nav.map(({ path, label, icon: I }) => /* @__PURE__ */ jsxs(Link, {
							href: path,
							className: location === path ? "active" : "",
							children: [/* @__PURE__ */ jsx(I, { size: 17 }), label]
						}, path))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "header-user",
						children: [
							/* @__PURE__ */ jsx(ThemeToggle, { compact: true }),
							/* @__PURE__ */ jsx(PeacePlayer, { compact: true, onNeedPlan: () => onNavigate("/planos") }),
							/* @__PURE__ */ jsxs("button", {
								className: "notification-button",
								"aria-label": "Abrir notificações",
								onClick: onNotifications,
								children: [/* @__PURE__ */ jsx(Bell, { size: 19 }), notifications > 0 && /* @__PURE__ */ jsx("span", { children: notifications })]
							}),
							/* @__PURE__ */ jsxs("button", {
								className: "user-pill",
								onClick: () => onNavigate("/perfil"),
								children: [/* @__PURE__ */ jsx("span", {
									className: `avatar avatar-sm frame-${frameKey}`,
									children: glyph
								}), /* @__PURE__ */ jsx("span", { children: userName })]
							}),
							/* @__PURE__ */ jsx(IconButton, {
								label: "Abrir menu",
								onClick: () => setMenuOpen(!menuOpen),
								children: /* @__PURE__ */ jsx(Menu, { size: 20 })
							}),
							menuOpen && /* @__PURE__ */ jsxs("div", {
								className: "user-menu",
								children: [
									/* @__PURE__ */ jsxs("button", {
										onClick: () => onNavigate("/perfil"),
										children: [/* @__PURE__ */ jsx(UserRound, { size: 16 }), " Meu perfil"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => onNavigate("/onboarding/pacto"),
										children: [/* @__PURE__ */ jsx(Heart, { size: 16 }), " Pacto de empatia"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => onNavigate("/planos"),
										children: [/* @__PURE__ */ jsx(Crown, { size: 16 }), " Planos VIP"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => onNavigate("/configuracoes"),
										children: [/* @__PURE__ */ jsx(Settings, { size: 16 }), " Configurações"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => {
											if (installPrompt) installApp();
											else onNavigate("/instalar");
										},
										children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), " Instalar app"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: onLogout,
										children: [/* @__PURE__ */ jsx(LogOut, { size: 16 }), " Sair"]
									})
								]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ jsx("nav", {
			className: "mobile-nav",
			"aria-label": "Navegação móvel",
			children: nav.map(({ path, label, icon: I }) => /* @__PURE__ */ jsxs(Link, {
				href: path,
				className: location === path ? "active" : "",
				children: [/* @__PURE__ */ jsx(I, { size: 20 }), /* @__PURE__ */ jsx("span", { children: label })]
			}, path))
		}),
		anonymous && /* @__PURE__ */ jsxs("div", {
			className: "anonymous-banner",
			children: [/* @__PURE__ */ jsx(Sparkles, { size: 15 }), /* @__PURE__ */ jsxs("span", { children: ["Você está em modo anônimo. ", /* @__PURE__ */ jsx("button", {
				onClick: () => onNavigate("/conta"),
				children: "Entre para salvar seu progresso."
			})] })]
		})
	] });
}
function PageIntro({ eyebrow, title, description, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "page-intro",
		children: [eyebrow && /* @__PURE__ */ jsx("span", {
			className: "eyebrow",
			children: eyebrow
		}), /* @__PURE__ */ jsxs("div", {
			className: "intro-row",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", { children: title }), description && /* @__PURE__ */ jsx("p", { children: description })] }), action]
		})]
	});
}
function Mural({ userName, anonymous, favorites, onFavorite, onWrite, onCard, onEnergy, onViewAll, entitlements = emptyEntitlements }) {
	const [activeTopic, setActiveTopic] = useState("Carta da noite");
	const [search, setSearch] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [emotion, setEmotion] = useState("");
	const [hour, setHour] = useState("");
	const remoteLetters = useMuralLetters();
	const sendEnergy = trpc.letters.sendEnergy.useMutation();
	const source = (remoteLetters.data && remoteLetters.data.length ? remoteLetters.data : cards).filter((card) => dewPhase(card) !== "due");
	const hourRange = hourBuckets.find((bucket) => bucket.key === hour);
	const filtered = source.filter((c) => {
		const hay = `${c.title} ${c.excerpt} ${c.topic}`.toLowerCase();
		if (activeTopic !== "Carta da noite" && c.topic !== activeTopic) return false;
		if (search && !hay.includes(search.toLowerCase())) return false;
		if (gender && c.gender !== gender) return false;
		if (age && c.ageGroup !== age) return false;
		if (emotion && c.emotion !== emotion) return false;
		if (hourRange && typeof c.hour === "number") {
			const value = c.hour;
			if (value < hourRange.from || value > hourRange.to) return false;
		}
		return true;
	}).sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
	const night = pickNightLetters(source);
	const ritual = activeTopic === "Carta da noite" && !search && !gender && !age && !emotion && !hour;
	const shown = ritual ? night : filtered;
	const phase = moonPhaseLabel();
	const emitEnergy = (id) => {
		sendEnergy.mutate({ letterId: id });
		onEnergy();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "content-page",
		children: [
			/* @__PURE__ */ jsx(LunaCompanion, { scene: "mural", size: 76 }),
			/* @__PURE__ */ jsx(PageIntro, {
				eyebrow: "mural de presença",
				title: `Olá, ${userName}.`,
				description: ritual ? `Hoje a lua está ${phase}. Ela escolheu poucas cartas — não um feed.` : "Que bom ter você aqui. Tem algo querendo ser colocado para fora?",
				action: /* @__PURE__ */ jsxs(Button, {
					className: "button button-primary",
					onClick: onWrite,
					children: [/* @__PURE__ */ jsx(PencilLine, { size: 17 }), " Escrever um desabafo"]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "night-letter-card",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ jsx(Moon, { size: 14 }), " carta da noite · ", phase]
					}),
					/* @__PURE__ */ jsx("h2", { children: ritual ? "Três cartas. Só isso." : "O mural inteiro está aqui, se você quiser." }),
					/* @__PURE__ */ jsx("p", { children: ritual ? "A lua não entrega o infinitamente. Lê uma. Deixa uma energia, se couber. O resto espera amanhã." : "Você saiu do rito. Pode voltar à Carta da noite quando quiser." })
				] })]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "dew-note",
				children: ["Cartas sem cuidado evaporam em dois dias. As que receberam energia ou conselho duram uma semana. Depois viram húmus ou diário — o jardim de ninguém se visita."]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "section-heading",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "section-label",
					children: ritual ? "ESCOLHIDAS PARA ESTA NOITE" : "CARTAS DO MURAL"
				}), /* @__PURE__ */ jsx("h2", { children: ritual ? "Talvez uma destas seja sua." : "O mural aberto, sem pressa." })] }), !ritual && /* @__PURE__ */ jsxs("button", {
					className: "button-quiet",
					onClick: () => setActiveTopic("Carta da noite"),
					children: ["Voltar à noite ", /* @__PURE__ */ jsx(Moon, { size: 15 })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mural-tools",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "search-box",
					children: [/* @__PURE__ */ jsx(Search, { size: 16 }), /* @__PURE__ */ jsx("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por tema ou palavra...",
						"aria-label": "Buscar cartas"
					})]
				}), /* @__PURE__ */ jsxs("span", {
					className: "mural-count",
					children: [shown.length, ritual ? " cartas desta noite" : " cartas encontradas"]
				})]
			}),
			!ritual && /* @__PURE__ */ jsx(MuralVipFilters, {
				entitlements,
				gender,
				age,
				emotion,
				hour,
				onGender: (value) => {
					if (!entitlements.filterFull && value && age) setAge("");
					setGender(value);
				},
				onAge: (value) => {
					if (!entitlements.filterFull && value && gender) setGender("");
					setAge(value);
				},
				onEmotion: setEmotion,
				onHour: setHour
			}),
			/* @__PURE__ */ jsx("div", {
				className: "topic-scroll",
				role: "tablist",
				children: topics.map((topic) => /* @__PURE__ */ jsx("button", {
					role: "tab",
					"aria-selected": activeTopic === topic,
					className: activeTopic === topic ? "active" : "",
					onClick: () => setActiveTopic(topic),
					children: topic
				}, topic))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "cards-grid",
				children: shown.map((card) => /* @__PURE__ */ jsx(CardPreview, {
					card,
					favorite: favorites.includes(card.id),
					onFavorite: () => onFavorite(card.id),
					onOpen: () => onCard(card.id),
					onEnergy: () => onCard(card.id)
				}, card.id))
			}),
			anonymous && /* @__PURE__ */ jsx("p", {
				className: "anonymous-note",
				children: "Você está visitando sem conta. Favoritos ficam só neste aparelho."
			})
		]
	});
}
function CardPreview({ card, favorite, onFavorite, onOpen, onEnergy }) {
	return /* @__PURE__ */ jsxs("article", {
		className: `letter-card ${favorite ? "is-favorite" : ""} ${dewPhase(card) === "mist" ? "is-dew" : ""} ${card.paperKey ? `paper-${card.paperKey}` : ""} ${card.sealKey && card.sealKey !== "none" ? "has-seal" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "letter-main",
			role: "button",
			tabIndex: 0,
			onClick: onOpen,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") onOpen();
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "letter-meta",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: `avatar avatar-${card.color}`,
							children: card.initials
						}),
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: card.author }), /* @__PURE__ */ jsxs("small", { children: [
							card.topic,
							" · ",
							card.time
						] })] }),
						dewPhase(card) === "mist" && /* @__PURE__ */ jsx("em", { className: "dew-pill", children: "orvalho" }),
						Number(card.priority) > 0 && /* @__PURE__ */ jsx("em", {
							className: `priority-pill p${String(card.priority)}`,
							children: Number(card.priority) > 1 ? "topo" : "fila"
						}),
						/* @__PURE__ */ jsx("button", {
							className: "card-bookmark",
							"aria-label": favorite ? "Remover dos guardados" : "Guardar carta",
							onClick: (e) => {
								e.stopPropagation();
								onFavorite?.();
							},
							children: favorite ? /* @__PURE__ */ jsx(Bookmark, {
								size: 17,
								fill: "currentColor"
							}) : /* @__PURE__ */ jsx(Bookmark, { size: 17 })
						}),
						/* @__PURE__ */ jsx(MoreHorizontal, { size: 18 })
					]
				}),
				/* @__PURE__ */ jsx("h3", { children: card.title }),
				/* @__PURE__ */ jsx("p", { children: card.excerpt }),
				/* @__PURE__ */ jsxs("span", {
					className: "read-link",
					children: ["Ler carta ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "letter-actions",
			children: [/* @__PURE__ */ jsxs("button", {
				onClick: onEnergy,
				children: [
					/* @__PURE__ */ jsx(Heart, { size: 15 }),
					" Deixar uma energia ",
					/* @__PURE__ */ jsx("span", { children: card.energy })
				]
			}), /* @__PURE__ */ jsxs("span", {
				className: "private-tag",
				children: [/* @__PURE__ */ jsx(LockKeyhole, { size: 12 }), " sem ranking"]
			})]
		})]
	});
}
function CardDetail({ onBack, onEnergy, onAdvice, onDew, onRetire }) {
  const [, params] = useRoute("/carta/:id");
  const letterId = params?.id || "";
  const letter = trpc.letters.get.useQuery({ letterId }, { enabled: Boolean(letterId), retry: false });
  const userName = useRefugioStore((s) => s.userName);
  const thankedAdviceIds = useRefugioStore((s) => s.thankedAdviceIds);
  const adviceTick = useRefugioStore((s) => s.adviceToday);
  const markRead = useRefugioStore((s) => s.markRead);
  useEffect(() => {
    if (letterId) markRead(letterId);
  }, [letterId, markRead]);
  const [energy, setEnergy] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [ownAdvice, setOwnAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState("");
  const envelopeKey = useRefugioStore((s) => s.envelopeKey);
  const fontKey = useRefugioStore((s) => s.fontKey);
  const setEnvelope = useRefugioStore((s) => s.setEnvelope);
  const setLetterFont = useRefugioStore((s) => s.setLetterFont);
  const planNow = useRefugioStore((s) => s.plan);
  const openAdvice = trpc.letters.openAdvice.useMutation();
  const review = reviewLetterText(message, "advice");
  const sendEnergy = trpc.letters.sendEnergy.useMutation({
    onSuccess: (result) => { setSent(true); onEnergy(Boolean(result?.grewSeed)); },
  });
  const sendAdvice = trpc.letters.advise.useMutation({
    onError: (err) => setAdviceError(err.message),
  });
  const thankAdvice = trpc.letters.thankAdvice.useMutation({
    onSuccess: (result) => { if (result) onDew(); },
  });
  const retireLetter = trpc.letters.retire.useMutation({
    onSuccess: (result) => {
      onRetire?.(result.destiny);
      onBack();
    },
    onError: (err) => setAdviceError(err.message),
  });
  void adviceTick;
  const submitAdvice = () => {
    setAdviceError("");
    if (!canPublish(review)) { setAdviceError(review.summary); return; }
    if (!ownAdvice) { setAdviceError("Marque que este conselho é seu e que você fala com cuidado."); return; }
    if (useRefugioStore.getState().adviceStatus().atRest) {
      setAdviceError(REST_MESSAGE);
      return;
    }
    const beforeSeeds = useRefugioStore.getState().amazonSeeds.length;
    const beforeAdvice = useRefugioStore.getState().adviceSent;
    sendAdvice.mutate({ letterId, body: message, envelopeKey, fontKey });
    const after = useRefugioStore.getState();
    if (after.adviceSent <= beforeAdvice) return;
    const granted = after.amazonSeeds.length > beforeSeeds ? after.amazonSeeds[after.amazonSeeds.length - 1] : null;
    setMessage("");
    setOwnAdvice(false);
    onAdvice(granted);
  };
  const data = letter.data;
  const paragraphs = (data?.body || "").split(/\n+/).filter(Boolean);
  const isOwn = Boolean(data && data.author === userName);
  const receivedAdvice = data?.advice ?? [];
  const liveStatus = useRefugioStore.getState().adviceStatus();
  return (
    <div className="content-page detail-page">
      <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Voltar ao Mural</button>
      <LunaCompanion scene={liveStatus.atRest ? "rest" : "letter"} size={72} />
      <div className="detail-layout">
        <article className="detail-letter">
          {letter.isLoading ? <p>Abrindo a carta...</p> : !data ? <p>Esta carta não está mais no mural.</p> : (
            <>
              <div className="letter-meta">
                <span className="avatar avatar-lavender">{data.initials}</span>
                <span><strong>{data.author}</strong><small>{data.topic} · {data.time}</small></span>
              </div>
              <h1>{data.title}</h1>
              {paragraphs.map((part) => <p key={part.slice(0, 24)} className="detail-copy">{part}</p>)}
              <div className="detail-sign">escrita no Refúgio <span>·</span> {data.energy} energias recebidas</div>
              {data.energyKinds && Object.keys(data.energyKinds).length > 0 && (
                <p className="filter-hint">
                  {Object.entries(data.energyKinds).map(([key, n]) => `${energyLabel(key)} × ${n}`).join(" · ")}
                </p>
              )}
              {isOwn && receivedAdvice.length > 0 && (
                <div className="received-advice">
                  <span className="eyebrow"><Heart size={14} /> conselhos que chegaram</span>
                  {receivedAdvice.map((item) => {
                    const thanked = thankedAdviceIds.includes(item.id);
                    return (
                      <EnvelopeAdvice
                        key={item.id}
                        author={item.author}
                        body={item.body}
                        envelopeKey={item.envelopeKey}
                        fontKey={item.fontKey}
                        opened={item.opened}
                        thanked={thanked}
                        thanking={thankAdvice.isPending}
                        onOpen={() => openAdvice.mutate({ adviceId: item.id })}
                        onThank={() => thankAdvice.mutate({ adviceId: item.id })}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </article>
        <aside className="care-card">
          {isOwn ? (
            <>
              <span className="eyebrow"><Sprout size={14}/> destino desta carta</span>
              <h2>Ela já cumpriu no mural?</h2>
              <p>Só você tira. Húmus alimenta o jardim e some da vista dos outros. O diário guarda o texto só para você.</p>
              {data?.afterMural === "humus" ? <p className="filter-hint">Quando publicou, você pensou em húmus. Ainda pode mudar agora.</p> : data?.afterMural === "diary" ? <p className="filter-hint">Quando publicou, você pensou no diário. Ainda pode mudar agora.</p> : null}
              <Button className="button button-primary full-button" disabled={retireLetter.isPending} onClick={() => retireLetter.mutate({ letterId, destiny: "humus" })}>
                {retireLetter.isPending ? "Guardando..." : "Virar húmus no jardim"} <Sprout size={16}/>
              </Button>
              <Button className="button button-secondary full-button" disabled={retireLetter.isPending} onClick={() => retireLetter.mutate({ letterId, destiny: "diary" })}>
                Guardar no diário <BookHeart size={16}/>
              </Button>
              {receivedAdvice.length > 0 && <p className="filter-hint">Os conselhos que chegaram seguem no orvalho, se você já agradeceu.</p>}
            </>
          ) : liveStatus.atRest ? (
            <div className="rest-panel">
              <Moon size={28} />
              <span className="eyebrow">modo repouso</span>
              <h2>{REST_MESSAGE}</h2>
              <p>{liveStatus.limit === 3 ? "No plano gratuito são até 3 conselhos por dia." : "No VIP Mensal são até 5 conselhos por dia."} Amanhã a escuta volta a abrir.</p>
            </div>
          ) : (
            <>
              <span className="eyebrow"><Heart size={14}/> como você quer chegar?</span>
              <h2>Deixe uma energia.</h2>
              <p>Escolha o tipo de energia. Sem isso, ela não parte. A pessoa recebe o cuidado, sem ranking.</p>
              <div className="energy-list">{energyKinds.map((item) => <button key={item.key} className={energy === item.key ? "selected" : ""} onClick={() => setEnergy(item.key)}>{energy === item.key && <Check size={15}/>} {item.label}</button>)}</div>
              <Button disabled={!energy || sent || !data || sendEnergy.isPending} className="button button-primary full-button" onClick={() => sendEnergy.mutate({ letterId, label: energy })}>{sent ? "Energia enviada" : "Enviar esta energia"} <Sparkles size={16}/></Button>
              <div className="advice-divider"><span>ou escreva como guardião</span></div>
              <p className="filter-hint">
                Quem acolhe também responde pelo que diz. Sem diagnóstico, sem ordem, sem texto de IA.
                {liveStatus.remaining !== null ? ` Restam ${liveStatus.remaining} conselho${liveStatus.remaining === 1 ? "" : "s"} hoje.` : " Neste plano a escuta não tem teto."}
              </p>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Uma frase sua de apoio..." rows={4} className={`font-${fontKey}`}/>
              <span className="form-label">Envelope</span>
              <StylePicker items={envelopes} plan={planNow} value={envelopeKey} onChange={setEnvelope} />
              <span className="form-label">Letra</span>
              <StylePicker items={letterFonts} plan={planNow} value={fontKey} onChange={setLetterFont} />
              <p className="filter-hint">O envelope chega lacrado. Só quem escreveu a carta escolhe abrir. Linho, luar e caligrafia são VIP.</p>
              {message.trim() && review.flags.length > 0 && <div className={"review-box " + review.level}><span className="review-kicker">leitura automática</span><strong>{review.summary}</strong>{review.careNeeded && <p className="review-care">CVV 188 · 24h · gratuito.</p>}</div>}
              <label className="check-row"><input type="checkbox" checked={ownAdvice} onChange={(e) => setOwnAdvice(e.target.checked)} /><span>Este conselho é meu. Não colei texto de IA. Não estou diagnosticando ninguém.</span></label>
              {adviceError && <p className="checkout-error" role="alert">{adviceError}</p>}
              <Button disabled={!message.trim() || sendAdvice.isPending || !data} className="button button-secondary full-button" onClick={submitAdvice}>{sendAdvice.isPending ? "Enviando..." : "Enviar conselho com cuidado"} <ArrowRight size={16}/></Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
function Write({ draft, setDraft, anonymous, onCancel, onPublish, onSave, onAskLogin, entitlements = emptyEntitlements, plan = "free" }) {
	const storePlan = useRefugioStore((s) => s.plan);
	const userName = useRefugioStore((s) => s.userName);
	plan = storePlan === "monthly" || storePlan === "annual" ? storePlan : plan;
	const [privacy, setPrivacy] = useState("mural");
	const [topic, setTopic] = useState("Autocuidado");
	const [gender, setGender] = useState("");
	const [ageGroup, setAgeGroup] = useState("");
	const [emotion, setEmotion] = useState("");
	const [paperKey, setPaperKey] = useState("plain");
	const [sealKey, setSealKey] = useState("none");
	const [afterMural, setAfterMural] = useState("humus");
	const [error, setError] = useState("");
	const publishLetter = trpc.letters.publish.useMutation({
		onSuccess: () => onPublish(),
		onError: (err) => setError(err.message || "Não foi possível publicar agora.")
	});
	const [ownWords, setOwnWords] = useState(false);
	const review = reviewLetterText(draft);
	const lettersThisWeek = useRefugioStore((s) => s.lettersThisWeek);
	const letterWeek = useRefugioStore((s) => s.letterWeek);
	const letterStatus = useRefugioStore.getState().letterStatus();
	void lettersThisWeek;
	void letterWeek;
	const submitPublish = () => {
		setError("");
		if (privacy === "mural" && !anonymous) {
			if (!canPublish(review)) {
				setError(review.summary);
				return;
			}
			if (!ownWords) {
				setError("Marque que este desabafo é seu e que você responde pelo que publica.");
				return;
			}
			if (useRefugioStore.getState().letterStatus().atRest) {
				setError(useRefugioStore.getState().letterStatus().limit
					? `Nesta semana o mural cabe ${useRefugioStore.getState().letterStatus().limit} cartas no seu plano. O diário continua livre.`
					: "O mural desta semana já está cheio.");
				return;
			}
			publishLetter.mutate({
				body: draft,
				topic,
				title: draft.split(/[.!?\n]/)[0]?.slice(0, 80),
				gender,
				emotion,
				ageGroup,
				paperKey,
				sealKey,
				afterMural
			});
			return;
		}
		onPublish();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "content-page write-page",
		children: [/* @__PURE__ */ jsxs("button", {
			className: "back-link",
			onClick: onCancel,
			children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar ao Mural"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "write-layout",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(LunaCompanion, { scene: "write", size: 72 }),
				/* @__PURE__ */ jsx(PageIntro, {
					eyebrow: "desabafar",
					title: "O que você gostaria de colocar para fora?",
					description: "Não precisa fazer sentido ainda. Este espaço começa onde você está."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "identity-line",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "avatar avatar-sm",
							children: "🌿"
						}),
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: userName || "escolha um pseudônimo" }), /* @__PURE__ */ jsx("small", { children: "seu pseudônimo · visível apenas se publicar" })] }),
						/* @__PURE__ */ jsx(Link, { href: "/perfil", className: "text-link", children: "Mudar" })
					]
				}),
				/* @__PURE__ */ jsx("label", {
					htmlFor: "letter-text",
					className: "sr-only",
					children: "Seu desabafo"
				}),
				/* @__PURE__ */ jsx("textarea", {
					id: "letter-text",
					className: `letter-editor paper-${paperKey}`,
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Pode começar com: hoje eu...",
					rows: 10
				}),
				sealKey !== "none" && /* @__PURE__ */ jsxs("div", {
					className: "wax-on-letter",
					children: [
						seals.find((item) => item.key === sealKey)?.glyph,
						" ",
						seals.find((item) => item.key === sealKey)?.label
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "editor-footer",
					children: [/* @__PURE__ */ jsxs("span", { children: [draft.length, " caracteres"] }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 14 }), " sem julgamento"] })]
				})
			] }), /* @__PURE__ */ jsx("aside", {
				className: "write-side",
				children: /* @__PURE__ */ jsxs("div", {
					className: "side-panel",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "form-label",
							children: "Tema (opcional)"
						}),
						/* @__PURE__ */ jsx("select", {
							value: topic,
							onChange: (e) => setTopic(e.target.value),
							children: writeTopics.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
						}),
						/* @__PURE__ */ jsx("span", {
							className: "form-label",
							children: "Papel e envelope"
						}),
						/* @__PURE__ */ jsx(CollectionPicker, {
							kind: "paper",
							plan,
							value: paperKey,
							onChange: setPaperKey
						}),
						entitlements.papersFull && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "form-label",
							children: "Selo de cera"
						}), /* @__PURE__ */ jsx(CollectionPicker, {
							kind: "seal",
							plan,
							value: sealKey,
							onChange: setSealKey
						})] }),
						/* @__PURE__ */ jsx("span", {
							className: "form-label",
							children: "Marcações (opcional)"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "write-meta-grid",
							children: [
								/* @__PURE__ */ jsxs("select", {
									value: gender,
									onChange: (e) => setGender(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Gênero (oculto no mural público)"
										}),
										/* @__PURE__ */ jsx("option", { children: "Mulher" }),
										/* @__PURE__ */ jsx("option", { children: "Homem" }),
										/* @__PURE__ */ jsx("option", { children: "Não-binário" }),
										/* @__PURE__ */ jsx("option", { children: "Prefiro não dizer" })
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: ageGroup,
									onChange: (e) => setAgeGroup(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Faixa de idade"
										}),
										/* @__PURE__ */ jsx("option", { children: "18–24" }),
										/* @__PURE__ */ jsx("option", { children: "25–34" }),
										/* @__PURE__ */ jsx("option", { children: "35–44" }),
										/* @__PURE__ */ jsx("option", { children: "45–59" }),
										/* @__PURE__ */ jsx("option", { children: "60+" })
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: emotion,
									onChange: (e) => setEmotion(e.target.value),
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Emoção"
									}), emotionOptions.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))]
								})
							]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "form-label",
							children: "Onde você quer guardar?"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "privacy-options",
							children: [/* @__PURE__ */ jsxs("button", {
								className: privacy === "private" ? "selected" : "",
								onClick: () => setPrivacy("private"),
								children: [
									/* @__PURE__ */ jsx(BookHeart, { size: 18 }),
									/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Meu diário privado" }), /* @__PURE__ */ jsx("small", { children: "Só você poderá ler." })] }),
									privacy === "private" && /* @__PURE__ */ jsx(Check, { size: 16 })
								]
							}), /* @__PURE__ */ jsxs("button", {
								className: privacy === "mural" ? "selected" : "",
								onClick: () => setPrivacy("mural"),
								children: [
									/* @__PURE__ */ jsx(Sparkles, { size: 18 }),
									/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Publicar no Mural" }), /* @__PURE__ */ jsx("small", { children: `Até ${weeklyLetterLimit(plan)} cartas por semana neste plano. O diário não tem teto.` })] }),
									privacy === "mural" && /* @__PURE__ */ jsx(Check, { size: 16 })
								]
							})]
						}),
						privacy === "mural" && /* @__PURE__ */ jsxs("div", {
							className: "privacy-options destiny-options",
							children: [
								/* @__PURE__ */ jsx("span", { className: "form-label", children: "Quando ela sair do mural" }),
								/* @__PURE__ */ jsxs("button", {
									className: afterMural === "humus" ? "selected" : "",
									onClick: () => setAfterMural("humus"),
									type: "button",
									children: [
										/* @__PURE__ */ jsx(Sprout, { size: 18 }),
										/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Virar húmus no jardim" }), /* @__PURE__ */ jsx("small", { children: "Quando o orvalho levar a carta, ela vira terra para a sua árvore. Ninguém vê o jardim." })] }),
										afterMural === "humus" && /* @__PURE__ */ jsx(Check, { size: 16 })
									]
								}),
								/* @__PURE__ */ jsxs("button", {
									className: afterMural === "diary" ? "selected" : "",
									onClick: () => setAfterMural("diary"),
									type: "button",
									children: [
										/* @__PURE__ */ jsx(BookHeart, { size: 18 }),
										/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Guardar no diário" }), /* @__PURE__ */ jsx("small", { children: "Sai do mural e fica só com você." })] }),
										afterMural === "diary" && /* @__PURE__ */ jsx(Check, { size: 16 })
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "care-disclaimer",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 16 }), /* @__PURE__ */ jsx("span", { children: "O Refúgio oferece apoio entre pessoas, mas não substitui atendimento profissional. Você responde pelo que publica." })]
						}),
						privacy === "mural" && draft.trim().length > 20 && /* @__PURE__ */ jsxs("div", {
							className: "review-box " + review.level,
							children: [
								/* @__PURE__ */ jsx("span", { className: "review-kicker", children: "leitura automática" }),
								/* @__PURE__ */ jsx("strong", { children: review.summary }),
								review.flags.length > 0 && /* @__PURE__ */ jsx("ul", { children: review.flags.map((flag) => /* @__PURE__ */ jsx("li", { children: flag }, flag)) }),
								review.careNeeded && /* @__PURE__ */ jsxs("p", { className: "review-care", children: [
									"CVV 188 · 24h · gratuito. ",
									/* @__PURE__ */ jsx("a", { href: "/cuidar", children: "Abrir cuidado" })
								] })
							]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "check-row",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: ownWords,
								onChange: (e) => setOwnWords(e.target.checked)
							}), /* @__PURE__ */ jsx("span", { children: "Este desabafo é meu. Não estou colando uma história inventada por inteligência artificial." })]
						}),
						privacy === "mural" && /* @__PURE__ */ jsx("p", {
							className: "filter-hint",
							children: letterStatus.atRest
								? `O mural desta semana já recebeu suas ${letterStatus.limit} cartas. O diário continua aberto.`
								: `Restam ${letterStatus.remaining} carta${letterStatus.remaining === 1 ? "" : "s"} no mural nesta semana.`
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "checkout-error",
							role: "alert",
							children: error
						}),
						anonymous && privacy !== "private" && /* @__PURE__ */ jsxs("div", {
							className: "login-nudge",
							children: [/* @__PURE__ */ jsx(Sparkles, { size: 15 }), /* @__PURE__ */ jsxs("span", { children: [
								"Para publicar, você precisa ",
								/* @__PURE__ */ jsx("button", {
									onClick: onAskLogin,
									children: "entrar ou criar uma conta"
								}),
								"."
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "write-actions",
							children: [/* @__PURE__ */ jsxs(Button, {
								className: "button button-secondary",
								onClick: onSave,
								children: [/* @__PURE__ */ jsx(BookHeart, { size: 16 }), " Guardar no diário"]
							}), /* @__PURE__ */ jsxs(Button, {
								className: "button button-primary",
								disabled: !draft.trim() || anonymous && privacy !== "private" || publishLetter.isPending,
								onClick: submitPublish,
								children: [
									publishLetter.isPending ? "Publicando..." : "Publicar com cuidado",
									" ",
									/* @__PURE__ */ jsx(ArrowRight, { size: 16 })
								]
							})]
						})
					]
				})
			})]
		})]
	});
}
function Confirmation({ onMural, onGarden, published }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "center-page public-page confirmation-page",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "success-orbit",
				children: /* @__PURE__ */ jsx(Check, { size: 35 })
			}),
			/* @__PURE__ */ jsx("span", {
				className: "eyebrow",
				children: "chegou ao Refúgio"
			}),
			/* @__PURE__ */ jsx("h1", { children: published ? "Sua carta chegou." : "Seu cuidado está guardado." }),
			/* @__PURE__ */ jsx("p", { children: published ? "Ela agora repousa no Mural, pronta para ser lida com calma por alguém que precisava encontrar estas palavras." : "Seu texto foi guardado no seu Jardim privado. Só você pode voltar a ele." }),
			/* @__PURE__ */ jsxs("div", {
				className: "hero-actions",
				children: [/* @__PURE__ */ jsxs(Button, {
					className: "button button-primary",
					onClick: onMural,
					children: ["Voltar ao Mural ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				}), /* @__PURE__ */ jsxs("button", {
					className: "button-quiet",
					onClick: onGarden,
					children: ["Ver meu Jardim ", /* @__PURE__ */ jsx(Leaf, { size: 15 })]
				})]
			})
		]
	});
}
function Garden({ anonymous, onAction, onSync, entitlements = emptyEntitlements }) {
  const amazonSeeds = useRefugioStore((state) => state.amazonSeeds);
  const energiesReceived = useRefugioStore((state) => state.energiesReceived);
  const dewDropsReceived = useRefugioStore((state) => state.dewDropsReceived);
  const pendingDew = useRefugioStore((state) => state.pendingDew);
  const resolveDew = useRefugioStore((state) => state.resolveDew);
  const humusCount = useRefugioStore((state) => state.humusCount);
  const adviceToday = useRefugioStore((state) => state.adviceToday);
  const adviceDay = useRefugioStore((state) => state.adviceDay);
  const islandTreeKey = useRefugioStore((state) => state.islandTreeKey);
  const islandBornCare = useRefugioStore((state) => state.islandBornCare);
  const grownIslandKeys = useRefugioStore((state) => state.grownIslandKeys);
  const plan = useRefugioStore((state) => state.plan);
  const adviceSent = useRefugioStore((state) => state.adviceSent);
  const chooseIslandTree = useRefugioStore((state) => state.chooseIslandTree);
  const chooseAmazonTree = useRefugioStore((state) => state.chooseAmazonTree);
  const ensureAmazonGrove = useRefugioStore((state) => state.ensureAmazonGrove);
  const userName = useRefugioStore((state) => state.userName);
  const avatarKey = useRefugioStore((state) => state.avatarKey);
  const frameKey = useRefugioStore((state) => state.frameKey);
  const days = useRefugioStore((state) => state.days);
  const energiesSent = useRefugioStore((state) => state.energiesSent);
  const lettersRead = useRefugioStore((state) => state.lettersRead);
  const lettersPublished = useRefugioStore((state) => state.lettersPublished);
  const pactOk = useRefugioStore((state) => state.pactOk);
  const letters = useRefugioStore((state) => state.letters);
  const fruitBasket = useRefugioStore((state) => state.fruitBasket);
  useEffect(() => {
    if (entitlements.amazonGrove) ensureAmazonGrove();
  }, [entitlements.amazonGrove, ensureAmazonGrove]);
  const glyph = avatars.find((item) => item.key === avatarKey)?.glyph ?? "🌿";
  const sealsList = listPresenceSeals({
    pactOk, energiesSent, adviceSent, dewDropsReceived, lettersPublished, days, amazonSeeds, plan, energiesReceived, userName, letters, fruitBasket,
  });
  const visibleSeals = sealsList.filter((item) => !item.annual || plan === "annual");
  const earnedCount = visibleSeals.filter((item) => item.earned).length;
  return (
    <div className="content-page garden-page">
      <LunaCompanion
        scene="garden"
        size={72}
        line={lunaGardenLine({
          islandTreeKey,
          islandBornCare,
          dewDropsReceived,
          energiesReceived,
          adviceSent,
          amazonSeeds,
          adviceToday,
          adviceDay,
        })}
      />
      <header className="garden-profile">
        <span className={`profile-avatar ${entitlements.avatarsGold ? "gold-aura" : entitlements.avatarsSilver ? "silver-aura" : ""} frame-${frameKey}`}>{glyph}</span>
        <div>
          <span className="eyebrow">seu jardim</span>
          <h1>{userName}</h1>
          <p>{anonymous ? "O que cresce aqui fica neste aparelho." : "Só você entra neste jardim. A Luna olha a planta, nunca a carta."}</p>
        </div>
        {anonymous ? (
          <Button className="button button-primary" onClick={onSync}>Entrar para sincronizar <ArrowRight size={16} /></Button>
        ) : (
          <button className="button-quiet" onClick={() => onAction("/perfil")}>Editar identidade</button>
        )}
      </header>
      {plan === "annual" ? (
        <AmazonGrove unlocked seeds={amazonSeeds} energiesReceived={energiesReceived} onSeePlans={() => onAction("/planos")} onChoose={chooseAmazonTree} />
      ) : (
        <IslandTree
          plan={plan}
          speciesKey={islandTreeKey}
          grownKeys={grownIslandKeys}
          bornCare={islandBornCare}
          dewDropsReceived={dewDropsReceived}
          energiesReceived={energiesReceived}
          adviceSent={adviceSent}
          onChoose={chooseIslandTree}
        />
      )}
      {plan === "annual" ? <PeacePlayer onNeedPlan={() => onAction("/planos")} /> : null}
      {pendingDew.length > 0 && (
        <section className="humus-bed dew-pending">
          <span className="eyebrow">orvalho</span>
          <h2>O mural já soltou estas cartas. Só você decide o destino.</h2>
          {pendingDew.map((letter) => (
            <div className="dew-row" key={letter.id}>
              <p>{letter.title}</p>
              <div>
                <button type="button" className="button button-secondary" onClick={() => resolveDew(letter.id, "humus")}>Húmus</button>
                <button type="button" className="button button-quiet" onClick={() => resolveDew(letter.id, "diary")}>Diário</button>
              </div>
            </div>
          ))}
        </section>
      )}
      <section className="humus-bed fruit-basket">
        <span className="eyebrow">cesto</span>
        <h2>{fruitBasket === 0 ? "O cesto ainda espera." : `${fruitBasket} fruto${fruitBasket === 1 ? "" : "s"} colhido${fruitBasket === 1 ? "" : "s"}.`}</h2>
        <p>{fruitBasket === 0 ? "Quando a árvore ficar plena, os frutos piscam. É só colher — sem ranking, sem venda." : "A Luna guarda no cesto. A árvore segue de pé no jardim."}</p>
      </section>
      <section className="humus-bed">
        <span className="eyebrow"><Sprout size={14} /> húmus do jardim</span>
        <h2>{humusCount === 0 ? "Ainda não há húmus." : `${humusCount} carta${humusCount === 1 ? "" : "s"} viraram terra.`}</h2>
        <p>Quando uma carta sua sai do mural por sua escolha, ela pode virar húmus aqui — alimento quieto, sem plateia.</p>
      </section>
      <div className="metrics-grid garden-stats">
        <div><span className="metric-icon lavender"><Heart size={18} /></span><strong>{anonymous ? "—" : String(energiesSent).padStart(2, "0")}</strong><small>Energias enviadas</small></div>
        <div><span className="metric-icon blue"><BookHeart size={18} /></span><strong>{anonymous ? "—" : String(lettersRead).padStart(2, "0")}</strong><small>Cartas lidas</small></div>
        <div><span className="metric-icon peach"><Sparkles size={18} /></span><strong>{anonymous ? "—" : String(adviceSent).padStart(2, "0")}</strong><small>Conselhos enviados</small></div>
        <div><span className="metric-icon yellow"><Droplets size={18} /></span><strong>{anonymous ? "—" : String(dewDropsReceived).padStart(2, "0")}</strong><small>Gotas de orvalho</small></div>
      </div>
      <section className="garden-seals">
        <div className="section-heading"><div><span className="section-label">SELOS DE PRESENÇA</span><h2>{earnedCount} no seu caminho.</h2></div></div>
        <div className="badges-grid">
          {visibleSeals.map((item) => (
            <div className={`badge-card ${item.earned ? "earned" : "locked"}`} key={item.title}>
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.earned ? item.detail : "Ainda no caminho"}</small>
            </div>
          ))}
        </div>
      </section>
      <div className="garden-links">
        <button onClick={() => onAction("/diario")}><BookHeart size={21}/><span><strong>Diário emocional</strong><small>Escreva só para você</small></span><ChevronRight size={17}/></button>
        <button onClick={() => onAction("/memorias")}><Heart size={21}/><span><strong>Caixa da memória</strong><small>O que merece ficar</small></span><ChevronRight size={17}/></button>
      </div>
    </div>
  );
}
function CareHub({ onNavigate }) {
  return /* @__PURE__ */ jsx(CarePage, { onNavigate });
}
function Diary({ draft, onBack, onSaved, authenticated, entitlements = emptyEntitlements }) {
	const [editing, setEditing] = useState(false);
	const [note, setNote] = useState(draft);
	const [localEntries, setLocalEntries] = useState(() => typeof window === "undefined" ? [] : loadLocalDiary());
	const [pin, setPin] = useState("");
	const [unlocked, setUnlocked] = useState(false);
	const pinStatus = trpc.diary.pinStatus.useQuery(undefined, {
		enabled: authenticated && entitlements.diaryPassword,
		retry: false
	});
	const weekly = trpc.diary.weekly.useQuery(undefined, {
		enabled: authenticated && entitlements.weeklyCharts,
		retry: false
	});
	const setPinMut = trpc.diary.setPin.useMutation({ onSuccess: () => {
		setUnlocked(true);
		pinStatus.refetch();
	} });
	const unlockMut = trpc.diary.unlock.useMutation({ onSuccess: () => setUnlocked(true) });
	const needsPin = Boolean(authenticated && entitlements.diaryPassword && pinStatus.data?.enabled && !unlocked);
	const remote = trpc.diary.list.useQuery(undefined, {
		enabled: authenticated,
		retry: false
	});
	const createEntry = trpc.diary.create.useMutation({
		onSuccess: () => {
			remote.refetch();
			onSaved();
			setEditing(false);
			setNote("");
		},
		onError: () => {
			setLocalEntries(addLocalDiary(note.trim()));
			onSaved();
			setEditing(false);
			setNote("");
		}
	});
	const entries = authenticated && remote.data ? remote.data.map((entry) => ({
		id: String(entry.id),
		content: entry.content,
		createdAt: entry.createdAt ? new Date(entry.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
	})) : localEntries;
	const saveNote = () => {
		const content = note.trim();
		if (!content) return;
		if (authenticated) {
			createEntry.mutate({ content });
			return;
		}
		setLocalEntries(addLocalDiary(content));
		onSaved();
		setEditing(false);
		setNote("");
	};
	if (needsPin) return /* @__PURE__ */ jsx(Subpage, {
		title: "Diário com senha",
		eyebrow: "VIP",
		onBack,
		children: /* @__PURE__ */ jsxs("div", {
			className: "diary-card",
			children: [
				/* @__PURE__ */ jsx("span", { children: "PIN" }),
				/* @__PURE__ */ jsx("p", { children: "Este diário está protegido." }),
				/* @__PURE__ */ jsx("input", {
					inputMode: "numeric",
					value: pin,
					onChange: (e) => setPin(e.target.value),
					placeholder: "PIN de 4 a 6 números"
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "button button-primary",
					onClick: () => unlockMut.mutate({ pin }),
					children: "Abrir diário"
				}),
				unlockMut.error && /* @__PURE__ */ jsx("p", { children: unlockMut.error.message })
			]
		})
	});
	return /* @__PURE__ */ jsx(Subpage, {
		title: "Diário emocional",
		eyebrow: "só seu",
		onBack,
		children: /* @__PURE__ */ jsxs(ScreenshotGuard, {
			enabled: entitlements.screenshotGuard,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "private-note",
					children: [/* @__PURE__ */ jsx(LockKeyhole, { size: 17 }), /* @__PURE__ */ jsxs("span", { children: ["O que é escrito aqui não aparece no Mural.", authenticated ? " Com VIP, as anotações também ficam no seu Jardim sincronizado." : " Entre e assine o VIP para sincronizar entre dispositivos."] })]
				}),
				entitlements.weeklyCharts && weekly.data && /* @__PURE__ */ jsx(WeeklyChart, { counts: weekly.data }),
				entitlements.diaryPassword && authenticated && !pinStatus.data?.enabled && /* @__PURE__ */ jsxs("div", {
					className: "diary-card",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Proteger com senha" }),
						/* @__PURE__ */ jsx("input", {
							inputMode: "numeric",
							value: pin,
							onChange: (e) => setPin(e.target.value),
							placeholder: "Crie um PIN de 4 a 6 números"
						}),
						/* @__PURE__ */ jsx(Button, {
							className: "button button-secondary",
							onClick: () => setPinMut.mutate({ pin }),
							children: "Ativar senha do diário"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "diary-card",
					children: [/* @__PURE__ */ jsx("span", { children: "Hoje" }), editing ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "new-diary-note",
							className: "sr-only",
							children: "Nova anotação"
						}),
						/* @__PURE__ */ jsx("textarea", {
							id: "new-diary-note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Escreva sem pressa...",
							rows: 5
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "diary-actions",
							children: [/* @__PURE__ */ jsxs(Button, {
								className: "button button-primary",
								disabled: !note.trim() || createEntry.isPending,
								onClick: saveNote,
								children: [
									createEntry.isPending ? "Guardando..." : "Guardar anotação",
									" ",
									/* @__PURE__ */ jsx(Check, { size: 16 })
								]
							}), /* @__PURE__ */ jsx("button", {
								className: "button-quiet",
								onClick: () => setEditing(false),
								children: "Cancelar"
							})]
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("h2", { children: entries[0]?.content || "O que você quer lembrar deste momento?" }),
						/* @__PURE__ */ jsx("p", { children: entries.length ? `${entries.length} anotações guardadas neste Jardim.` : "Comece uma anotação para cuidar do que está vivo em você." }),
						/* @__PURE__ */ jsxs(Button, {
							className: "button button-secondary",
							onClick: () => setEditing(true),
							children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), " Nova anotação"]
						})
					] })]
				}),
				entries.length > 1 && /* @__PURE__ */ jsx("div", {
					className: "diary-history",
					children: entries.slice(1).map((entry) => /* @__PURE__ */ jsxs("article", {
						className: "diary-card",
						children: [/* @__PURE__ */ jsx("span", { children: new Date(entry.createdAt).toLocaleDateString("pt-BR") }), /* @__PURE__ */ jsx("p", { children: entry.content })]
					}, entry.id))
				})
			]
		})
	});
}
function Badges({ onBack }) {
  const pactOk = useRefugioStore((s) => s.pactOk);
  const energiesSent = useRefugioStore((s) => s.energiesSent);
  const adviceSent = useRefugioStore((s) => s.adviceSent);
  const dewDropsReceived = useRefugioStore((s) => s.dewDropsReceived);
  const lettersPublished = useRefugioStore((s) => s.lettersPublished);
  const days = useRefugioStore((s) => s.days);
  const amazonSeeds = useRefugioStore((s) => s.amazonSeeds);
  const plan = useRefugioStore((s) => s.plan);
  const energiesReceived = useRefugioStore((s) => s.energiesReceived);
  const userName = useRefugioStore((s) => s.userName);
  const letters = useRefugioStore((s) => s.letters);
  const items = listPresenceSeals({
    pactOk, energiesSent, adviceSent, dewDropsReceived, lettersPublished, days, amazonSeeds, plan, energiesReceived, userName, letters,
  }).filter((item) => !item.annual || plan === "annual");
  return (
    <Subpage title="Selos de presença" eyebrow="seu caminho" onBack={onBack}>
      <p className="filter-hint">Selos ficam só no seu Jardim. Não há placar, nem comparação.</p>
      <div className="badges-grid">
        {items.map((b) => (
          <div className={`badge-card ${b.earned ? "earned" : "locked"}`} key={b.title}>
            <span>{b.icon}</span>
            <strong>{b.title}</strong>
            <small>{b.earned ? b.detail : "Ainda no caminho"}</small>
          </div>
        ))}
      </div>
    </Subpage>
  );
}
function Memories({ onBack, authenticated, entitlements = emptyEntitlements }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [localItems, setLocalItems] = useState(() => typeof window === "undefined" ? [] : loadLocalMemories());
	const remote = trpc.memories.list.useQuery(undefined, {
		enabled: authenticated,
		retry: false
	});
	const createMemory = trpc.memories.create.useMutation({
		onSuccess: () => {
			remote.refetch();
			setTitle("");
			setContent("");
		},
		onError: () => {
			setLocalItems(addLocalMemory({
				title: title.trim(),
				content: content.trim(),
				sourceType: "note"
			}));
			setTitle("");
			setContent("");
		}
	});
	const items = authenticated && remote.data ? remote.data.map((item) => ({
		id: String(item.id),
		title: item.title,
		content: item.content,
		createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
	})) : localItems;
	const saveMemory = () => {
		if (!title.trim() || !content.trim()) return;
		if (authenticated) {
			createMemory.mutate({
				title: title.trim(),
				content: content.trim(),
				sourceType: "note"
			});
			return;
		}
		setLocalItems(addLocalMemory({
			title: title.trim(),
			content: content.trim(),
			sourceType: "note"
		}));
		setTitle("");
		setContent("");
	};
	const blocked = authenticated && !entitlements.memoryBox;
	return /* @__PURE__ */ jsx(Subpage, {
		title: "Caixa da memória",
		eyebrow: "o que merece ficar",
		onBack,
		children: /* @__PURE__ */ jsxs(ScreenshotGuard, {
			enabled: entitlements.screenshotGuard,
			children: [
				blocked && /* @__PURE__ */ jsxs("div", {
					className: "diary-card",
					children: [/* @__PURE__ */ jsx("span", { children: "VIP Anual" }), /* @__PURE__ */ jsx("p", { children: "A Caixa da Memória sincronizada é um benefício do plano anual. Sem ele, o que você guardar fica só neste aparelho." })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "diary-card",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Guardar um momento" }),
						/* @__PURE__ */ jsx("label", {
							htmlFor: "memory-title",
							className: "sr-only",
							children: "Título da memória"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "memory-title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Um título suave"
						}),
						/* @__PURE__ */ jsx("textarea", {
							value: content,
							onChange: (e) => setContent(e.target.value),
							placeholder: "O que merece ficar?",
							rows: 4
						}),
						/* @__PURE__ */ jsx(Button, {
							className: "button button-primary",
							disabled: !title.trim() || !content.trim() || createMemory.isPending,
							onClick: saveMemory,
							children: createMemory.isPending ? "Guardando..." : "Guardar memória"
						}),
						/* @__PURE__ */ jsx("small", { children: "No VIP Anual, as memórias sincronizam com sua conta. Sem assinatura, elas ficam neste dispositivo." })
					]
				}),
				items.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "empty-state large",
					children: [
						/* @__PURE__ */ jsx(BookHeart, { size: 32 }),
						/* @__PURE__ */ jsx("h2", { children: "Suas memórias cuidadas aparecem aqui." }),
						/* @__PURE__ */ jsx("p", { children: "Quando uma carta ou conselho encontrar um lugar especial, você poderá guardá-lo para revisitar depois." })
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "diary-history",
					children: items.map((item) => /* @__PURE__ */ jsxs("article", {
						className: "diary-card",
						children: [
							/* @__PURE__ */ jsx("span", { children: new Date(item.createdAt).toLocaleDateString("pt-BR") }),
							/* @__PURE__ */ jsx("h2", { children: item.title }),
							/* @__PURE__ */ jsx("p", { children: item.content })
						]
					}, item.id))
				})
			]
		})
	});
}
function Plans({ onBack, audioPlaying, onToggleAudio, userEmail, userName }) {
	const subscriptionQuery = trpc.billing.subscriptionStatus.useQuery();
	const { data: subscriptionStatus, refetch: refetchSubscription } = subscriptionQuery;
	const cancelSubscription = trpc.billing.cancelSubscription.useMutation({ onSuccess: () => subscriptionQuery.refetch() });
	const storePlan = useRefugioStore((s) => s.plan);
	const hasActiveVip = storePlan !== "free" || hasVipAccess(subscriptionStatus?.status);
	const currentPlan = storePlan;
	const canPlayFullSounds = currentPlan === "annual" || (hasVipAccess(subscriptionStatus?.status) && subscriptionStatus?.plan === "annual");
	const [preview, setPreview] = useState(null);
	const [checkoutPlan, setCheckoutPlan] = useState(null);
	const [checkoutStatus, setCheckoutStatus] = useState(null);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const status = params.get("checkout");
		const sessionId = params.get("session_id");
		if (status === "success" || status === "cancelled") {
			setCheckoutStatus(status);
			window.history.replaceState({}, "", window.location.pathname);
			if (status === "success") {
				if (sessionId) {
					import("@/lib/refugio/billing").then(({ confirmStripeCheckout }) => {
						confirmStripeCheckout({ data: { sessionId } })
							.then((result) => {
								if (result.paid && result.plan) {
									const store = useRefugioStore.getState();
									if (result.email) store.login({ email: result.email, name: store.userName });
									store.setPlan(result.plan);
								}
							})
							.finally(() => refetchSubscription());
					});
				} else refetchSubscription();
			}
		}
	}, [refetchSubscription]);
	const [samplePlaying, setSamplePlaying] = useState(false);
	const [selectedSound, setSelectedSound] = useState("Chuva mansa");
	const [volume, setVolume] = useState(62);
	const [progress, setProgress] = useState(0);
	const audioRef = useRef(null);
	const sampleRef = useRef(null);
	const sounds = peaceSounds;
	const monthlyPlan = vipPlanCatalog.monthly;
	const annualPlan = vipPlanCatalog.annual;
	const monthlyFeatures = monthlyPlan.benefits;
	const annualFeatures = annualPlan.benefits;
	const avatarSet = preview === "annual" ? [
		"🌙",
		"🌿",
		"🌻",
		"✨",
		"☁️",
		"🦋",
		"🌸",
		"🪐"
	] : [
		"🌙",
		"🌿",
		"🌻",
		"✨",
		"☁️",
		"🪴"
	];
	const frameSet = preview === "annual" ? [
		"Aura dourada",
		"Lua cheia",
		"Jardim vivo",
		"Constelação"
	] : [
		"Prata suave",
		"Lavanda",
		"Folha",
		"Lua"
	];
	const sealSet = [
		"🌙",
		"🌿",
		"💌",
		"✨",
		"🕯️",
		"🌻"
	];
	const currentSound = sounds.find((sound) => sound.name === selectedSound) ?? sounds[0];
	const ensureAudio = () => {
		if (!audioRef.current) {
			const el = new Audio(currentSound.src);
			el.loop = true;
			el.preload = "auto";
			audioRef.current = el;
		}
		return audioRef.current;
	};
	const stopMainSound = () => {
		const el = audioRef.current;
		if (el) {
			el.pause();
			el.currentTime = 0;
		}
	};
	const toggleMainSound = () => {
		if (!canPlayFullSounds) {
			setPreview("annual");
			return;
		}
		const el = ensureAudio();
		el.volume = volume / 100;
		if (audioPlaying) {
			el.pause();
			onToggleAudio();
			return;
		}
		el.play().catch(() => undefined);
		onToggleAudio();
	};
	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		el.src = currentSound.src;
		el.loop = true;
		if (audioPlaying) el.play().catch(() => undefined);
		setProgress(0);
	}, [
		selectedSound,
		audioPlaying,
		currentSound.src
	]);
	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume / 100;
	}, [volume]);
	useEffect(() => {
		if (!audioPlaying) return;
		const timer = window.setInterval(() => {
			const el = audioRef.current;
			if (!el || !el.duration || Number.isNaN(el.duration)) {
				setProgress((value) => value >= 99 ? 0 : value + 1);
				return;
			}
			setProgress(Math.round(el.currentTime / el.duration * 100));
		}, 400);
		return () => window.clearInterval(timer);
	}, [audioPlaying]);
	const stopSample = () => {
		sampleRef.current?.pause();
		if (sampleRef.current) sampleRef.current.currentTime = 0;
		setSamplePlaying(false);
	};
	const toggleSample = () => {
		if (samplePlaying) {
			stopSample();
			return;
		}
		const el = sampleRef.current ?? new Audio(sounds[0].src);
		sampleRef.current = el;
		el.loop = true;
		el.volume = .45;
		el.play().catch(() => undefined);
		setSamplePlaying(true);
	};
	useEffect(() => () => {
		stopSample();
		stopMainSound();
	}, []);
	return /* @__PURE__ */ jsxs(Subpage, {
		title: "Planos do Refúgio",
		eyebrow: "o que cada cuidado inclui",
		onBack,
		children: [
			checkoutStatus && /* @__PURE__ */ jsxs("div", {
				className: `checkout-status ${checkoutStatus}`,
				role: "status",
				children: [checkoutStatus === "success" ? "Assinatura iniciada com sucesso. Confira o recibo no seu e-mail." : "O checkout foi cancelado. Você pode tentar novamente quando quiser.", /* @__PURE__ */ jsx("button", {
					onClick: () => setCheckoutStatus(null),
					"aria-label": "Fechar mensagem",
					children: "×"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "plans-heading",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "section-label",
					children: "PLANOS DO REFÚGIO DA LUA"
				}), /* @__PURE__ */ jsx("h2", { children: "Mais espaço para cuidar de você." })] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "official-plans-grid",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "plan-card current-plan",
						children: [
							currentPlan === "free" && /* @__PURE__ */ jsx("span", {
								className: "plan-status",
								children: "Plano atual"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "plan-icon",
								children: /* @__PURE__ */ jsx(Leaf, { size: 22 })
							}),
							/* @__PURE__ */ jsx("h2", { children: "Gratuito" }),
							/* @__PURE__ */ jsx("p", { children: "O essencial para encontrar presença, escrever e começar seu Jardim." }),
							/* @__PURE__ */ jsxs("strong", {
								className: "plan-price",
								children: ["R$ 0 ", /* @__PURE__ */ jsx("small", { children: "/ sempre" })]
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "plan-features light-features",
								children: freePlanBenefits.map((feature) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check, { size: 15 }), feature] }, feature))
							}),
							/* @__PURE__ */ jsxs(Button, {
								className: "button button-secondary",
								disabled: currentPlan === "free",
								children: [currentPlan === "free" ? "Plano atual" : "Continuar no gratuito", currentPlan === "free" && /* @__PURE__ */ jsx(Check, { size: 15 })]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "plan-card monthly-plan",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "plan-ribbon popular-ribbon",
								children: [/* @__PURE__ */ jsx(Sparkles, { size: 14 }), " popular"]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "plan-icon",
								children: /* @__PURE__ */ jsx(Sparkles, { size: 22 })
							}),
							/* @__PURE__ */ jsx("h2", { children: monthlyPlan.name }),
							/* @__PURE__ */ jsx("p", { children: monthlyPlan.description }),
							/* @__PURE__ */ jsxs("strong", {
								className: "plan-price",
								children: [
									monthlyPlan.priceLabel,
									" ",
									/* @__PURE__ */ jsx("small", { children: monthlyPlan.cadenceLabel })
								]
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "plan-features light-features",
								children: monthlyFeatures.map((feature) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check, { size: 15 }), feature] }, feature))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "plan-action-row",
								children: [/* @__PURE__ */ jsxs(Button, {
									className: "button button-primary",
									disabled: currentPlan === "monthly",
									onClick: () => setCheckoutPlan("monthly"),
									children: [
										currentPlan === "monthly" ? "Plano atual" : monthlyPlan.cta,
										" ",
										!hasActiveVip && /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
									]
								}), /* @__PURE__ */ jsxs("button", {
									className: "preview-link",
									onClick: () => setPreview("monthly"),
									children: [/* @__PURE__ */ jsx(Sparkles, { size: 15 }), " Pré-visualizar"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "plan-card featured annual-plan",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "plan-ribbon best-ribbon",
								children: [/* @__PURE__ */ jsx(Crown, { size: 14 }), " melhor valor"]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "eyebrow",
								children: "para quem quer aprofundar"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "plan-icon gold-icon",
								children: /* @__PURE__ */ jsx(Crown, { size: 22 })
							}),
							/* @__PURE__ */ jsx("h2", { children: annualPlan.name }),
							/* @__PURE__ */ jsx("p", { children: annualPlan.description }),
							/* @__PURE__ */ jsxs("strong", {
								className: "plan-price",
								children: [
									annualPlan.priceLabel,
									" ",
									/* @__PURE__ */ jsx("small", { children: annualPlan.cadenceLabel })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "annual-equivalent",
								children: [/* @__PURE__ */ jsx("strong", { children: "R$ 8,33/mês" }), /* @__PURE__ */ jsx("span", { children: "~58% de economia em relação ao mensal" })]
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "plan-features",
								children: annualFeatures.map((feature) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Check, { size: 15 }), feature] }, feature))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "plan-action-row",
								children: [/* @__PURE__ */ jsxs(Button, {
									className: "button vip-button",
									disabled: currentPlan === "annual",
									onClick: () => setCheckoutPlan("annual"),
									children: [
										currentPlan === "annual" ? "Plano atual" : annualPlan.cta,
										" ",
										!hasActiveVip && /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
									]
								}), /* @__PURE__ */ jsxs("button", {
									className: "preview-link preview-link-light",
									onClick: () => setPreview("annual"),
									children: [/* @__PURE__ */ jsx(Sparkles, { size: 15 }), " Ver prévia VIP"]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "vip-note",
				children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 17 }), /* @__PURE__ */ jsx("span", { children: hasActiveVip ? `Seu ${currentPlan === "annual" ? "VIP Anual" : "VIP Mensal"} está ativo neste aparelho. Os benefícios já estão liberados.` : "Assinatura opcional, sem anúncios e sem ranking. Você pode cancelar quando quiser." })]
			}),
			subscriptionQuery.isLoading && /* @__PURE__ */ jsxs("div", {
				className: "inline-notice",
				role: "status",
				children: [/* @__PURE__ */ jsx(Loader2, {
					size: 16,
					className: "spin"
				}), " Conferindo o estado da sua assinatura..."]
			}),
			cancelSubscription.error && /* @__PURE__ */ jsxs("div", {
				className: "checkout-status cancelled",
				role: "alert",
				children: [cancelSubscription.error.message, /* @__PURE__ */ jsx("button", {
					onClick: () => cancelSubscription.reset(),
					"aria-label": "Fechar mensagem",
					children: "×"
				})]
			}),
			hasActiveVip && /* @__PURE__ */ jsx("button", {
				className: "button-quiet",
				disabled: cancelSubscription.isPending,
				onClick: () => {
					if (window.confirm("Deseja cancelar sua assinatura? O acesso permanecerá sujeito às regras do Stripe.")) cancelSubscription.mutate();
				},
				children: cancelSubscription.isPending ? "Cancelando assinatura..." : "Cancelar assinatura"
			}),
			checkoutPlan && /* @__PURE__ */ jsx(CheckoutModal, {
				plan: checkoutPlan,
				defaultEmail: userEmail,
				defaultName: userName,
				onClose: () => setCheckoutPlan(null),
				onStarted: () => setCheckoutPlan(null)
			}),
			preview && /* @__PURE__ */ jsx("div", {
				className: "preview-overlay",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "vip-preview-title",
				onClick: () => {
					stopSample();
					setPreview(null);
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "preview-modal",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("button", {
							className: "preview-close",
							"aria-label": "Fechar pré-visualização",
							onClick: () => {
								stopSample();
								setPreview(null);
							},
							children: /* @__PURE__ */ jsx(X, { size: 19 })
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "eyebrow",
							children: [/* @__PURE__ */ jsx(Sparkles, { size: 14 }), " uma amostra do seu Refúgio"]
						}),
						/* @__PURE__ */ jsx("h2", {
							id: "vip-preview-title",
							children: "Veja como pode ser por dentro."
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "preview-lead",
							children: [
								"Esta é uma prévia dos detalhes exclusivos de ",
								preview === "annual" ? "VIP Anual" : "VIP Mensal",
								". Nada é ativado sem sua escolha."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "preview-section",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "preview-section-heading",
									children: [/* @__PURE__ */ jsx("span", {
										className: "preview-mini-icon",
										children: /* @__PURE__ */ jsx(UserRound, { size: 17 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Avatares exclusivos" }), /* @__PURE__ */ jsx("small", { children: preview === "annual" ? "Dourados, molduras e aura iluminada" : "Prata, com acabamento suave" })] })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: `vip-avatar-showcase ${preview === "annual" ? "gold-showcase" : "silver-showcase"}`,
									children: avatarSet.map((avatar, index) => /* @__PURE__ */ jsx("span", {
										title: frameSet[index % frameSet.length],
										children: avatar
									}, `${avatar}-${index}`))
								}),
								/* @__PURE__ */ jsx("div", {
									className: "frame-tags",
									children: frameSet.map((frame) => /* @__PURE__ */ jsxs("span", { children: [
										/* @__PURE__ */ jsx("span", { className: "frame-dot" }),
										" ",
										frame
									] }, frame))
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "preview-section",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "preview-section-heading",
									children: [/* @__PURE__ */ jsx("span", {
										className: "preview-mini-icon seal-preview-icon",
										children: /* @__PURE__ */ jsx(Crown, { size: 17 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Selos de cera e papéis" }), /* @__PURE__ */ jsx("small", { children: preview === "annual" ? "Coleção completa para suas cartas" : "5 combinações para começar" })] })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "wax-seal-showcase",
									children: sealSet.map((seal, index) => /* @__PURE__ */ jsx("span", {
										className: `wax-seal wax-seal-${index + 1}`,
										children: seal
									}, `${seal}-${index}`))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "paper-swatches",
									children: [
										/* @__PURE__ */ jsx("span", { children: "papel lunar" }),
										/* @__PURE__ */ jsx("span", { children: "lavanda" }),
										/* @__PURE__ */ jsx("span", { children: "carta jardim" }),
										/* @__PURE__ */ jsx("span", { children: "noite azul" })
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "preview-section",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "preview-section-heading",
									children: [/* @__PURE__ */ jsx("span", {
										className: "preview-mini-icon sound-preview-icon",
										children: /* @__PURE__ */ jsx(Volume2, { size: 17 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Uma amostra de Sons de Paz" }), /* @__PURE__ */ jsx("small", { children: "Chuva mansa · ASMR · 20 segundos" })] })]
								}),
								/* @__PURE__ */ jsxs("button", {
									className: `sample-button ${samplePlaying ? "playing" : ""}`,
									onClick: toggleSample,
									children: [samplePlaying ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Pause, { size: 17 }), " Pausar amostra"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Play, { size: 17 }), " Ouvir amostra"] }), /* @__PURE__ */ jsxs("span", {
										className: "sample-wave",
										children: [
											/* @__PURE__ */ jsx("i", {}),
											/* @__PURE__ */ jsx("i", {}),
											/* @__PURE__ */ jsx("i", {}),
											/* @__PURE__ */ jsx("i", {}),
											/* @__PURE__ */ jsx("i", {}),
											/* @__PURE__ */ jsx("i", {})
										]
									})]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "sample-note",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 13 }), " O som é reproduzido apenas quando você tocar no botão."]
								})
							]
						}),
						preview === "annual" && /* @__PURE__ */ jsxs("div", {
							className: "preview-section",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "preview-section-heading",
								children: [/* @__PURE__ */ jsx("span", {
									className: "preview-mini-icon",
									children: /* @__PURE__ */ jsx(Sprout, { size: 17 })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Bosque Amazônico" }), /* @__PURE__ */ jsx("small", { children: "Samaúma, castanheira, açaí, seringueira e outras nativas. Aconselhe para ganhar uma semente; energias positivas fazem ela crescer." })] })]
							}), /* @__PURE__ */ jsx(AmazonGrovePreview, {})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "preview-footer",
							children: [/* @__PURE__ */ jsx("span", { children: "Prévia demonstrativa" }), /* @__PURE__ */ jsxs("button", {
								onClick: () => {
									stopSample();
									setPreview(null);
								},
								children: ["Continuar conhecendo ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
							})]
						})
					]
				})
			})
		]
	});
}
function Notifications({ onBack }) {
	const notices = useRefugioStore((s) => s.notices);
	const markNoticeRead = useRefugioStore((s) => s.markNoticeRead);
	const receiveEnergy = useRefugioStore((state) => state.receiveEnergy);
	return /* @__PURE__ */ jsxs(Subpage, {
		title: "Notificações",
		eyebrow: "pequenos sinais de presença",
		onBack,
		children: [/* @__PURE__ */ jsx("div", {
			className: "notification-list",
			children: notices.map((item) => /* @__PURE__ */ jsxs("button", {
				className: item.read ? "read" : "",
				onClick: () => {
					if (!item.read && item.kind === "energy") receiveEnergy(1);
					markNoticeRead(item.id);
				},
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "notification-icon",
						children: item.kind === "energy" ? /* @__PURE__ */ jsx(Heart, { size: 17 }) : item.kind === "letter" ? /* @__PURE__ */ jsx(BookHeart, { size: 17 }) : /* @__PURE__ */ jsx(Sparkles, { size: 17 })
					}),
					/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: item.title }), /* @__PURE__ */ jsx("small", { children: item.text })] }),
					/* @__PURE__ */ jsx("time", { children: item.time }),
					!item.read && /* @__PURE__ */ jsx("i", {})
				]
			}, item.id))
		}), notices.length === 0 && /* @__PURE__ */ jsxs("div", {
			className: "empty-state notification-empty",
			children: [/* @__PURE__ */ jsx(Bell, { size: 24 }), /* @__PURE__ */ jsx("p", { children: "Você está em um espaço sem urgência. As notificações ficam aqui para lembrar, nunca para cobrar." })]
		})]
	});
}
function Support({ onBack }) {
  return /* @__PURE__ */ jsx(Subpage, {
    title: "Apoio imediato",
    eyebrow: "você não está sozinho",
    onBack,
    children: /* @__PURE__ */ jsxs(Fragment, {
      children: [
        /* @__PURE__ */ jsx(CarePage, { onNavigate: (path) => window.location.assign(path) }),
        /* @__PURE__ */ jsx("p", {
          className: "auth-optional",
          children: /* @__PURE__ */ jsx(Link, { href: "/contato", children: "Relatar algo ou falar com o Refúgio" })
        })
      ]
    })
  });
}
function Contact({ onBack }) {
  const [topic, setTopic] = useState("relato");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  return /* @__PURE__ */ jsxs("div", {
    className: "center-page public-page",
    children: [
      /* @__PURE__ */ jsx(Logo, { compact: true }),
      /* @__PURE__ */ jsxs("div", {
        className: "simple-card",
        children: [
          /* @__PURE__ */ jsx("div", { className: "icon-disc", children: /* @__PURE__ */ jsx(Mail, { size: 24 }) }),
          /* @__PURE__ */ jsx("h1", { children: sent ? "Recebemos." : "Fale com o Refúgio." }),
          /* @__PURE__ */ jsx("p", {
            children: sent
              ? "A mensagem chegou até nós. Respondemos no e-mail que você deixou. Crise agora: 188."
              : "Use este espaço para relatar uma carta, um erro no site ou falar com a gente. Não é o CVV. Se estiver em risco, ligue 188."
          }),
          !sent && /* @__PURE__ */ jsxs("p", {
            children: ["E-mail da casa: ", /* @__PURE__ */ jsx("a", {
              href: "mailto:contato@refugiodalua.com.br",
              children: "contato@refugiodalua.com.br"
            })]
          }),
          !sent && /* @__PURE__ */ jsxs("form", {
            onSubmit: (e) => {
              e.preventDefault();
              setError("");
              const reply = email.trim();
              if (!reply.includes("@")) {
                setError("Precisamos de um e-mail para te responder.");
                return;
              }
              if (body.trim().length < 8) {
                setError("Escreva um pouco mais, para entendermos.");
                return;
              }
              setPending(true);
              void sendContactNote({
                data: { name, email: reply, topic, body: body.trim() }
              }).then(() => setSent(true)).catch((err) => {
                setError(err instanceof Error ? err.message : "Não foi possível enviar.");
              }).finally(() => setPending(false));
            },
            children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "contact-topic", children: "Sobre o quê?" }),
              /* @__PURE__ */ jsxs("select", {
                id: "contact-topic",
                value: topic,
                onChange: (e) => setTopic(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "relato", children: "Relatar uma carta ou conduta" }),
                  /* @__PURE__ */ jsx("option", { value: "tecnico", children: "Problema no site" }),
                  /* @__PURE__ */ jsx("option", { value: "outro", children: "Outro assunto" })
                ]
              }),
              /* @__PURE__ */ jsx("label", { htmlFor: "contact-name", children: "Como te chamamos (opcional)" }),
              /* @__PURE__ */ jsx("input", {
                id: "contact-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Pseudônimo"
              }),
              /* @__PURE__ */ jsx("label", { htmlFor: "contact-email", children: "E-mail para a gente responder" }),
              /* @__PURE__ */ jsx("input", {
                id: "contact-email",
                type: "email",
                required: true,
                autoComplete: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "voce@email.com"
              }),
              /* @__PURE__ */ jsx("label", { htmlFor: "contact-body", children: "Mensagem" }),
              /* @__PURE__ */ jsx("textarea", {
                id: "contact-body",
                value: body,
                onChange: (e) => setBody(e.target.value),
                rows: 6,
                maxLength: 4000,
                placeholder: "Conte com calma o que aconteceu."
              }),
              error && /* @__PURE__ */ jsx("p", { className: "checkout-error", role: "alert", children: error }),
              /* @__PURE__ */ jsxs(Button, {
                className: "button button-primary full-button",
                disabled: pending,
                children: [pending ? "Enviando..." : "Enviar", " ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("button", {
            className: "button-quiet",
            onClick: onBack,
            children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar"]
          })
        ]
      })
    ]
  });
}
function Subpage({ title, eyebrow, onBack, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "content-page",
		children: [
			/* @__PURE__ */ jsxs("button", {
				className: "back-link",
				onClick: onBack,
				children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Voltar ao Jardim"]
			}),
			/* @__PURE__ */ jsx(PageIntro, {
				eyebrow,
				title
			}),
			children
		]
	});
}
function Profile({ name, onBack, onEdit, entitlements = emptyEntitlements, plan = "free" }) {
	const avatarKey = useRefugioStore((s) => s.avatarKey);
	const frameKey = useRefugioStore((s) => s.frameKey);
	const storePlan = useRefugioStore((s) => s.plan);
	const setAvatar = useRefugioStore((s) => s.setAvatar);
	const setFrame = useRefugioStore((s) => s.setFrame);
	const saveName = useRefugioStore((s) => s.setUserName);
	const [nick, setNick] = useState(name === "Girassol sereno" ? "" : name);
	const activePlan = storePlan === "monthly" || storePlan === "annual" ? storePlan : plan;
	const savePrefs = trpc.vip.savePreferences.useMutation({ onSuccess: onEdit });
	const glyph = avatars.find((item) => item.key === avatarKey)?.glyph ?? "🌿";
	const showFrames = activePlan === "monthly" || activePlan === "annual";
	return /* @__PURE__ */ jsx(Subpage, {
		title: "Seu perfil",
		eyebrow: "sua identidade no Refúgio",
		onBack,
		children: /* @__PURE__ */ jsxs("div", {
			className: "profile-card",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: `profile-avatar ${entitlements.avatarsGold ? "gold-aura" : entitlements.avatarsSilver ? "silver-aura" : ""} frame-${frameKey}`,
					children: glyph
				}),
				/* @__PURE__ */ jsx("h2", { children: nick.trim() || name }),
				/* @__PURE__ */ jsx("p", { children: "Um perfil feito de cuidado, não de exposição. No mural aparece só este nome." }),
				/* @__PURE__ */ jsx("label", {
					htmlFor: "profile-nick",
					className: "form-label",
					children: "Seu pseudônimo"
				}),
				/* @__PURE__ */ jsx("input", {
					id: "profile-nick",
					value: nick,
					maxLength: 28,
					placeholder: "Ex.: Maré Serena",
					onChange: (e) => setNick(e.target.value),
					onBlur: () => {
						const next = nick.trim();
						if (next.length >= 2) {
							saveName(next);
							onEdit();
						}
					}
				}),
				/* @__PURE__ */ jsx("span", {
					className: "field-hint",
					children: "É assim que suas cartas e conselhos são assinados. Sem nome civil, sem e-mail."
				}),
				/* @__PURE__ */ jsx("span", {
					className: "form-label",
					children: "Avatares"
				}),
				/* @__PURE__ */ jsx(CollectionPicker, {
					kind: "avatar",
					plan: activePlan,
					value: avatarKey,
					onChange: (key) => {
						setAvatar(key);
						savePrefs.mutate({ avatarKey: key });
					}
				}),
				showFrames && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "form-label",
					children: "Molduras"
				}), /* @__PURE__ */ jsx(CollectionPicker, {
					kind: "frame",
					plan: activePlan,
					value: frameKey,
					onChange: (key) => {
						setFrame(key);
						savePrefs.mutate({ frameKey: key });
					}
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "profile-stats",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: weeklyLetterLimit(activePlan) }), /* @__PURE__ */ jsx("small", { children: "cartas / semana" })] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: activePlan === "annual" ? "Anual" : activePlan === "monthly" ? "Mensal" : "Livre" }), /* @__PURE__ */ jsx("small", { children: "plano atual" })] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: entitlements.avatarsGold ? "ouro" : entitlements.avatarsSilver ? "prata" : "básico" }), /* @__PURE__ */ jsx("small", { children: "visual" })] })
					]
				})
			]
		})
	});
}
function SettingsPage({ onBack, onLogout }) {
	const [confirming, setConfirming] = useState(false);
	const [phrase, setPhrase] = useState("");
	const [error, setError] = useState("");
	const theme = useRefugioStore((s) => s.theme);
	const setTheme = useRefugioStore((s) => s.setTheme);
	const liveNotices = useRefugioStore((s) => s.liveNotices);
	const setLiveNotices = useRefugioStore((s) => s.setLiveNotices);
	const plan = useRefugioStore((s) => s.plan);
	const vipProtect = plan === "monthly" || plan === "annual";
	const deleteAccount = trpc.auth.deleteAccount.useMutation({
		onSuccess: () => onLogout(),
		onError: (err) => setError(err.message)
	});
	return /* @__PURE__ */ jsxs(Subpage, {
		title: "Configurações",
		eyebrow: "controle e privacidade",
		onBack,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "settings-list",
				children: [
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(Plus, { size: 18 }),
						title: "Instalar o app",
						description: "Coloque o Refúgio na tela inicial. Sem loja, sem download suspeito.",
						action: "Como instalar",
						onClick: () => window.location.assign("/instalar")
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(Moon, { size: 18 }),
						title: "Modo noturno",
						description: "Um fundo mais baixo para ler à noite, sem mudar o que você escreveu.",
						action: theme === "night" ? "Desativar" : "Ativar",
						onClick: () => setTheme(theme === "night" ? "day" : "night")
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(Bell, { size: 18 }),
						title: "Avisos na tela",
						description: liveNotices
							? "Quando algo acontece no seu jardim, o celular pode avisar mesmo com o app ao fundo."
							: "Ligue para receber um aviso na tela (carta, conselho, orvalho).",
						action: liveNotices ? "Ligados" : "Ligar",
						onClick: () => {
							if (liveNotices) {
								setLiveNotices(false);
								return;
							}
							void askNoticePermission().then((ok) => {
								setLiveNotices(true);
								if (!ok) {
									/* still keep in-app bell */
								}
							});
						}
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }),
						title: "Proteção de captura",
						description: vipProtect
							? "Ativa no seu plano VIP. As cartas ficam com marca d’água e sem cópia neste aparelho."
							: "Privilégio VIP: as cartas ganham marca d’água e não podem ser copiadas daqui.",
						action: vipProtect ? "Ativa" : "Ver planos",
						onClick: () => {
							if (!vipProtect) window.location.assign("/planos");
						}
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(Crown, { size: 18 }),
						title: plan === "free" ? "Plano atual: Livre" : plan === "annual" ? "Plano atual: VIP Anual" : "Plano atual: VIP Mensal",
						description: plan === "free" ? "O mural essencial, sem cobrança." : "Os benefícios estão ativos neste aparelho. Pode voltar ao livre quando quiser.",
						action: plan === "free" ? "Ver planos" : "Cancelar VIP",
						onClick: () => {
							if (plan === "free") window.location.assign("/planos");
							else useRefugioStore.getState().cancelPlan();
						}
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(UserRound, { size: 18 }),
						title: "Identidade",
						description: "Seu pseudônimo aparece no mural. O nome civil não é pedido.",
						action: "Ver perfil",
						onClick: () => window.location.assign("/perfil")
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(Heart, { size: 18 }),
						title: "Pacto de empatia",
						description: "Releia o acordo que sustenta este espaço.",
						action: "Abrir",
						onClick: () => window.location.assign("/onboarding/pacto")
					}),
					/* @__PURE__ */ jsx(SettingRow, {
						icon: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }),
						title: "Privacidade",
						description: "Leia como o Refúgio trata seus dados",
						action: "Abrir",
						onClick: () => window.location.assign("/privacidade")
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "diary-card",
				children: [
					/* @__PURE__ */ jsx("span", { children: "Apagar conta" }),
					/* @__PURE__ */ jsx("p", { children: "Isso remove seu login, diário, memórias, preferências e cartas publicadas desta conta. Não tem volta." }),
					!confirming ? /* @__PURE__ */ jsx(Button, {
						className: "button button-secondary",
						onClick: () => setConfirming(true),
						children: "Quero apagar minha conta"
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("p", { children: [
							"Digite ",
							/* @__PURE__ */ jsx("strong", { children: "APAGAR" }),
							" para confirmar."
						] }),
						/* @__PURE__ */ jsx("input", {
							value: phrase,
							onChange: (e) => setPhrase(e.target.value),
							placeholder: "APAGAR",
							autoComplete: "off"
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "checkout-error",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "diary-actions",
							children: [/* @__PURE__ */ jsx(Button, {
								className: "button button-primary",
								disabled: phrase.trim().toUpperCase() !== "APAGAR" || deleteAccount.isPending,
								onClick: () => deleteAccount.mutate(),
								children: deleteAccount.isPending ? "Apagando..." : "Apagar definitivamente"
							}), /* @__PURE__ */ jsx("button", {
								className: "button-quiet",
								onClick: () => setConfirming(false),
								children: "Cancelar"
							})]
						})
					] })
				]
			}),
			/* @__PURE__ */ jsxs("button", {
				className: "logout-row",
				onClick: onLogout,
				children: [/* @__PURE__ */ jsx(LogOut, { size: 17 }), " Sair do Refúgio"]
			})
		]
	});
}
function SettingRow({ icon, title, description, action, onClick }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "setting-row",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "setting-icon",
				children: icon
			}),
			/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx("small", { children: description })] }),
			/* @__PURE__ */ jsxs("button", {
				onClick,
				children: [action, /* @__PURE__ */ jsx(ChevronRight, { size: 16 })]
			})
		]
	});
}
function NotFound({ onHome }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "center-page public-page",
		children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsxs("div", {
			className: "simple-card",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "icon-disc",
					children: /* @__PURE__ */ jsx(Moon, { size: 24 })
				}),
				/* @__PURE__ */ jsx("h1", { children: "Essa trilha ainda não existe." }),
				/* @__PURE__ */ jsx("p", { children: "Mas você pode voltar para um lugar conhecido." }),
				/* @__PURE__ */ jsxs(Button, {
					className: "button button-primary",
					onClick: onHome,
					children: ["Voltar ao início ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				})
			]
		})]
	});
}
function InstallHelp() {
	const { canInstall, installed, install } = useInstallPrompt();
	const loggedIn = useRefugioStore((s) => s.loggedIn);
	const pactOk = useRefugioStore((s) => s.pactOk);
	const nickChosen = useRefugioStore((s) => s.nickChosen);
	const next = !loggedIn ? "/conta" : !pactOk ? "/onboarding/pacto" : !nickChosen ? "/onboarding/perfil" : "/mural";
	const nextLabel = loggedIn ? "Voltar ao mural" : "Entrar e começar";
	return /* @__PURE__ */ jsxs("div", {
		className: "center-page public-page",
		children: [/* @__PURE__ */ jsx(Logo, { compact: true }), /* @__PURE__ */ jsxs("div", {
			className: "simple-card",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "icon-disc",
					children: /* @__PURE__ */ jsx(Sparkles, { size: 24 })
				}),
				/* @__PURE__ */ jsx("h1", { children: installed ? "O Refúgio já está neste aparelho." : "Baixe o app, sem loja." }),
				/* @__PURE__ */ jsx("p", { children: "É o mesmo site, com cara de aplicativo: tela inicial, ícone da lua, sem Play Store e sem App Store." }),
				canInstall && /* @__PURE__ */ jsxs(Button, {
					className: "button button-primary full-button",
					onClick: () => { void install(); },
					children: ["Instalar agora ", /* @__PURE__ */ jsx(Plus, { size: 16 })]
				}),
				/* @__PURE__ */ jsxs("div", { className: "install-steps", children: [
					/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Android (Chrome):" }), " toque nos três pontos → Instalar app. Ou no botão acima, se aparecer."] }),
					/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "iPhone (Safari):" }), " botão Compartilhar (quadrado com seta) → Adicionar à Tela de Início."] }),
					/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Computador:" }), " no Chrome ou Edge, o ícone de instalar aparece na barra de endereço."] })
				] }),
				/* @__PURE__ */ jsx(Link, {
					href: next,
					className: "button button-secondary",
					children: nextLabel
				})
			]
		})]
	});
}
function RefugioApp() {
	return /* @__PURE__ */ jsxs(Fragment, {
		children: [/* @__PURE__ */ jsx(WelcomeSplash, {}), /* @__PURE__ */ jsx(App, {})]
	});
}
export { RefugioApp };
