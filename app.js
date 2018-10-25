  var index = 0;
  var currentTime;
  var trainSound = new Audio("./audio/steamTrain.mp3")
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC2eAlHCXB27qKZp9-f20lvcewwNuyUFAI",
    authDomain: "train-scheduler-30ef8.firebaseapp.com",
    databaseURL: "https://train-scheduler-30ef8.firebaseio.com",
    projectId: "train-scheduler-30ef8",
    storageBucket: "train-scheduler-30ef8.appspot.com",
    messagingSenderId: "872546173339"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

function clock() {
currentTime.html("The time is: " + moment().format('h:mm a'));
};

$(document).ready(function(){
currentTime = $('.time')
clock();
setInterval(clock, 1000);
});

  // Button for adding trains
$("#add-train-btn").on("click", function(event) {
    trainSound.play();
    event.preventDefault();
  
    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Create local object for holding train data
    var newTrain = {
      train: trainName,
      destination: trainDestination,
      first: firstTrain,
      frequency: trainFrequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });

// Create Firebase event for adding train to the database 
database.ref().on("child_added", function(childSnapshot) {
// store everything as a variable
    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;

    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years")

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");


    var tRemainder = diffTime % trainFrequency;

    var minutesAway = trainFrequency - tRemainder;
  

    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
    
// create a row in the html when a user adds an entry
  var deleteButton = $("<button>");
  deleteButton.attr("data-key", childSnapshot.key);
  deleteButton.attr("data-value", index);
  deleteButton.addClass("delete btn btn-outline-dark")
  deleteButton.text("Delete")
  var newTrainRow = $("<tr>")
  newTrainRow.attr("data-value", index)
  newTrainRow.addClass("train" + index);
  newTrainRow.append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway),
    $("<td>").append(deleteButton)
  );

//increase index by one
index++;

  // Append the new row to the table
  $("#train-table > tbody").append(newTrainRow);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  // create a delete button

function exterminate() {

    $(".train" + $(this).attr("data-value")).remove()
    database.ref().child($(this).attr("data-key")).remove();
}
  $(document).on("click", ".delete", exterminate)


