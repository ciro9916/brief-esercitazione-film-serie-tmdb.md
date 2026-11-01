# Report serie TV (TVmaze)

Applicazione in TypeScript che scarica i dati pubblici di TVmaze e stampa in console due report in formato JSON:

1. **Top 3 serie per rating**, su due periodi: all time e anno di riferimento.
2. **Scheda episodi** delle tre serie della classifica all time.

## Requisiti

- Node.js 20 o superiore
- pnpm

## Installazione

```bash
pnpm install
```

## Avvio

```bash
pnpm start
```

Il programma scarica i dati dall'API, poi stampa in console i due report JSON, uno dopo l'altro. Per salvarli su file si può redirigere l'output:

```bash
pnpm start > report.txt
```

## Scope dei dati

Viene usata solo la prima pagina dell'elenco, `GET /shows` (equivalente a `page=0`, circa 240 serie). Per il Report 2 viene chiamato `GET /shows/{id}/episodes` per ciascuna delle tre serie in classifica.

## Anno di riferimento

L'anno di riferimento è l'anno solare della `premiered` più recente presente nel dataset scaricato (non la data di sistema). Il periodo recente va dal 1 gennaio al 31 dicembre di quell'anno.

## Regole di ranking

- Il criterio è `rating.average`. Le serie senza rating non entrano in classifica.
- A parità di rating si ordina per `id` crescente.
- Se in un periodo ci sono meno di 3 serie, vengono restituite solo quelle disponibili.
- All time = tutte le serie dello scope, senza filtro sulla premiere. Nel JSON l'intervallo è `null`.

## Scelte per i casi limite

- **Runtime della serie:** si usa `runtime`; se assente, `averageRuntime`; se mancano entrambi vale `null`.
- **Emittente:** si usa il nome del `network`; se assente, quello del `webChannel`. Se mancano entrambi il nome è `null` e l'origine è `"assente"`.
- **Runtime degli episodi:** il runtime totale è la somma dei runtime degli episodi. Un episodio senza runtime conta 0 minuti, e il campo `episodi_senza_runtime` indica quanti episodi sono stati contati così.
- **Date degli episodi:** gli episodi con `airdate` vuoto sono esclusi dal calcolo della prima e dell'ultima data.
- **Episodio con rating più alto:** a parità di rating vince l'`id` più basso. Se nessun episodio ha un rating, `episodio_migliore` vale `null`.

## Gestione degli errori

Se una chiamata all'API fallisce (errore di rete, risposta non valida o limite di richieste, HTTP 429), il programma stampa un messaggio di errore chiaro su `stderr` e termina con exit code 1.

## Fonte dei dati

Dati forniti da [TVmaze](https://www.tvmaze.com/api), rilasciati con licenza [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).