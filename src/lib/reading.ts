import type { Fixture, LeagueId, Referee, Team } from "@/data/corte";
import { leagues, refereeById, teamById } from "@/data/corte";

/** Base de penales por partido cuando el árbitro pita el promedio de faltas de su liga. */
const BASE_PENALTIES = 0.3;

export type LeagueAvg = {
  yellows: number;
  reds: number;
  fouls: number;
  matches: number;
  referees: number;
};

export type Reading = {
  yellows: number;
  yellowSource: "blend" | "referee" | "teams";
  refYellows: number | null;
  teamYellows: number | null;
  pRed: number | null;
  pPen: number | null;
  penPer: number | null;
  pOver45: number;
  pOver55: number;
  heat: "caliente" | "vivo" | "tranquilo";
};

export function fmt(value: number, digits = 1): string {
  return value.toFixed(digits).replace(".", ",");
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function teamYpg(team: Team): number | null {
  if (team.yellows == null || team.sample <= 0) return null;
  return team.yellows / team.sample;
}

export function leagueAverage(refs: Referee[]): LeagueAvg {
  const usable = refs.filter((ref) => ref.matches > 0);
  const matches = usable.reduce((sum, ref) => sum + ref.matches, 0);
  if (matches === 0) {
    return { yellows: 0, reds: 0, fouls: 0, matches: 0, referees: 0 };
  }
  const weighted = (pick: (ref: Referee) => number) =>
    usable.reduce((sum, ref) => sum + pick(ref) * ref.matches, 0) / matches;
  return {
    yellows: weighted((ref) => ref.yellowsPer),
    reds: weighted((ref) => ref.redsPer),
    fouls: weighted((ref) => ref.foulsPer),
    matches,
    referees: usable.length,
  };
}

function poissonCdf(maxK: number, lambda: number): number {
  if (lambda <= 0) return 1;
  let term = Math.exp(-lambda);
  let sum = term;
  for (let k = 1; k <= maxK; k += 1) {
    term *= lambda / k;
    sum += term;
  }
  return Math.min(1, sum);
}

export function pAtLeastOne(lambda: number): number {
  return 1 - Math.exp(-Math.max(0, lambda));
}

export function penLambda(ref: Referee, avgFouls: number): number {
  if (ref.matches <= 0 || avgFouls <= 0) return 0;
  return BASE_PENALTIES * (ref.foulsPer / avgFouls);
}

function blendWeight(league: LeagueId): number {
  if (league === "peru") return 0.72;
  if (league === "chile") return 0.58;
  return 1;
}

export function level(kind: "red" | "pen", value: number | null): "alta" | "media" | "baja" | "sinde" {
  if (value == null) return "sinde";
  if (kind === "red") {
    if (value >= 0.45) return "alta";
    if (value >= 0.3) return "media";
    return "baja";
  }
  if (value >= 0.32) return "alta";
  if (value >= 0.25) return "media";
  return "baja";
}

export function readFixture(fixture: Fixture, ref: Referee | null, avg: LeagueAvg): Reading | null {
  const home = teamById.get(fixture.homeId);
  const away = teamById.get(fixture.awayId);
  if (!home || !away) return null;

  const homeY = teamYpg(home);
  const awayY = teamYpg(away);
  const teamYellows = homeY != null && awayY != null ? homeY + awayY : null;
  const refOk = ref != null && ref.matches > 0;

  let yellows = 0;
  let yellowSource: Reading["yellowSource"] = "teams";
  if (refOk && teamYellows != null) {
    const weight = blendWeight(fixture.league);
    yellows = weight * ref.yellowsPer + (1 - weight) * teamYellows;
    yellowSource = "blend";
  } else if (refOk) {
    yellows = ref.yellowsPer;
    yellowSource = "referee";
  } else if (teamYellows != null) {
    yellows = teamYellows;
    yellowSource = "teams";
  } else {
    return null;
  }

  const pRed = refOk ? pAtLeastOne(ref.redsPer) : null;
  const pens = refOk ? penLambda(ref, avg.fouls) : null;
  const pPen = pens == null ? null : pAtLeastOne(pens);
  const heatScore =
    (pRed ?? 0.22) * 110 + (pPen ?? 0.22) * 100 + Math.min(yellows, 8) * 6;
  const heat: Reading["heat"] =
    heatScore >= 92 ? "caliente" : heatScore >= 74 ? "vivo" : "tranquilo";

  return {
    yellows,
    yellowSource,
    refYellows: refOk ? ref.yellowsPer : null,
    teamYellows,
    pRed,
    pPen,
    penPer: pens,
    pOver45: 1 - poissonCdf(4, yellows),
    pOver55: 1 - poissonCdf(5, yellows),
    heat,
  };
}

export function styleTags(ref: Referee, avg: LeagueAvg): string[] {
  const tags: string[] = [];
  if (ref.unlisted || ref.matches === 0) return ["Sin muestra"];
  if (ref.matches < 6) tags.push("Muestra chica");
  if (ref.fifa) tags.push("FIFA");
  if (avg.yellows > 0 && ref.yellowsPer >= avg.yellows * 1.15) tags.push("Amarillero");
  else if (avg.yellows > 0 && ref.yellowsPer <= avg.yellows * 0.85) tags.push("Permisivo");
  if (avg.reds > 0 && ref.redsPer >= avg.reds * 1.35) tags.push("Rojero");
  if (avg.fouls > 0 && ref.foulsPer >= avg.fouls * 1.12) tags.push("Muchas faltas");
  else if (avg.fouls > 0 && ref.foulsPer <= avg.fouls * 0.88) tags.push("Deja jugar");
  return tags;
}

export function whyLine(fixture: Fixture, ref: Referee | null, reading: Reading): string {
  const home = teamById.get(fixture.homeId);
  const away = teamById.get(fixture.awayId);
  const homeName = home?.short ?? "Local";
  const awayName = away?.short ?? "Visita";

  const homeY = home ? teamYpg(home) : null;
  const awayY = away ? teamYpg(away) : null;

  if (!ref || ref.matches <= 0) {
    if (homeY != null && awayY != null) {
      return `${homeName} recibe ${fmt(homeY)} amarillas por partido y ${awayName} ${fmt(awayY)}. Sin juez con muestra no hay lectura de roja ni de penal.`;
    }
    return `${ref?.name ?? "Este juez"} no tiene muestra en el corte. Elegí otro perfil para proyectar roja y penal.`;
  }

  let teamBit = " Acá no hay ranking de equipos: manda el árbitro.";
  if (reading.teamYellows != null) {
    teamBit = ` ${homeName} y ${awayName} se combinan en ${fmt(reading.teamYellows)} amarillas de equipo.`;
  } else if (homeY != null || awayY != null) {
    const side = (name: string, value: number | null) =>
      value == null ? `${name} no está en el ranking` : `${name} recibe ${fmt(value)}`;
    teamBit = ` ${side(homeName, homeY)} y ${side(awayName, awayY)}. Falta un lado, así que las amarillas salen del juez.`;
  }
  const sampleBit = ref.matches < 6 ? " Ojo: la muestra es chica y el número se mueve fácil." : "";
  const leagueName = leagues[fixture.league].country;
  return `${ref.name} en ${leagueName}: ${fmt(ref.yellowsPer)} amarillas, ${fmt(ref.redsPer)} rojas y ${fmt(ref.foulsPer)} faltas por partido en ${ref.matches} juegos.${teamBit}${sampleBit}`;
}

export function chosenReferee(fixture: Fixture, picks: Record<string, string>): Referee | null {
  const id = picks[fixture.id] ?? fixture.refereeId;
  if (!id) return null;
  return refereeById.get(id) ?? null;
}
