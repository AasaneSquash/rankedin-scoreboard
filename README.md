# Squash Resultattavle (Rankedin Overlay)

Dette prosjektet er en dynamisk, web-basert resultattavle designet for live-strømming av squash-kamper. Den integrerer direkte mot Rankedin sitt Live API for å automatisk hente inn kampdata, spillernavn, poeng og serve-indikatorer.

Nettleser-kilden bytter sømløst mellom to design basert på banens status:

* **Live-tavle:** Vises når en kamp pågår (poeng, sett, hvem som server og spilletid).
* **Pause-tavle (Intermission):** Vises mellom kamper. Viser resultatet fra forrige kamp på banen, samt hvem som skal spille neste kamp og når den starter.

## Hvordan bruke den (Live URL)

Prosjektet er satt opp for å hostes via GitHub Pages (eller lignende tjenester). For at tavlen skal vite hvilken turnering og bane den skal vise, må du inkludere URL-parametere i nettadressen.

**Grunnformat:**

```text
[https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=](https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=)[ID]&court=[BANENUMMER]
```

## Hvor finner jeg turnerings-ID?

Du finner turnerings-ID-en i nettadressen (URL-en) når du er inne på turneringssiden din på Rankedin.com. Det er tallet som står rett etter `/tournament/` og før navnet på turneringen.

**Eksempel:**

```text
[https://www.rankedin.com/en/tournament/4997/senior-nm-squash-2021](https://www.rankedin.com/en/tournament/4997/senior-nm-squash-2021)
```

I denne lenken er turnerings-ID-en **4997**.

For å bruke denne spesifikke turneringen for bane 1 i resultattavlen, setter du sammen URL-en slik:

```text
[https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=4997&court=1](https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=4997&court=1)
```

## Utvikler, datakilde og opphav

Scoreboardet er utviklet av Olav Ødven Løve for Aasane Squash.

Prosjektet er utviklet for å gjøre det enklere å vise oppdaterte kampresultater og kampinformasjon under direktesendinger av squash. Scoreboardet henter kampdata fra Rankedin Live API, inkludert spillernavn, poengsummer, kampstatus og spilletid.

* **Utvikler:** Olav Ødven Løve
* **Datakilde og API:** Rankedin
* **API-endepunkter:** https://live.rankedin.com/index.html

Rankedin leverer kampdataene som scoreboardet viser. Selve scoreboard-grensesnittet og integrasjonen mot API-et er utviklet for dette prosjektet.

*Rankedin og deres API er eksterne tjenester. Dette prosjektet er ikke offisielt tilknyttet eller godkjent av Rankedin.*
