export type LeagueId = "chile" | "colombia" | "peru";

export type Referee = {
  id: string;
  name: string;
  league: LeagueId;
  city?: string;
  matches: number;
  yellowsPer: number;
  redsPer: number;
  foulsPer: number;
  fifa?: boolean;
  /** Designado en la fecha, pero sin fila en el corte estadístico. */
  unlisted?: boolean;
};

export type Team = {
  id: string;
  name: string;
  short: string;
  league: LeagueId;
  /** Amarillas recibidas en la muestra. Null si el ranking no lo publica. */
  yellows: number | null;
  sample: number;
};

export type FixtureStatus = "upcoming" | "assigned" | "closed";

export type Fixture = {
  id: string;
  league: LeagueId;
  dayLabel: string;
  timeLabel: string | null;
  stadium: string;
  homeId: string;
  awayId: string;
  refereeId: string | null;
  status: FixtureStatus;
};

export type LeagueMeta = {
  id: LeagueId;
  country: string;
  competition: string;
  round: string;
  roundNote: string;
  teamNote: string;
  refNote: string;
};

export const leagues: Record<LeagueId, LeagueMeta> = {
  chile: {
    id: "chile",
    country: "Chile",
    competition: "Liga de Primera",
    round: "Fecha 25",
    roundNote: "Viernes 23 al lunes 26 de octubre. La ANFP todavía no publica árbitros.",
    teamNote: "Amarillas de equipos: AS, corte 18 oct, tras 24 fechas.",
    refNote: "Árbitros: temporada 2026, ValueStats al 18 oct. Muestras de 1–2 partidos quedan fuera.",
  },
  colombia: {
    id: "colombia",
    country: "Colombia",
    competition: "Liga BetPlay",
    round: "Fecha 15",
    roundNote: "Designación FCF del 16 oct. Horarios no unificados en este corte.",
    teamNote: "No hay ranking de amarillas por equipo en el corte. La lectura la manda el árbitro.",
    refNote: "Árbitros: temporada 2026, ValueStats al 18 oct. Bucaramanga–América ya se jugó el 18.",
  },
  peru: {
    id: "peru",
    country: "Perú",
    competition: "Liga 1 Clausura",
    round: "Fecha 12",
    roundNote: "CONAR, 16 al 18 de octubre. La fecha ya se cerró: esto es la lectura previa.",
    teamNote: "Amarillas de equipos: ranking AS del Clausura, corte 18 oct (aprox. 11 fechas).",
    refNote: "Árbitros: temporada 2026 completa, ValueStats al 18 oct.",
  },
};

