window.addEventListener('load', () => {
    function retrieveCourseAndProfessorName() {
        return new Promise((resolve, reject) => {
            if (window.location.href == 'https://banregister.unf.edu/StudentRegistrationSsb/ssb/classSearch/classSearch'){

                let searchButton = document.getElementById("search-go");
                searchButton.onclick = classPageLoaded;

                function classPageLoaded() {
                    // Changes the amount of courses displayed in the table from 10 per page to 50 per page
                    setTimeout(() => {
                        const selections = document.querySelector('select.page-size-select');
                        selections.value = 50;
                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", true, true);
                        selections.dispatchEvent(evt);
                    }, 1000);

                    setTimeout(() => {  
                        let courseFromCoursePage;
                        let courseAndProfessorName = [];   
                        let subject = document.querySelector("#searchTerms > span:nth-child(2) > label > span").innerHTML.substring(0, 3);
                        const trlist = document.querySelector("#table1 > tbody").getElementsByTagName("tr");
                        let entireTable = Array.from(trlist); 

                        for(let i = 0; i < entireTable.length; i++) {
                            let currentProfessor = Array.from(entireTable[i].cells[7].getElementsByTagName("a"));
                            if(currentProfessor != "") {
                                let professorLastNameFromCoursePage = currentProfessor[0].innerHTML.split(" ").pop();;
                                courseFromCoursePage = subject.concat(entireTable[i].cells[2].innerHTML.toString());
                                courseAndProfessorName[i] = courseFromCoursePage.concat(" ", professorLastNameFromCoursePage); 
                            } else {
                                courseAndProfessorName[i] = courseFromCoursePage.concat(" ", "No professor listed");
                            }
                        }
                        resolve(courseAndProfessorName);
                    }, 3500); 
                }
            }
        });
    }

    function retrieveISQ_Data() {
        return new Promise((resolve, reject) => {
            let ISQData = [];

            // Used to split ISQ Data into a 2D-Array, where each outer index consists of an array of 2 elements: Course & Professor Name 
            function stringTo2dArray(string, d1, d2) {
                return string.split(d1).map(function(x){return x.split(d2)});
            }

            let requestISQData = new XMLHttpRequest();
            requestISQData.open('GET', 'https://gist.githubusercontent.com/DavidKlejc/0e339bdad700eea6c70fff2c14cbff32/raw/af60480b53bfcfd79bef6650073c1358d8585263/ISQData.csv', true);
            requestISQData.onreadystatechange = function()
            {
                if(requestISQData.readyState == XMLHttpRequest.DONE && requestISQData.status == 200)
                {
                    ISQData = stringTo2dArray(requestISQData.response, "\n", "\t");
                    for(let i = 0; i < ISQData.length; i++) {
                        for(let j = 0; j < 1; j++) {
                            ISQData[i][0] = ISQData[i][0].replace(",", ""); 
                        }
                    }
                    resolve(ISQData);
                }
            }
            requestISQData.send();
        });
    }

    async function insertIntoTable() {

        const coursesAndProfessors = await retrieveCourseAndProfessorName();
        const ISQ_Data = await retrieveISQ_Data();

        console.log(coursesAndProfessors);
        console.log(ISQ_Data);

        let tableOfRatings = [];
        let professorFound = false;

        for(let i = 0; i < coursesAndProfessors.length; i++) {
            let professorRating = "No rating found";
            for(let j = 0; j < ISQ_Data.length; j++) {
                if(coursesAndProfessors[i] === ISQ_Data[j][0]) {
                    professorRating = parseFloat(ISQ_Data[j][1]);
                    professorRating = professorRating.toFixed(2);
                    professorFound = true;
                }
            }
            if(professorFound) {
                tableOfRatings[i] = professorRating;
            }
        }
        console.log(tableOfRatings);

        // Now that I have the tableOfRatings, insert into course registration page 
        // Just need to add a td in each row. 




    }
    insertIntoTable();
}); 