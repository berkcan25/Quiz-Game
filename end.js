const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

username.addEventListener("input", () => {
    saveScoreBtn.disabled = !username.value;
})

finalScore.innerText = mostRecentScore;

saveHighScore = e => {
    e.preventDefault();
    
    const score = {
        score: mostRecentScore,
        name: username.value
    }
    highScores.push(score);
    highScores.sort((a,b) => b.score - a.score)
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    saveScoreBtn.disabled = true;

}