export const teams: Team[] = [
  { id: "cl-audax", name: "Audax Italiano", short: "Audax", league: "chile", yellows: 54, sample: 24 },
  { id: "cl-huachi", name: "Huachipato", short: "Huachipato", league: "chile", yellows: 53, sample: 24 },
  { id: "cl-serena", name: "Deportes La Serena", short: "La Serena", league: "chile", yellows: 63, sample: 24 },
  { id: "cl-dcon", name: "Deportes Concepción", short: "D. Concepción", league: "chile", yellows: 50, sample: 24 },
  { id: "cl-ohi", name: "O'Higgins", short: "O'Higgins", league: "chile", yellows: 59, sample: 24 },
  { id: "cl-cobre", name: "Cobresal", short: "Cobresal", league: "chile", yellows: 50, sample: 24 },
  { id: "cl-nubl", name: "Ñublense", short: "Ñublense", league: "chile", yellows: 62, sample: 24 },
  { id: "cl-coq", name: "Coquimbo Unido", short: "Coquimbo", league: "chile", yellows: 57, sample: 24 },
  { id: "cl-calera", name: "Unión La Calera", short: "La Calera", league: "chile", yellows: 57, sample: 24 },
  { id: "cl-uc", name: "Universidad Católica", short: "U. Católica", league: "chile", yellows: 63, sample: 24 },
  { id: "cl-pale", name: "Palestino", short: "Palestino", league: "chile", yellows: 62, sample: 24 },
  { id: "cl-colo", name: "Colo-Colo", short: "Colo-Colo", league: "chile", yellows: 39, sample: 24 },
  { id: "cl-udec", name: "Universidad de Concepción", short: "U. de Conce", league: "chile", yellows: 81, sample: 24 },
  { id: "cl-lima", name: "Deportes Limache", short: "Limache", league: "chile", yellows: 42, sample: 24 },
  { id: "cl-uch", name: "Universidad de Chile", short: "U. de Chile", league: "chile", yellows: 51, sample: 24 },
  { id: "cl-ever", name: "Everton", short: "Everton", league: "chile", yellows: 52, sample: 24 },

  { id: "co-millos", name: "Millonarios", short: "Millonarios", league: "colombia", yellows: null, sample: 0 },
  { id: "co-jaguares", name: "Jaguares", short: "Jaguares", league: "colombia", yellows: null, sample: 0 },
  { id: "co-dim", name: "Independiente Medellín", short: "DIM", league: "colombia", yellows: null, sample: 0 },
  { id: "co-once", name: "Once Caldas", short: "Once Caldas", league: "colombia", yellows: null, sample: 0 },
  { id: "co-aguilas", name: "Águilas Doradas", short: "Águilas", league: "colombia", yellows: null, sample: 0 },
  { id: "co-tolima", name: "Deportes Tolima", short: "Tolima", league: "colombia", yellows: null, sample: 0 },
  { id: "co-bucara", name: "Atlético Bucaramanga", short: "Bucaramanga", league: "colombia", yellows: null, sample: 0 },
  { id: "co-ame", name: "América de Cali", short: "América", league: "colombia", yellows: null, sample: 0 },
  { id: "co-llaneros", name: "Llaneros", short: "Llaneros", league: "colombia", yellows: null, sample: 0 },
  { id: "co-santafe", name: "Independiente Santa Fe", short: "Santa Fe", league: "colombia", yellows: null, sample: 0 },
  { id: "co-cali", name: "Deportivo Cali", short: "Cali", league: "colombia", yellows: null, sample: 0 },
  { id: "co-junior", name: "Junior", short: "Junior", league: "colombia", yellows: null, sample: 0 },
  { id: "co-pasto", name: "Deportivo Pasto", short: "Pasto", league: "colombia", yellows: null, sample: 0 },
  { id: "co-alianza", name: "Alianza Valledupar", short: "Alianza", league: "colombia", yellows: null, sample: 0 },
  { id: "co-pereira", name: "Deportivo Pereira", short: "Pereira", league: "colombia", yellows: null, sample: 0 },
  { id: "co-chico", name: "Boyacá Chicó", short: "Chicó", league: "colombia", yellows: null, sample: 0 },
  { id: "co-cucuta", name: "Cúcuta Deportivo", short: "Cúcuta", league: "colombia", yellows: null, sample: 0 },
  { id: "co-nacional", name: "Atlético Nacional", short: "Nacional", league: "colombia", yellows: null, sample: 0 },
  { id: "co-ibague", name: "Internacional de Bogotá", short: "Inter de Bogotá", league: "colombia", yellows: null, sample: 0 },
  { id: "co-fortaleza", name: "Fortaleza", short: "Fortaleza", league: "colombia", yellows: null, sample: 0 },

  { id: "pe-huanca", name: "Sport Huancayo", short: "Huancayo", league: "peru", yellows: 37, sample: 11 },
  { id: "pe-cusco", name: "Cusco FC", short: "Cusco", league: "peru", yellows: 18, sample: 11 },
  { id: "pe-chankas", name: "Los Chankas", short: "Los Chankas", league: "peru", yellows: null, sample: 11 },
  { id: "pe-adt", name: "AD Tarma", short: "ADT", league: "peru", yellows: 29, sample: 11 },
  { id: "pe-jpii", name: "Juan Pablo II", short: "Juan Pablo II", league: "peru", yellows: 22, sample: 11 },
  { id: "pe-boys", name: "Sport Boys", short: "Sport Boys", league: "peru", yellows: 38, sample: 11 },
  { id: "pe-melgar", name: "FBC Melgar", short: "Melgar", league: "peru", yellows: 21, sample: 11 },
  { id: "pe-garci", name: "Deportivo Garcilaso", short: "Garcilaso", league: "peru", yellows: 23, sample: 11 },
  { id: "pe-al", name: "Alianza Lima", short: "Alianza Lima", league: "peru", yellows: 24, sample: 11 },
  { id: "pe-grau", name: "Atlético Grau", short: "Grau", league: "peru", yellows: 23, sample: 11 },
  { id: "pe-cristal", name: "Sporting Cristal", short: "Cristal", league: "peru", yellows: 26, sample: 11 },
  { id: "pe-com", name: "Comerciantes Unidos", short: "Comerciantes", league: "peru", yellows: 17, sample: 11 },
  { id: "pe-caja", name: "FC Cajamarca", short: "Cajamarca", league: "peru", yellows: 31, sample: 11 },
  { id: "pe-moq", name: "Deportivo Moquegua", short: "Moquegua", league: "peru", yellows: 29, sample: 11 },
  { id: "pe-aat", name: "Alianza Atlético", short: "Alianza Atl.", league: "peru", yellows: 27, sample: 11 },
  { id: "pe-uni", name: "Universitario", short: "Universitario", league: "peru", yellows: 21, sample: 11 },
  { id: "pe-cien", name: "Cienciano", short: "Cienciano", league: "peru", yellows: 17, sample: 11 },
  { id: "pe-utc", name: "UTC", short: "UTC", league: "peru", yellows: 27, sample: 11 },
];

