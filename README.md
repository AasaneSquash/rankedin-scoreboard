# Squash Resultattavle (Rankedin Overlay)

Dette prosjektet er en dynamisk, web-basert resultattavle designet for live-strømming av squash-kamper. Den integrerer direkte mot **Rankedin sitt Live API** for å automatisk hente inn kampdata, spillernavn, poeng og serve-indikatorer.

Nettleser-kilden bytter sømløst mellom to design basert på banens status:
1. **Live-tavle:** Vises når en kamp pågår (poeng, sett, hvem som server og spilletid).
2. **Pause-tavle (Intermission):** Vises mellom kamper. Viser resultatet fra forrige kamp på banen, samt hvem som skal spille neste kamp og når den starter.

---

## Hvordan bruke den (Live URL)

Prosjektet er satt opp for å hostes via GitHub Pages (eller lignende tjenester). For at tavlen skal vite hvilken turnering og bane den skal vise, **må du inkludere URL-parametere** i nettadressen.

**Grunnformat:**
```
https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=[ID]&court=[BANENUMMER]
```

### Hvor finner jeg turnerings-ID?
Du finner turnerings-IDen din i nettadressen (URL-en) når du er inne på turneringssiden din på Rankedin.com. Det er tallet som står midt i lenken, rett etter `/tournament/` og før selve navnet på turneringen.

**Eksempel:**
La oss si at du er inne på siden til denne turneringen:


`https://www.rankedin.com/en/tournament/4997/senior-nm-squash-2021`

I denne lenken er turnerings-IDen **`4997`**. 

For å bruke denne spesifikke turneringen for bane 1 i resultattavlen, setter du sammen URL-en slik:
```text
https://aasanesquash.github.io/rankedin-scoreboard/?tournamentID=4997&court=1
