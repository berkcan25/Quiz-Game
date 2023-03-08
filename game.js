const question = document.getElementById("question"); //Gets the questions by the id tag
const choices = Array.from(document.getElementsByClassName("choice-text")); //Pulls the choices by the class (as an html collection)
//The data tag in our html allows us to give special data to our choice-text elements
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const exitMenu = document.getElementById("exitMenu");
const escapeKey = document.getElementById("escapeKey");
const game = document.getElementById("game");
const yesExit = document.getElementById("yes");
const noExit = document.getElementById("no");


const linkToQuestions = "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];


fetch(linkToQuestions)
    .then( res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map( loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoises = [ ... loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
            answerChoises.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );
            answerChoises.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch( err => {
        console.error(err)
    })

//Constants
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [ ... questions]; //Setting equal to each other makes them point to the same thing. Lists are mutable in java
    // ... Spread operator. Takes the objects from the questions array and assigns them to the availableQuestions array
    getNewQuestion();
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //go to end screen
        return window.location.assign("end.html");
        //sends the player to the endscreen
    }
    questionCounter ++;
    questionCounterText.innerText = questionCounter;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question; //Changes the text inside of the question tag
    //update progress bar
    
    choices.forEach( choice => {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion["choice" + number];
    });
    
    availableQuestions.splice(questionIndex, 1);
    
    acceptingAnswers = true;
    
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;
        
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];;

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        choices[currentQuestion.answer-1].parentElement.classList.add("correct");
        selectedChoice.parentElement.classList.add(classToApply); //Adds the correctness to the whole div        
        if (classToApply  == "correct") {
            incrementScore(CORRECT_BONUS);
        }
        progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;


        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply); //Removes the correctness to the whole div
            choices[currentQuestion.answer-1].parentElement.classList.remove("correct");
            getNewQuestion();
        }, 800)

    })
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

escapeKey.addEventListener("click", exit => {
    acceptingAnswers = false;
    exitMenu.style.display = "flex";
    game.style.opacity = 0.25;
    yesExit.addEventListener("click",  leave => {
        exitMenu.style.display = "none";
        game.style.opacity = 1;
        return window.location.assign("index.html");
    })
    noExit.addEventListener("click",  leave => {
        exitMenu.style.display = "none";
        game.style.opacity = 1;
    })
})




