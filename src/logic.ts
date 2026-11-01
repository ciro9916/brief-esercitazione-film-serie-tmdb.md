import type { Show,Report,ReportEpisodi,SchedaEpisodi,EpisodioMigliore,Episodio,tipoRitornoClassifica} from "./type.js";
import {stampaEpisodi} from "./api.js"
/*

la posizione in classifica;
l’identificativo della serie;
il nome;
i generi;
lo status (es. Ended, Running, …);
la data di premiere;
il rating medio;
il runtime (usa runtime, oppure averageRuntime se runtime è assente);
il nome del network oppure del webChannel (se entrambi assenti, gestiscilo in modo esplicito e documentato).

*/ 


/* 
l’identificativo e il nome della serie;
il numero di stagioni distinte;
il numero totale di episodi;
il runtime totale in minuti (somma dei runtime degli episodi; se un episodio non ha runtime, decidi tu una strategia sensata e documentala);
la data del primo e dell’ultimo episodio (airdate);
l’episodio con rating più alto: identificativo, nome, stagione, numero episodio, rating medio (se nessun episodio ha rating, gestiscilo in modo esplicito).
*/


export type Intervallo = { 
    data_riferimento: Date; 
    inizio: Date; 
    fine: Date 
}

export const calcolaIntervallo = (shows: Show[]): Intervallo | false => {
    let data_riferimento: Date | null = null;

    for (const show of shows) {
        if (show.premiered === null) continue;

        const data = new Date(show.premiered);
        if (Number.isNaN(data.getTime())) continue; 

        if (data_riferimento === null || data > data_riferimento) {
            data_riferimento = data;
        }
    }

    if (data_riferimento === null) 
        return false;

    const inizio = new Date(data_riferimento);
    inizio.setUTCFullYear(inizio.getUTCFullYear() - 1);

  return { data_riferimento, inizio, fine: data_riferimento };
}


export const ordina3FilmMax = (shows:Show[],periodo:boolean):tipoRitornoClassifica[] =>
{
    const intervallo=periodo?calcolaIntervallo(shows):false

    let lista:tipoRitornoClassifica[] = []
    for(let show of shows){
        if(show.premiered != null){
            const data = new Date(show.premiered)
            if (!intervallo || (data >= intervallo.inizio && data <= intervallo.fine)) {
                if(show.rating.average != null){

                const schedaFilm:tipoRitornoClassifica = {
                id:show.id,
                url:show.url,
                name:show.name,
                genres:show.genres,
                status:show.status,
                premier_date:show.premiered,
                medium_rating:show.rating.average,
                runtime:show.averageRuntime,
                nome_network:show.network?.name
            }

            lista.push(schedaFilm)
            lista=ordinaVettore_classificaRating(lista)
            if(lista.length>3){
                lista.pop()
            }
          }
        }   
    }      
  }
 return  lista.map((c, i) => ({ rank: i + 1, ...c }))
}

const datiTop3Serie = async (shows: tipoRitornoClassifica[]): Promise<SchedaEpisodi[]> => {
    const schede: SchedaEpisodi[] = []

    for (let show of shows) {
        const episodi: Episodio[] = await stampaEpisodi(show.id)
        let stagioni=episodi[episodi.length-1]?.season
            if(stagioni === undefined){
                stagioni=-1
            }
        const runtimeTotale = episodi.reduce((somma, episodio) => somma + (episodio.runtime ?? 0),0)

        const senzaRuntime = episodi.reduce((conta, episodio) => (episodio.runtime == null ? conta + 1 : conta), 0)

        const date = episodi[0]?.airdate

        const migliore = episodi.sort((a, b) => (b.rating.average as number) - (a.rating.average as number) || a.id - b.id)[0]

        const episodioMigliore: EpisodioMigliore | null = migliore
            ? {
                id: migliore.id,
                name: migliore.name,
                stagione: migliore.season,
                numero: migliore.number,
                rating_medio: migliore.rating.average as number,
            }
            : null

        const schedaEpisodio: SchedaEpisodi = {
            id_serie: show.id,
            nome_serie: show.name,
            stagioni_distinte: stagioni,
            episodi_totali: episodi.length,
            runtime_totale_minuti: runtimeTotale,
            episodi_senza_runtime: senzaRuntime,
            primo_airdate: date ?? null,
            ultimo_airdate: date ?? null,
            episodio_migliore: episodioMigliore,
        }

        schede.push(schedaEpisodio)
    }

    return schede
}

export const reportTreFilm = (shows:Show[]):Report<tipoRitornoClassifica> =>
{
    const intervallo = calcolaIntervallo(shows)
     return {
        report: "top_3_show",
        generato_il: new Date()+"",
        data_riferimento: intervallo ? intervallo.data_riferimento+"" : null,
        all_time: {
            intervallo: null,
            classifica: ordina3FilmMax(shows,false)
        },
        ultimo_mese: {
            intervallo: intervallo
                ? { inizio: intervallo.inizio+"", fine: intervallo.fine+"" }
                : null,
            classifica: ordina3FilmMax(shows, true)
        }
    }
}
const ordinaVettore_classificaRating = (vettore: tipoRitornoClassifica[]): tipoRitornoClassifica[] => {
    return vettore.sort((a, b) =>
        b.medium_rating - a.medium_rating  ||
        a.id - b.id 
    )
}

export const reportEpisodi = async (shows:tipoRitornoClassifica[]):Promise<ReportEpisodi> => {

        let x:ReportEpisodi = {
            generato_il:new Date()+"",
            report: "Report top 3 serie",
            serie_di_partenza: shows,
            schede: await datiTop3Serie(shows)
        }

    return x
}