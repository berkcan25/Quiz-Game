const question = document.getElementById("question"); //Gets the questions by the id tag
const choices = Array.from(document.getElementsByClassName("choice-text")); //Pulls the choices by the class (as an html collection)
//The data tag in our html allows us to give special data to our choice-text elements
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript?',
        choice1: '<script>',
        choice2: '<javascript>',
        choice3: '<js>',
        choice4: '<scripting>',
        answer: 1,
    },
    {
        question:
            "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4,
    },
];

//Constants
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 3;

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
    question.innerText = currentQuestion.question; //Changes the text inside of the question tag
    //update progress bar
    
    choices.forEach( choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
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
        selectedChoice.parentElement.classList.add(classToApply); //Adds the correctness to the whole div
        
        if (classToApply  == "correct") {
            incrementScore(CORRECT_BONUS);
        }
        progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;


        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply); //Removes the correctness to the whole div
            getNewQuestion();
        }, 800)

    })
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}



startGame();