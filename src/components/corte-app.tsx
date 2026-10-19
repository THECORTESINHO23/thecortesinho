import { useEffect, useMemo, useState } from "react";
import logoUrl from "@/assets/logo.jpg";
import {
  fixturesOf,
  leagues,
  refereeById,
  refereesOf,
  teamById,
  type Fixture,
  type LeagueId,
  type Referee,
} from "@/data/corte";
import {
  chosenReferee,
  fmt,
  leagueAverage,
  level,
  pct,
  penLambda,
  readFixture,
  styleTags,
  teamYpg,
  whyLine,
  type Reading,
} from "@/lib/reading";

const PICKS_KEY = "thecortesinho-picks";
const LEAGUE_KEY = "thecortesinho-league";

type View = "matches" | "refs";
type MatchFilter = "all" | "red" | "pen";
type RefSort = "reds" | "yellows" | "pens" | "fouls" | "matches";

const leagueOrder: LeagueId[] = ["chile", "colombia", "peru"];

function riskClass(tone: "alta" | "media" | "baja" | "sinde"): string {
  if (tone === "alta") return "text-red";
  if (tone === "media") return "text-yellow";
  return "text-muted";
}

function heatClass(heat: Reading["heat"]): string {
  if (heat === "caliente") return "text-red";
  if (heat === "vivo") return "text-yellow";
  return "text-muted";
}

function heatWord(heat: Reading["heat"]): string {
  if (heat === "caliente") return "Corte caliente";
  if (heat === "vivo") return "Corte vivo";
  return "Corte tranquilo";
}

function statusWord(status: Fixture["status"]): string {
  if (status === "closed") return "Cerrado";
  if (status === "assigned") return "Designado";
  return "Por jugar";
}

