const $students = $(".student-list").children();
const $pagination = $("<div class='pagination'><ul></ul></div>");
const $search = $("<div class='student-search'><input placeholder='Search for students...'><button>Search</button></div>");
const $noResults = $("<li class ='student-item cf'></li>");

//indexesToShow stores the indexes of all the students that match the search criteria and is used to filter out the students that shouldn't be shown
let indexesToShow;

//Appends the pagination below the students and the searchbar in the top right corner
$students.parent().append($pagination);
$(".page-header").append($search);

//Creates the pagination based on the amount of students to show
function CreatePagination(studentsToShow){
  //Clears all the buttons so the pagination doesn't get duplicated
  $pagination.children().empty();

  //The amount of pages is rounded upwards because in most scenarios an extra page is required e.g. when there are 35 students to show, 4 pages are needed, not 3.5
  let amountPages = Math.ceil(studentsToShow / 10);
  if(amountPages != 1){
    for (let i = 0; i < amountPages; i++) {
      //Creates the buttons as HTMLstrings
      let buttonHTML = "<li><a ";

      //Adds the class active to the first button since that button represents the page the user is on in the start
      if(i == 0)
        buttonHTML += "class='active'";

      buttonHTML += "href='#'>" + (i + 1) + "</a></li>";

      //Appends the buttons to the pagination
      $pagination.children().append(buttonHTML);
    }
  }
}

//Limits the amount of students per page to 10
function LimitStudentsPerPage(pageToShow){
  let index = 0;
  /*
    The calculation of upperLimit returns the number of the last student that will be showm e.g. student 20 is last on page 2
    Subtracting the amount of students per page from the upperLimit returns the index (not the number) of the first student to be shown.
    This is beacuse you have to count the student with the number of upperLimit as one of the students being showm aswell. If you wanted the
    actual number of the student that is first on the page you would have to subtract 10 with 1. However the number of the student
    is irrelevent since we need the index of the first which happens to be the lowerLimit.
  */
  let upperLimit = pageToShow * 10;
  let lowerLimit = upperLimit - 10;

  //If indexesToShow is empty then all the students are hidden and it's just unnecessary to recheck which students are to be shown.
  if(indexesToShow.length !== 0){
    $noResults.remove();

    $students.each(function(){
      let displayValue;

      if(indexesToShow.indexOf($(this).index()) != -1){
        //Only the students that are to be shown on the specified page are shown, the others are hidden
        if(index >= lowerLimit && index < upperLimit){
          displayValue = "list-item";
        }

        else
          displayValue = "none";

        $(this).css("display", displayValue);

        //index is only increased when a student that matches the search criteria is encountered
        index += 1;
      }
    });
  }

  else {
    //Creates a field saying no results were found if there aren't any results
    $noResults.css("display", "list-item").html("<h1>No results were found</h1>");
    $students.parent().prepend($noResults);
  }
}

//This function fills the indexesToShow variable with the indexes of all students because when the stundents are filtered, their index are removed from the variable. If another search is made
//then only the students that hade been filtered out before would be searched through and not all students.
function FillIndexes(){
  //Clears all the previous indexes to avoid duplicates
  indexesToShow = [];

  $students.each(function(index){
    indexesToShow.push(index);
  });
}

$pagination.children().on("click", "li", function(event){
  let $clickedElement = $(event.target);

  //Switches the active pagination page by removing the class from the already active element and adds it to the element that was clicked
  $(".active").removeClass();
  $clickedElement.addClass("active");

  LimitStudentsPerPage($clickedElement.text());
});

//The event for when the search button is clicked
$search.children("button").on("click", function(){
  FillIndexes();

  let searchString = $search.children("input").val();

  //If the value in the searchbar is empty, no filtering will be made
  if (searchString !== ""){
    $students.each(function(){
      let nameAndEmail = ["h3", ".email"];
      let removeIndex = true;
      const $details = $(this).find(".student-details");

      for (var i = 0; i < nameAndEmail.length; i++) {
        if($details.children(nameAndEmail[i]).text().includes(searchString)){
          removeIndex = false;
          break;
        }
      }

      if(removeIndex){
        //Hides the students that don't match the search criteria
        $(this).css("display", "none");

        let indexToRemove = indexesToShow.indexOf($(this).index())

        //If no index was found (a.k.a. -1 was returned) then the last index in the array would be removed
        if(indexToRemove > -1)
          indexesToShow.splice(indexToRemove, 1);
      }
    });
  }

  //Calls the two following functions to update the page and pagnation with the filtered studentes
  LimitStudentsPerPage(1);
  CreatePagination(indexesToShow.length);
});

/*---------Code that runs at start----------*/
//Shows the 10 first students
$students.each(function(index){
  if(index > 9)
    $(this).css("display", "none");
});

//Calls FillIndexes so that all students can be shown and creates a pagination for that amount of students
FillIndexes();
CreatePagination($students.length);
