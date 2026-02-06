export type Lang = "ru" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

type Dict = Record<string, string>;

const RU: Dict = {
  // Top
  login: "Войти",
  register: "Регистрация",
  language: "Язык",

  // Nav
  menu: "Меню",
  tournaments: "Турниры",
  bonuses: "Бонусы",
  cashier: "Касса",
  account: "Аккаунт",
  robinson: "Робинзон",
  about: "О нас",

  // Shell
  feelThePulse: "Feel the Pulse. Win Bigger.",

  // Sheets
  close: "Закрыть",
  understood: "Понятно",
  openTournaments: "Открыть страницу турниров",
  tournamentsTitle: "Турниры",
  tournamentsDesc:
    "Здесь будет список активных турниров и лидерборды. Пока что — заглушка.",

  // Tournament content
  dailySprintTitle: "Daily Sprint 24/7",
  dailySprintRulesTitle: "Правила турнира",
  dailySprintRulesText:
    "Победа определяется по наибольшему выбитому множителю (X). Просто начни полёт и выбивай максимальный множитель.",
  minBet: "Минимальная ставка",
  prizePool: "Призовой фонд",
  splitTop50: "Призовой фонд делится между ТОП‑50 участниками.",
};

const EN: Dict = {
  // Top
  login: "Log in",
  register: "Sign up",
  language: "Language",

  // Nav
  menu: "Menu",
  tournaments: "Tournaments",
  bonuses: "Bonuses",
  cashier: "Cashier",
  account: "Account",
  robinson: "Robinson",
  about: "About",

  // Shell
  feelThePulse: "Feel the Pulse. Win Bigger.",

  // Sheets
  close: "Close",
  understood: "Got it",
  openTournaments: "Open tournaments page",
  tournamentsTitle: "Tournaments",
  tournamentsDesc:
    "Active tournaments and leaderboards will be here. For now — placeholder.",

  // Tournament content
  dailySprintTitle: "Daily Sprint 24/7",
  dailySprintRulesTitle: "Tournament rules",
  dailySprintRulesText:
    "Winner is determined by the highest multiplier (X). Just start the flight and hit the biggest multiplier.",
  minBet: "Minimum bet",
  prizePool: "Prize pool",
  splitTop50: "The prize pool is shared among the Top 50 players.",
};

export function t(lang: Lang, key: keyof typeof RU): string {
  const dict = lang === "en" ? EN : RU;
  return dict[key] ?? RU[key] ?? key;
}