export const referees: Referee[] = [
  { id: "cl-garay", name: "Cristián Garay", league: "chile", matches: 17, yellowsPer: 4.53, redsPer: 0.24, foulsPer: 21.12 },
  { id: "cl-vejar", name: "Fernando Véjar", league: "chile", matches: 15, yellowsPer: 5.67, redsPer: 0.53, foulsPer: 24.8 },
  { id: "cl-cabero", name: "José Cabero", league: "chile", matches: 15, yellowsPer: 3.73, redsPer: 0.2, foulsPer: 20.6 },
  { id: "cl-flores", name: "Diego Flores", league: "chile", matches: 14, yellowsPer: 5.21, redsPer: 0.71, foulsPer: 18 },
  { id: "cl-lara", name: "Juan Lara", league: "chile", matches: 14, yellowsPer: 5.14, redsPer: 0.36, foulsPer: 20.79 },
  { id: "cl-jona", name: "Héctor Jona", league: "chile", matches: 13, yellowsPer: 4.92, redsPer: 0.54, foulsPer: 20.38 },
  { id: "cl-riquelme", name: "M. Riquelme", league: "chile", matches: 12, yellowsPer: 3.83, redsPer: 0.25, foulsPer: 19.75 },
  { id: "cl-maza", name: "Piero Maza", league: "chile", matches: 12, yellowsPer: 5.42, redsPer: 0.75, foulsPer: 22.5 },
  { id: "cl-jimenez", name: "Franco Jiménez", league: "chile", matches: 9, yellowsPer: 4.89, redsPer: 0.33, foulsPer: 20.11 },
  { id: "cl-salvo", name: "Mario Salvo", league: "chile", matches: 8, yellowsPer: 6, redsPer: 0.38, foulsPer: 20.75 },
  { id: "cl-gaston", name: "Gastón P.", league: "chile", matches: 8, yellowsPer: 4.75, redsPer: 0.5, foulsPer: 18.25 },
  { id: "cl-galaz", name: "Cristián Galaz", league: "chile", matches: 7, yellowsPer: 5, redsPer: 0.29, foulsPer: 16.29 },
  { id: "cl-assadi", name: "Matías Assadi", league: "chile", matches: 6, yellowsPer: 6, redsPer: 0.5, foulsPer: 24.33 },
  { id: "cl-diaz", name: "Claudio Díaz", league: "chile", matches: 5, yellowsPer: 4.8, redsPer: 0.2, foulsPer: 22 },
  { id: "cl-araos", name: "M. Araos", league: "chile", matches: 5, yellowsPer: 4.8, redsPer: 0, foulsPer: 17.2 },
  { id: "cl-gilabert", name: "Francisco Gilabert", league: "chile", matches: 4, yellowsPer: 4, redsPer: 0.5, foulsPer: 21.25 },
  { id: "cl-gamboa", name: "Nicolás Gamboa", league: "chile", matches: 4, yellowsPer: 5.5, redsPer: 0.25, foulsPer: 18.75 },
  { id: "cl-millas", name: "Nicolás Millas", league: "chile", matches: 4, yellowsPer: 6.25, redsPer: 0.5, foulsPer: 18.5 },
  { id: "cl-philippe", name: "Gastón Philippe", league: "chile", matches: 3, yellowsPer: 4.33, redsPer: 0.33, foulsPer: 16.33 },
  { id: "cl-feldman", name: "Israel Feldman", league: "chile", matches: 3, yellowsPer: 5, redsPer: 0.33, foulsPer: 19.33 },
  { id: "cl-vergara", name: "Manuel Vergara", league: "chile", matches: 3, yellowsPer: 5.67, redsPer: 0.67, foulsPer: 20 },
  { id: "cl-carvajal", name: "Rodrigo Carvajal", league: "chile", matches: 3, yellowsPer: 5.67, redsPer: 0.67, foulsPer: 24.67 },

  { id: "co-roldan", name: "Wilmar Roldán", league: "colombia", city: "Antioquia", matches: 28, yellowsPer: 4.36, redsPer: 0.5, foulsPer: 15.89 },
  { id: "co-ortega", name: "Carlos Ortega", league: "colombia", city: "Bolívar", matches: 23, yellowsPer: 5.09, redsPer: 0.35, foulsPer: 21.26 },
  { id: "co-rojas", name: "Andrés Rojas", league: "colombia", city: "Bogotá", matches: 22, yellowsPer: 5.36, redsPer: 0.82, foulsPer: 20.64 },
  { id: "co-betancur", name: "C. Betancur", league: "colombia", matches: 20, yellowsPer: 4.2, redsPer: 0.35, foulsPer: 20.4 },
  { id: "co-moncada", name: "A. Moncada", league: "colombia", matches: 18, yellowsPer: 5.94, redsPer: 0.5, foulsPer: 22.83 },
  { id: "co-mayorga", name: "J. Mayorga", league: "colombia", matches: 18, yellowsPer: 6.94, redsPer: 0.39, foulsPer: 25.56 },
  { id: "co-ospina", name: "Jhon Ospina", league: "colombia", city: "Quindío", matches: 18, yellowsPer: 5.89, redsPer: 0.5, foulsPer: 21.17 },
  { id: "co-ortizt", name: "J. Ortiz Tonguino", league: "colombia", matches: 17, yellowsPer: 5.29, redsPer: 0.29, foulsPer: 24.12 },
  { id: "co-marquez", name: "Carlos Márquez", league: "colombia", city: "Bolívar", matches: 16, yellowsPer: 6.5, redsPer: 0.44, foulsPer: 24 },
  { id: "co-ulloa", name: "Diego Ulloa", league: "colombia", city: "Valle", matches: 14, yellowsPer: 4.79, redsPer: 0.14, foulsPer: 22.64 },
  { id: "co-trujillo", name: "E. Trujillo", league: "colombia", matches: 14, yellowsPer: 5.79, redsPer: 0.5, foulsPer: 25.07 },
  { id: "co-ortizn", name: "J. Ortiz Novoa", league: "colombia", matches: 14, yellowsPer: 6.5, redsPer: 0.43, foulsPer: 21.93 },
  { id: "co-villa", name: "J. Villa", league: "colombia", matches: 14, yellowsPer: 4.5, redsPer: 0.14, foulsPer: 22.14 },
  { id: "co-delgado", name: "L. Delgado", league: "colombia", matches: 11, yellowsPer: 4.18, redsPer: 0.45, foulsPer: 21.36 },
  { id: "co-santiago", name: "Bismark Santiago", league: "colombia", city: "Atlántico", matches: 10, yellowsPer: 4.6, redsPer: 0.4, foulsPer: 25 },
  { id: "co-rivera", name: "H. Rivera", league: "colombia", matches: 9, yellowsPer: 6.78, redsPer: 0.78, foulsPer: 20.56 },
  { id: "co-bautista", name: "José Bautista", league: "colombia", matches: 9, yellowsPer: 4.44, redsPer: 0.44, foulsPer: 24.33 },
  { id: "co-melendez", name: "Álvaro Meléndez", league: "colombia", city: "Magdalena", matches: 9, yellowsPer: 7.56, redsPer: 0.78, foulsPer: 27.56 },
  { id: "co-matorel", name: "Luis Matorel", league: "colombia", city: "Bolívar", matches: 8, yellowsPer: 6.88, redsPer: 0.75, foulsPer: 22 },
  { id: "co-toro", name: "S. Toro", league: "colombia", matches: 8, yellowsPer: 5.75, redsPer: 0.38, foulsPer: 21.5 },
  { id: "co-montano", name: "Wilmar Montaño", league: "colombia", matches: 8, yellowsPer: 7.5, redsPer: 0.63, foulsPer: 27.13 },
  { id: "co-camargo", name: "Steven Camargo", league: "colombia", city: "Bogotá", matches: 3, yellowsPer: 6.67, redsPer: 0.67, foulsPer: 23.67 },
  { id: "co-ferney", name: "Ferney Trujillo", league: "colombia", city: "Casanare", matches: 0, yellowsPer: 0, redsPer: 0, foulsPer: 0, unlisted: true },

  { id: "pe-ordonez", name: "Edwin Ordóñez", league: "peru", matches: 21, yellowsPer: 3.38, redsPer: 0.29, foulsPer: 23.62, fifa: true },
  { id: "pe-lozano", name: "Sebastián Lozano", league: "peru", matches: 20, yellowsPer: 4.4, redsPer: 0.3, foulsPer: 23.85 },
  { id: "pe-alarcon", name: "Joel Alarcón", league: "peru", matches: 20, yellowsPer: 3.05, redsPer: 0.35, foulsPer: 18.7, fifa: true },
  { id: "pe-jordi", name: "Jordi Espinoza", league: "peru", matches: 19, yellowsPer: 5.42, redsPer: 0.21, foulsPer: 25, fifa: true },
  { id: "pe-kortega", name: "Kevin Ortega", league: "peru", matches: 18, yellowsPer: 4.44, redsPer: 0.39, foulsPer: 20.06, fifa: true },
  { id: "pe-michael", name: "Michael Espinoza", league: "peru", matches: 18, yellowsPer: 3.67, redsPer: 0.61, foulsPer: 22.33, fifa: true },
  { id: "pe-palomino", name: "Micke Palomino", league: "peru", matches: 18, yellowsPer: 4.17, redsPer: 0.39, foulsPer: 22.67 },
  { id: "pe-menendez", name: "Augusto Menéndez", league: "peru", matches: 15, yellowsPer: 4.67, redsPer: 0.67, foulsPer: 24.2, fifa: true },
  { id: "pe-ureta", name: "Daniel Ureta", league: "peru", matches: 14, yellowsPer: 5, redsPer: 0.93, foulsPer: 22.57 },
  { id: "pe-carta", name: "Jesús Cartagena", league: "peru", matches: 12, yellowsPer: 7.08, redsPer: 0.83, foulsPer: 23.92 },
  { id: "pe-quiroz", name: "Julio Quiroz", league: "peru", matches: 10, yellowsPer: 5.2, redsPer: 0.5, foulsPer: 27.6 },
  { id: "pe-perez", name: "Bruno Pérez", league: "peru", matches: 9, yellowsPer: 3.78, redsPer: 0.56, foulsPer: 22.67, fifa: true },
  { id: "pe-lopez", name: "Pablo López", league: "peru", matches: 8, yellowsPer: 4.13, redsPer: 1, foulsPer: 24.63 },
  { id: "pe-guadalupe", name: "W. Guadalupe", league: "peru", matches: 8, yellowsPer: 4.13, redsPer: 0.25, foulsPer: 25.25 },
  { id: "pe-pgutierrez", name: "R. Pérez Gutiérrez", league: "peru", matches: 7, yellowsPer: 3.29, redsPer: 0.29, foulsPer: 22.86 },
  { id: "pe-rivera", name: "Junior Rivera", league: "peru", matches: 6, yellowsPer: 4.17, redsPer: 0.33, foulsPer: 24.17 },
  { id: "pe-haro", name: "Diego Haro", league: "peru", matches: 1, yellowsPer: 7, redsPer: 0, foulsPer: 20 },
];