function Meter({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "yellow" | "red" | "muted";
}) {
  const width = Math.max(6, Math.min(100, max <= 0 ? 0 : (value / max) * 100));
  const bar = tone === "yellow" ? "bg-yellow" : tone === "red" ? "bg-red" : "bg-muted";
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-bg">
      <div className={`h-full ${bar}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export function CorteApp() {
  const [league, setLeague] = useState<LeagueId>("chile");
  const [view, setView] = useState<View>("matches");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [sort, setSort] = useState<RefSort>("reds");
  const [hideSmall, setHideSmall] = useState(true);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedLeague = localStorage.getItem(LEAGUE_KEY);
      if (storedLeague === "chile" || storedLeague === "colombia" || storedLeague === "peru") {
        setLeague(storedLeague);
      }
      const raw = localStorage.getItem(PICKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object") setPicks(parsed as Record<string, string>);
      }
    } catch {
      /* la pizarra local es opcional */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LEAGUE_KEY, league);
    localStorage.setItem(PICKS_KEY, JSON.stringify(picks));
  }, [league, picks, ready]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const meta = leagues[league];
  const refs = useMemo(() => refereesOf(league), [league]);
  const games = useMemo(() => fixturesOf(league), [league]);
  const avg = useMemo(() => leagueAverage(refs), [refs]);

  const rows = useMemo(() => {
    return games.map((fixture) => {
      const ref = chosenReferee(fixture, picks);
      const reading = readFixture(fixture, ref, avg);
      return { fixture, ref, reading };
    });
  }, [games, picks, avg]);

  const q = query.trim().toLocaleLowerCase("es");

  const visibleMatches = rows.filter(({ fixture, ref }) => {
    if (q) {
      const home = teamById.get(fixture.homeId);
      const away = teamById.get(fixture.awayId);
      const blob = [home?.name, home?.short, away?.name, away?.short, ref?.name, fixture.stadium]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("es");
      if (!blob.includes(q)) return false;
    }
    if (!ref || ref.matches <= 0) return filter === "all";
    const reading = readFixture(fixture, ref, avg);
    if (filter === "red") return level("red", reading?.pRed ?? null) === "alta";
    if (filter === "pen") return level("pen", reading?.pPen ?? null) === "alta";
    return true;
  });

  const visibleRefs = refs
    .filter((ref) => (hideSmall ? ref.matches >= 6 : ref.matches > 0 || ref.unlisted))
    .filter((ref) => !q || ref.name.toLocaleLowerCase("es").includes(q))
    .sort((a, b) => {
      const penA = penLambda(a, avg.fouls);
      const penB = penLambda(b, avg.fouls);
      const key = (ref: Referee, pen: number) => {
        if (sort === "yellows") return ref.yellowsPer;
        if (sort === "reds") return ref.redsPer;
        if (sort === "fouls") return ref.foulsPer;
        if (sort === "pens") return pen;
        return ref.matches;
      };
      return key(b, penB) - key(a, penA) || b.matches - a.matches;
    });

  const hot = rows
    .filter((row) => row.reading && row.reading.pRed != null)
    .sort((a, b) => {
      const score = (reading: Reading) =>
        (reading.pRed ?? 0) * 1.2 + (reading.pPen ?? 0) + reading.yellows / 12;
      return score(b.reading as Reading) - score(a.reading as Reading);
    })
    .slice(0, 3);

  const chilePicks = fixturesOf("chile").filter((fixture) => picks[fixture.id]).length;
  const openRef = openId ? refereeById.get(openId) ?? null : null;

  function setPick(fixtureId: string, refereeId: string) {
    setPicks((prev) => {
      const next = { ...prev };
      if (!refereeId) delete next[fixtureId];
      else next[fixtureId] = refereeId;
      return next;
    });
  }

  function simulateChile() {
    const pool = refereesOf("chile").filter((ref) => ref.matches > 0);
    const next: Record<string, string> = {};
    fixturesOf("chile").forEach((fixture, index) => {
      const ref = pool[index];
      if (ref) next[fixture.id] = ref.id;
    });
    setPicks((prev) => ({ ...prev, ...next }));
    setLeague("chile");
    setView("matches");
  }

  function clearChile() {
    setPicks((prev) => {
      const next = { ...prev };
      for (const fixture of fixturesOf("chile")) delete next[fixture.id];
      return next;
    });
  }

  const reddest = [...refs].filter((ref) => ref.matches >= 6).sort((a, b) => b.redsPer - a.redsPer)[0];
  const cardiest = [...refs].filter((ref) => ref.matches >= 6).sort((a, b) => b.yellowsPer - a.yellowsPer)[0];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
            alt="Árbitro con tarjeta amarilla en una mano y roja en la otra"
            width={1408}
            height={1408}
            className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover sm:h-20 sm:w-20"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Chile · Colombia · Perú</p>
            <h1 className="font-display text-3xl leading-none tracking-wide sm:text-5xl">
              THE<span className="text-yellow">CORTE</span>SINHO
            </h1>
            <p className="mt-1 text-sm text-muted">Posible amarilla, roja y penal según quién pita.</p>
          </div>
        </div>
        <p className="font-display text-sm uppercase tracking-wide text-muted">Corte 18 oct 2026</p>
      </header>

      <nav className="mt-6 grid grid-cols-3 gap-2" aria-label="Ligas">
        {leagueOrder.map((id) => {
          const item = leagues[id];
          const on = id === league;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setLeague(id);
                setQuery("");
                setFilter("all");
              }}
              className={
                "min-h-11 rounded-xl border px-2 py-2 text-left transition-colors duration-200 " +
                (on
                  ? "border-yellow bg-yellow text-yellow-ink"
                  : "border-line bg-surface text-fg hover:bg-surface-2")
              }
            >
              <span className="block font-display text-lg leading-none tracking-wide sm:text-xl">
                {item.country}
              </span>
              <span className={"mt-1 block text-xs " + (on ? "text-yellow-ink" : "text-muted")}>
                {item.round}
              </span>
            </button>
          );
        })}
      </nav>

      <section className="mt-4 rounded-xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-wide">
              {meta.competition} · {meta.round}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">{meta.roundNote}</p>
          </div>
          <div className="flex gap-2" role="tablist" aria-label="Vista">
            {(
              [
                ["matches", "Partidos"],
                ["refs", "Árbitros"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={
                  "min-h-11 rounded-lg px-4 text-sm font-medium " +
                  (view === id ? "bg-yellow text-yellow-ink" : "bg-surface-2 text-fg")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Amarillas / partido</dt>
            <dd className="font-display text-3xl tabular-nums text-yellow">{fmt(avg.yellows)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Rojas / partido</dt>
            <dd className="font-display text-3xl tabular-nums text-red">{fmt(avg.reds)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Más amarillero</dt>
            <dd className="font-display text-xl leading-tight">{cardiest?.name ?? "—"}</dd>
            <dd className="text-xs text-muted">{cardiest ? `${fmt(cardiest.yellowsPer)} en ${cardiest.matches} PJ` : ""}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Más rojero</dt>
            <dd className="font-display text-xl leading-tight">{reddest?.name ?? "—"}</dd>
            <dd className="text-xs text-muted">{reddest ? `${fmt(reddest.redsPer)} en ${reddest.matches} PJ` : ""}</dd>
          </div>
        </dl>
      </section>

      {league === "chile" && view === "matches" ? (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg">
            {chilePicks > 0
              ? "Esta pizarra es tuya. No es la designación de la ANFP."
              : "Sin árbitro oficial. Elegí un juez en cada partido o simulá la fecha con los que más dirigieron."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={simulateChile}
              className="min-h-11 rounded-lg bg-yellow px-4 text-sm font-semibold text-yellow-ink"
            >
              Simular fecha
            </button>
            <button
              type="button"
              onClick={clearChile}
              className="min-h-11 rounded-lg border border-line bg-surface-2 px-4 text-sm text-fg"
            >
              Limpiar
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="buscar">
          Buscar
        </label>
        <input
          id="buscar"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={view === "matches" ? "Buscar equipo o árbitro" : "Buscar árbitro"}
          className="min-h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-sm text-fg outline-none placeholder:text-muted"
        />
        {view === "matches" ? (
          <div className="grid grid-cols-3 gap-2 sm:flex">
            {(
              [
                ["all", "Todos"],
                ["red", "Roja alta"],
                ["pen", "Penal alto"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={
                  "min-h-11 rounded-lg px-3 text-sm " +
                  (filter === id ? "bg-red text-yellow-ink" : "border border-line bg-surface text-fg")
                }
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="orden">
              Orden
            </label>
            <select
              id="orden"
              value={sort}
              onChange={(event) => setSort(event.target.value as RefSort)}
              className="min-h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-sm text-fg"
            >
              <option value="reds">Más rojas</option>
              <option value="yellows">Más amarillas</option>
              <option value="pens">Más penal estimado</option>
              <option value="fouls">Más faltas</option>
              <option value="matches">Más partidos</option>
            </select>
            <button
              type="button"
              onClick={() => setHideSmall((value) => !value)}
              className={
                "min-h-11 rounded-lg px-3 text-sm " +
                (hideSmall ? "bg-yellow text-yellow-ink" : "border border-line bg-surface text-fg")
              }
            >
              {hideSmall ? "6+ PJ" : "Todas"}
            </button>
          </div>
        )}
      </div>

      {view === "matches" ? (
        <>
          {hot.length > 0 && filter === "all" && !q ? (
            <section className="mt-5">
              <h3 className="font-display text-lg tracking-wide text-muted">Los tres cortes de la fecha</h3>
              <ol className="mt-2 grid gap-2 sm:grid-cols-3">
                {hot.map(({ fixture, ref, reading }, index) => {
                  const home = teamById.get(fixture.homeId);
                  const away = teamById.get(fixture.awayId);
                  return (
                    <li key={fixture.id} className="rounded-xl border border-line bg-surface px-3 py-3">
                      <p className="text-xs uppercase tracking-wide text-muted">
                        {index + 1} · {reading ? heatWord(reading.heat) : ""}
                      </p>
                      <p className="mt-1 font-display text-lg leading-tight">
                        {home?.short} – {away?.short}
                      </p>
                      <p className="text-sm text-muted">{ref?.name}</p>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          <section className="mt-5 grid gap-3 lg:grid-cols-2">
            {visibleMatches.length === 0 ? (
              <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
                Nada con ese filtro. Probá otro juez o volvé a todos.
              </p>
            ) : (
              visibleMatches.map(({ fixture, ref, reading }) => (
                <MatchCard
                  key={fixture.id}
                  fixture={fixture}
                  ref={ref}
                  reading={reading}
                  picks={picks}
                  refs={refs}
                  onPick={setPick}
                  onOpen={setOpenId}
                />
              ))
            )}
          </section>
        </>
      ) : (
        <section className="mt-5 grid gap-2">
          {visibleRefs.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
              Ningún árbitro con esa búsqueda.
            </p>
          ) : (
            visibleRefs.map((ref) => (
              <RefereeRow
                key={ref.id}
                referee={ref}
                avgFouls={avg.fouls}
                avg={avg}
                onOpen={() => setOpenId(ref.id)}
              />
            ))
          )}
        </section>
      )}

      <footer className="mt-8 border-t border-line pt-4 text-sm text-muted">
        <p>
          No es una casa de apuestas. La roja es la chance de al menos una expulsión según el promedio del
          juez. El penal no tiene conteo oficial por árbitro en este corte: se estima en 0,30 por partido
          cuando pita las faltas promedio de su liga.
        </p>
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer font-medium text-fg">De dónde sale el corte</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{meta.refNote}</li>
            <li>{meta.teamNote}</li>
            <li>Chile, fecha 25: programación publicada por Prensa Fútbol.</li>
            <li>Colombia, fecha 15: designaciones de la FCF del 16 de octubre.</li>
            <li>Perú, fecha 12: designaciones CONAR recogidas por Infobae.</li>
          </ul>
        </details>
      </footer>

      {openRef ? (
        <RefereeSheet
          referee={openRef}
          avg={leagueAverage(refereesOf(openRef.league))}
          picks={picks}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </main>
  );
}

function MatchCard({
  fixture,
  ref,
  reading,
  picks,
  refs,
  onPick,
  onOpen,
}: {
  fixture: Fixture;
  ref: Referee | null;
  reading: Reading | null;
  picks: Record<string, string>;
  refs: Referee[];
  onPick: (fixtureId: string, refereeId: string) => void;
  onOpen: (id: string) => void;
}) {
  const home = teamById.get(fixture.homeId);
  const away = teamById.get(fixture.awayId);
  const overridden = Boolean(picks[fixture.id] && picks[fixture.id] !== fixture.refereeId);
  const redTone = level("red", reading?.pRed ?? null);
  const penTone = level("pen", reading?.pPen ?? null);

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-muted">
          {fixture.dayLabel}
          {fixture.timeLabel ? ` · ${fixture.timeLabel}` : ""}
        </p>
        <p className={"text-xs font-medium uppercase tracking-wide " + (reading ? heatClass(reading.heat) : "text-muted")}>
          {overridden && fixture.refereeId ? "Tu proyección" : reading ? heatWord(reading.heat) : statusWord(fixture.status)}
        </p>
      </div>
      <h3 className="mt-2 font-display text-2xl leading-none tracking-wide">
        {home?.short}
        <span className="mx-2 text-muted">–</span>
        {away?.short}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {fixture.stadium && !fixture.stadium.startsWith("Por confirmar") ? fixture.stadium : home && away ? `${home.name} vs ${away.name}` : ""}
      </p>

      <div className="mt-4">
        <label className="text-xs uppercase tracking-wide text-muted" htmlFor={`ref-${fixture.id}`}>
          Árbitro
        </label>
        <div className="mt-1 flex gap-2">
          <select
            id={`ref-${fixture.id}`}
            value={picks[fixture.id] ?? fixture.refereeId ?? ""}
            onChange={(event) => onPick(fixture.id, event.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fg"
          >
            <option value="">{fixture.refereeId ? "Quitar proyección" : "Elegí un juez"}</option>
            {refs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.matches > 0 ? ` · ${item.matches} PJ` : " · sin muestra"}
                {item.id === fixture.refereeId ? " · designado" : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!ref}
            onClick={() => ref && onOpen(ref.id)}
            className="min-h-11 shrink-0 rounded-lg border border-line px-3 text-sm text-fg disabled:cursor-not-allowed disabled:text-muted"
          >
            Ficha
          </button>
        </div>
      </div>

      {reading ? (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Posible amarilla</p>
              <p className="font-display text-3xl tabular-nums text-yellow">{fmt(reading.yellows)}</p>
              <Meter value={reading.yellows} max={8} tone="yellow" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Posible roja</p>
              <p className={"font-display text-3xl tabular-nums " + riskClass(redTone)}>
                {reading.pRed == null ? "—" : pct(reading.pRed)}
              </p>
              <Meter value={reading.pRed ?? 0} max={0.7} tone={redTone === "baja" || redTone === "sinde" ? "muted" : "red"} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Posible penal</p>
              <p className={"font-display text-3xl tabular-nums " + riskClass(penTone)}>
                {reading.pPen == null ? "—" : pct(reading.pPen)}
              </p>
              <Meter value={reading.pPen ?? 0} max={0.5} tone={penTone === "alta" ? "red" : penTone === "media" ? "yellow" : "muted"} />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Sobre 4,5 amarillas {pct(reading.pOver45)} · sobre 5,5 {pct(reading.pOver55)}
            {redTone === "alta" ? " · roja alta" : ""}
            {penTone === "alta" ? " · penal alto" : ""}
          </p>
          <p className="mt-2 text-sm text-fg">{whyLine(fixture, ref, reading)}</p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Sin muestra para este juez. Elegí otro perfil y aparece la posible roja y el posible penal.
        </p>
      )}
    </article>
  );
}

function RefereeRow({
  referee,
  avgFouls,
  avg,
  onOpen,
}: {
  referee: Referee;
  avgFouls: number;
  avg: ReturnType<typeof leagueAverage>;
  onOpen: () => void;
}) {
  const pens = referee.matches > 0 ? penLambda(referee, avgFouls) : 0;
  const tags = styleTags(referee, avg);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid min-h-11 grid-cols-2 gap-2 rounded-xl border border-line bg-surface p-3 text-left sm:grid-cols-6 sm:items-center"
    >
      <span className="sm:col-span-2">
        <span className="block font-display text-xl leading-tight tracking-wide">{referee.name}</span>
        <span className="text-xs text-muted">
          {referee.city ? `${referee.city} · ` : ""}
          {referee.matches > 0 ? `${referee.matches} PJ` : "Sin muestra"}
          {tags.length ? ` · ${tags[0]}` : ""}
        </span>
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">Amarillas</span>
        <span className="font-display text-xl tabular-nums text-yellow">
          {referee.matches > 0 ? fmt(referee.yellowsPer) : "—"}
        </span>
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">Rojas</span>
        <span className="font-display text-xl tabular-nums text-red">
          {referee.matches > 0 ? fmt(referee.redsPer) : "—"}
        </span>
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">Penal est.</span>
        <span className="font-display text-xl tabular-nums">
          {referee.matches > 0 ? fmt(pens) : "—"}
        </span>
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">Faltas</span>
        <span className="font-display text-xl tabular-nums text-muted">
          {referee.matches > 0 ? fmt(referee.foulsPer, 0) : "—"}
        </span>
      </span>
    </button>
  );
}

function RefereeSheet({
  referee,
  avg,
  picks,
  onClose,
}: {
  referee: Referee;
  avg: ReturnType<typeof leagueAverage>;
  picks: Record<string, string>;
  onClose: () => void;
}) {
  const tags = styleTags(referee, avg);
  const pens = referee.matches > 0 ? penLambda(referee, avg.fouls) : null;
  const games = fixturesOf(referee.league).filter(
    (fixture) => fixture.refereeId === referee.id || picks[fixture.id] === referee.id,
  );

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-stretch sm:justify-end">
      <button type="button" className="absolute inset-0 bg-bg/80" aria-label="Cerrar ficha" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-xl border border-line bg-surface p-5 sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{leagues[referee.league].competition}</p>
            <h2 id="ficha-titulo" className="font-display text-3xl tracking-wide">
              {referee.name}
            </h2>
            <p className="text-sm text-muted">
              {referee.city ? `${referee.city} · ` : ""}
              {referee.matches > 0 ? `${referee.matches} partidos en 2026` : "Sin fila en el corte"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-line px-3 text-sm"
          >
            Cerrar
          </button>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide">
              {tag}
            </li>
          ))}
        </ul>

        {referee.matches > 0 && pens != null ? (
          <dl className="mt-5 space-y-4">
            <Compare label="Amarillas" value={referee.yellowsPer} base={avg.yellows} tone="yellow" />
            <Compare label="Rojas" value={referee.redsPer} base={avg.reds} tone="red" />
            <Compare label="Faltas" value={referee.foulsPer} base={avg.fouls} tone="muted" />
            <Compare label="Penal estimado" value={pens} base={0.3} tone="yellow" />
          </dl>
        ) : (
          <p className="mt-5 text-sm text-muted">
            Está designado, pero este corte no trae sus promedios. Proyectá el partido con otro juez de la
            liga para ver una lectura.
          </p>
        )}

        <div className="mt-6">
          <h3 className="font-display text-lg tracking-wide">En esta fecha</h3>
          {games.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No está designado ni proyectado en la jornada que estás viendo.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {games.map((fixture) => {
                const home = teamById.get(fixture.homeId);
                const away = teamById.get(fixture.awayId);
                const own = picks[fixture.id] === referee.id && fixture.refereeId !== referee.id;
                return (
                  <li key={fixture.id} className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
                    {home?.short} – {away?.short}
                    <span className="text-muted"> · {own ? "proyección tuya" : "designado"}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-6 text-sm text-muted">
          Posible roja: {referee.matches > 0 ? pct(1 - Math.exp(-referee.redsPer)) : "—"} de ver al menos una
          expulsión. Posible penal: {pens == null ? "—" : pct(1 - Math.exp(-pens))}.
        </p>
      </aside>
    </div>
  );
}

function Compare({
  label,
  value,
  base,
  tone,
}: {
  label: string;
  value: number;
  base: number;
  tone: "yellow" | "red" | "muted";
}) {
  const max = Math.max(value, base, 0.01) * 1.15;
  const toneClass = tone === "yellow" ? "text-yellow" : tone === "red" ? "text-red" : "text-fg";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
        <dd className={"font-display text-2xl tabular-nums " + toneClass}>
          {fmt(value)}
          <span className="ml-2 text-sm text-muted">liga {fmt(base)}</span>
        </dd>
      </div>
      <div className="mt-1">
        <Meter value={value} max={max} tone={tone} />
      </div>
    </div>
  );
}
