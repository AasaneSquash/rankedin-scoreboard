async function initScoreboard() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const tourneyId = urlParams.get('tournamentID');
    const courtNum = parseInt(urlParams.get('court'), 10);

    if (!tourneyId || isNaN(courtNum)) {
        console.error("Mangler info! Legg til ?tournamentID=ID&court=TALL i adressen.");
        return; 
    }

    let courtId;

    try {
        const courtsApiUrl = `https://live.rankedin.com/api/v1/Tournament/${tourneyId}/court-ids`;
        const response = await fetch(courtsApiUrl);
        const courtIds = await response.json();

        const courtIndex = courtNum - 1; 
        if (courtIndex < 0 || courtIndex >= courtIds.length) {
            console.error(`Fant ikke Bane ${courtNum}`);
            return;
        }
        courtId = courtIds[courtIndex];

    } catch (error) {
        console.error("Klarte ikke å hente baneliste:", error);
        return; 
    }

    const matchApiUrl = `https://live.rankedin.com/api/v1/Court/${courtId}/scoreboard`;

    // Hjelpefunksjon for å gjøre sekunder om til MM:SS format
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    async function updateScoreboard() {
        try {
            const response = await fetch(matchApiUrl);
            const data = await response.json();

            const liveBoard = document.getElementById('live-board');
            const intermissionBoard = document.getElementById('intermission-board');

            // --- ER KAMPEN LIVE? ---
            if (data.liveMatch) {
                // Vis live-tavlen, skjul pause-tavlen
                liveBoard.style.display = 'flex';
                intermissionBoard.style.display = 'none';

                const match = data.liveMatch;

                // Oppdater Navn
                document.getElementById('p1-name').innerText = match.base.firstParticipant[0].lastName;
                document.getElementById('p2-name').innerText = match.base.secondParticipant[0].lastName;

                // Oppdater Sett-score
                document.getElementById('p1-sets').innerText = match.state.score.firstParticipantScore;
                document.getElementById('p2-sets').innerText = match.state.score.secondParticipantScore;

                // Oppdater Game-score
                const gamesArray = match.state.score.detailedResult;
                if (gamesArray && gamesArray.length > 0) {
                    const currentGame = gamesArray[gamesArray.length - 1];
                    document.getElementById('p1-points').innerText = currentGame.firstParticipantScore;
                    document.getElementById('p2-points').innerText = currentGame.secondParticipantScore;
                } else {
                    document.getElementById('p1-points').innerText = "0";
                    document.getElementById('p2-points').innerText = "0";
                }

                // Oppdater Serve-indikator
                const isP1Serving = match.state.serve.isFirstParticipantServing;
                if (isP1Serving) {
                    document.getElementById('p1-serve').classList.add('active');
                    document.getElementById('p2-serve').classList.remove('active');
                } else {
                    document.getElementById('p1-serve').classList.remove('active');
                    document.getElementById('p2-serve').classList.add('active');
                }

                // Oppdater Turnering/Klasse Info og Tid
                document.getElementById('tourney-info').innerText = match.base.className || "SQUASH";
                document.getElementById('match-time').innerText = formatTime(match.state.totalDurationInSeconds);

            // --- HVIS INGEN KAMP PÅGÅR (MELLOM KAMPER) ---
            } else {
                // Skjul live-tavlen, vis pause-tavlen
                liveBoard.style.display = 'none';
                intermissionBoard.style.display = 'flex';

                // 1. BYGG "PREVIOUS MATCH"
                const prevContent = document.getElementById('prev-match-content');
                if (data.previousMatch) {
                    const pm = data.previousMatch;
                    const p1Name = pm.firstParticipant[0].lastName;
                    const p2Name = pm.secondParticipant[0].lastName;
                    
                    const p1Sets = pm.score.firstParticipantScore;
                    const p2Sets = pm.score.secondParticipantScore;

                    // Farger basert på hvem som vant
                    const p1ColorClass = pm.isFirstParticipantWinner ? "winner-color" : "loser-color";
                    const p2ColorClass = !pm.isFirstParticipantWinner ? "winner-color" : "loser-color";

                    // Bygg score-kolonnene dynamisk i HTML
                    let gamesHtmlP1 = '';
                    let gamesHtmlP2 = '';
                    
                    if (pm.score.detailedResult && pm.score.detailedResult.length > 0) {
                        pm.score.detailedResult.forEach(game => {
                            gamesHtmlP1 += `<div class="prev-score-col ${p1ColorClass}">${game.firstParticipantScore}</div>`;
                            gamesHtmlP2 += `<div class="prev-score-col ${p2ColorClass}">${game.secondParticipantScore}</div>`;
                        });
                    }

                    // Injisér den ferdige HTML-en i boksen
                    prevContent.innerHTML = `
                        <div class="prev-row">
                            <div class="prev-name ${p1ColorClass}">${p1Name}</div>
                            <div class="prev-scores-container">${gamesHtmlP1}</div>
                            <div class="prev-set-total">${p1Sets}</div>
                        </div>
                        <div class="prev-row">
                            <div class="prev-name ${p2ColorClass}">${p2Name}</div>
                            <div class="prev-scores-container">${gamesHtmlP2}</div>
                            <div class="prev-set-total">${p2Sets}</div>
                        </div>
                    `;

                    // Regn ut Duration (sekunder delt på 60, rundet av)
                    const durationMins = Math.round(pm.totalDurationInSeconds / 60);
                    document.getElementById('prev-duration').innerText = `DURATION: ${durationMins} min`;

                } else {
                    // Hvis null (Ingen forrige kamp spilt enda)
                    prevContent.innerHTML = `<div class="empty-message">NO PREVIOUS MATCH</div>`;
                    document.getElementById('prev-duration').innerText = `DURATION: - min`;
                }

                // 2. BYGG "NEXT MATCH"
                if (data.nextMatch && data.nextMatch.matchId !== 0 && data.nextMatch.startTime) {
                    const nm = data.nextMatch;
                    
                    // Formatér klokkeslett (fra "2026-04-03T11:00:00" til "11:00")
                    const dateObj = new Date(nm.startTime);
                    // Pass på at vi alltid får to siffer (f.eks. "09" og ikke bare "9")
                    const hours = dateObj.getHours().toString().padStart(2, '0');
                    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                    const timeString = `${hours}:${minutes}`;

                    // Sjekk om navnene finnes, ellers bruk TBD (To Be Decided)
                    const p1Name = nm.firstParticipant[0].lastName || "Pending";
                    const p2Name = nm.secondParticipant[0].lastName || "Pending";

                    document.getElementById('next-time').innerText = `TIME: ${timeString}`;
                    document.getElementById('next-match-players').innerHTML = `${p1Name} <span class="vs">vs</span> ${p2Name}`;
                    document.getElementById('next-class').innerText = `CLASS: ${nm.className || "-"}`;

                } else {
                    // Hvis null (Turneringen er ferdig for denne banen)
                    document.getElementById('next-time').innerText = `TIME: -`;
                    document.getElementById('next-match-players').innerHTML = `<div class="empty-message">NO MORE MATCHES ON THIS COURT</div>`;
                    document.getElementById('next-class').innerText = `CLASS: -`;
                }
            }

        } catch (error) {
            console.error("Klarte ikke hente kampdata:", error);
        }
    }

    updateScoreboard();
    setInterval(updateScoreboard, 3000);
}

initScoreboard();