export const fixtures: Fixture[] = [
  { id: "cl-1", league: "chile", dayLabel: "Vie 23 oct", timeLabel: "20:00", stadium: "Bicentenario de La Florida", homeId: "cl-audax", awayId: "cl-huachi", refereeId: null, status: "upcoming" },
  { id: "cl-2", league: "chile", dayLabel: "Sáb 24 oct", timeLabel: "12:30", stadium: "La Portada", homeId: "cl-serena", awayId: "cl-dcon", refereeId: null, status: "upcoming" },
  { id: "cl-3", league: "chile", dayLabel: "Sáb 24 oct", timeLabel: "20:00", stadium: "El Teniente", homeId: "cl-ohi", awayId: "cl-cobre", refereeId: null, status: "upcoming" },
  { id: "cl-4", league: "chile", dayLabel: "Dom 25 oct", timeLabel: "12:30", stadium: "Nelson Oyarzún", homeId: "cl-nubl", awayId: "cl-coq", refereeId: null, status: "upcoming" },
  { id: "cl-5", league: "chile", dayLabel: "Dom 25 oct", timeLabel: "15:00", stadium: "Nicolás Chahuán", homeId: "cl-calera", awayId: "cl-uc", refereeId: null, status: "upcoming" },
  { id: "cl-6", league: "chile", dayLabel: "Dom 25 oct", timeLabel: "17:30", stadium: "Estadio por confirmar", homeId: "cl-pale", awayId: "cl-colo", refereeId: null, status: "upcoming" },
  { id: "cl-7", league: "chile", dayLabel: "Dom 25 oct", timeLabel: "20:00", stadium: "Ester Roa", homeId: "cl-udec", awayId: "cl-lima", refereeId: null, status: "upcoming" },
  { id: "cl-8", league: "chile", dayLabel: "Lun 26 oct", timeLabel: "20:00", stadium: "Estadio Nacional", homeId: "cl-uch", awayId: "cl-ever", refereeId: null, status: "upcoming" },

  { id: "co-1", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-millos", awayId: "co-jaguares", refereeId: "co-matorel", status: "assigned" },
  { id: "co-2", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-dim", awayId: "co-once", refereeId: "co-camargo", status: "assigned" },
  { id: "co-3", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-aguilas", awayId: "co-tolima", refereeId: "co-ulloa", status: "assigned" },
  { id: "co-4", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-bucara", awayId: "co-ame", refereeId: "co-santiago", status: "closed" },
  { id: "co-5", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-llaneros", awayId: "co-santafe", refereeId: "co-ospina", status: "assigned" },
  { id: "co-6", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-cali", awayId: "co-junior", refereeId: "co-roldan", status: "assigned" },
  { id: "co-7", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-pasto", awayId: "co-alianza", refereeId: "co-melendez", status: "assigned" },
  { id: "co-8", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-pereira", awayId: "co-chico", refereeId: "co-ferney", status: "assigned" },
  { id: "co-9", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-cucuta", awayId: "co-nacional", refereeId: "co-rojas", status: "assigned" },
  { id: "co-10", league: "colombia", dayLabel: "Fecha 15", timeLabel: null, stadium: "Por confirmar en la designación", homeId: "co-ibague", awayId: "co-fortaleza", refereeId: "co-marquez", status: "assigned" },

  { id: "pe-1", league: "peru", dayLabel: "Vie 16 oct", timeLabel: "13:00", stadium: "IPD de Huancayo", homeId: "pe-huanca", awayId: "pe-cusco", refereeId: "pe-ordonez", status: "closed" },
  { id: "pe-2", league: "peru", dayLabel: "Vie 16 oct", timeLabel: "15:30", stadium: "Andahuaylas", homeId: "pe-chankas", awayId: "pe-adt", refereeId: "pe-haro", status: "closed" },
  { id: "pe-3", league: "peru", dayLabel: "Sáb 17 oct", timeLabel: "15:00", stadium: "Juan Pablo II, Chongoyape", homeId: "pe-jpii", awayId: "pe-boys", refereeId: "pe-jordi", status: "closed" },
  { id: "pe-4", league: "peru", dayLabel: "Sáb 17 oct", timeLabel: "18:00", stadium: "Monumental de la UNSA", homeId: "pe-melgar", awayId: "pe-garci", refereeId: "pe-kortega", status: "closed" },
  { id: "pe-5", league: "peru", dayLabel: "Sáb 17 oct", timeLabel: "20:30", stadium: "Alejandro Villanueva", homeId: "pe-al", awayId: "pe-grau", refereeId: "pe-michael", status: "closed" },
  { id: "pe-6", league: "peru", dayLabel: "Dom 18 oct", timeLabel: "11:00", stadium: "Alberto Gallardo", homeId: "pe-cristal", awayId: "pe-com", refereeId: "pe-perez", status: "closed" },
  { id: "pe-7", league: "peru", dayLabel: "Dom 18 oct", timeLabel: "13:15", stadium: "Héroes de San Ramón", homeId: "pe-caja", awayId: "pe-moq", refereeId: "pe-alarcon", status: "closed" },
  { id: "pe-8", league: "peru", dayLabel: "Dom 18 oct", timeLabel: "15:30", stadium: "Mansiche, Trujillo", homeId: "pe-aat", awayId: "pe-uni", refereeId: "pe-lozano", status: "closed" },
  { id: "pe-9", league: "peru", dayLabel: "Dom 18 oct", timeLabel: "18:30", stadium: "Garcilaso de la Vega", homeId: "pe-cien", awayId: "pe-utc", refereeId: "pe-menendez", status: "closed" },
];

export const teamById = new Map(teams.map((team) => [team.id, team]));
export const refereeById = new Map(referees.map((ref) => [ref.id, ref]));

export function teamsOf(league: LeagueId): Team[] {
  return teams.filter((team) => team.league === league);
}

export function refereesOf(league: LeagueId): Referee[] {
  return referees
    .filter((ref) => ref.league === league)
    .sort((a, b) => b.matches - a.matches || a.name.localeCompare(b.name, "es"));
}

export function fixturesOf(league: LeagueId): Fixture[] {
  return fixtures.filter((fixture) => fixture.league === league);
}
