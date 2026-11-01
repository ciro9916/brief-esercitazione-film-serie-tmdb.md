export type Show = {
    id: number;
    url: string;
    name: string;
    type: string;
    language: string | null;
    genres: string[];
    status: string;
    runtime: number | null;
    averageRuntime: number | null;
    premiered: string | null;
    ended: string | null;
    officialSite: string | null;
    schedule: {
        time: string;
        days: string[];
    };
    rating: {
        average: number | null;
    };
    weight: number;
    network: {
        id: number;
        name: string;
        country: {
            name: string;
            code: string;
            timezone: string;
        } | null;
        officialSite: string | null;
    } | null;
    webChannel: {
        id: number;
        name: string;
        country: {
            name: string;
            code: string;
            timezone: string;
        } | null;
        officialSite: string | null;
    } | null;
    dvdCountry: {
        name: string;
        code: string;
        timezone: string;
    } | null;
    externals: {
        tvrage: number | null;
        thetvdb: number | null;
        imdb: string | null;
    };
    image: {
        medium: string;
        original: string;
    } | null;
    summary: string | null;
    updated: number;
    _links: {
        self: { href: string };
        previousepisode?: { href: string; name?: string };
        nextepisode?: { href: string; name?: string };
    };
};

export type Report<T> = {
    report: string                      
    generato_il: string                 
    data_riferimento: string | null      
    all_time: {
        intervallo: null                 
        classifica: T[]
    }
    ultimo_mese: {
        intervallo: { inizio: string; fine: string } | null
        classifica: T[]
    }
}
// ritorno dell'episodio dall'API
export type Episodio = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate: string; 
  runtime: number | null;
  rating: { average: number | null };
};

export type EpisodioMigliore = {
  id: number;
  name: string;
  stagione: number;
  numero: number | null;
  rating_medio: number;
};
// richiesta dalla traccia
export type SchedaEpisodi = {
  id_serie: number;
  nome_serie: string;
  stagioni_distinte: number;
  episodi_totali: number;
  runtime_totale_minuti: number;
  episodi_senza_runtime: number; 
  primo_airdate: string | null;
  ultimo_airdate: string | null;
  episodio_migliore: EpisodioMigliore | null; 
};

export type ReportEpisodi = {
  report: string;
  generato_il: string;
  serie_di_partenza: tipoRitornoClassifica[];
  schede: SchedaEpisodi[];
};

export type tipoRitornoClassifica ={
  poszione?:number,  
  id: number;
  url: string;
  name: string;
  genres: string[];
  status: "Running" | "Ended" | "To Be Determined" | "In Development" | string;
  premier_date: string|null,
  medium_rating:number,
  runtime: number | null;
  nome_network:string|undefined
}