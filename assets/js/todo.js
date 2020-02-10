const submit = document.querySelector(`#save`);
const list = document.querySelector(`#inList_default`);
const todo = document.querySelector(`#row`);
const date = document.querySelector(`#date`);
date.value = new Date().toISOString().slice(0, 10);
const category = document.querySelector(`#category`);
const createListBtn = document.querySelector(`#create`);
const listName = document.querySelector(`#listName`);
let count = 0;
let arrCount = 0;

//Dummy data
let newInput0 = [];

//Adds data to default template
function PopulateDummyData() {
    newInput0 = [
        [`Lägg nytt golv i kök`, date.value, `Hushåll`],
        [`Dammsug badrummet`, date.value, `Hushåll`],
        [`Maila brosan ang powerApps`, date.value, `Kontakta`],
        [`Ring magnus gällande webb`, date.value, `Kontakta`],
        [`Glöm inte äggen!`, date.value, `Inköp`],
        [`Toapapper`, date.value, `Inköp`],
    ];
    newInput0.forEach(item => {
        DrawInputRow(item[0], item[1], item[2], `#inList_default`);
    });
};

//Gets currentdage and indicates if date is passed
function GetValidDate(el, date) {
    const currentDate = new Date().toISOString().slice(0, 10);
    if (date < currentDate) {
        el.style.color = `red`;
    } else {
        el.style.color = `#7dba7d`;
    }
    el.textContent = date;
}

function DrawInputRow(firstValue, date, category, areatoAdd) {

    const li = document.createElement(`li`);
    const mainDiv = document.createElement(`div`);

    areatoAdd = document.querySelector(areatoAdd);

    areatoAdd.appendChild(li);
    li.appendChild(mainDiv);
    mainDiv.id = `inputRow`;
    mainDiv.dataset.row = count++;

    const firstDiv = document.createElement(`div`);
    mainDiv.appendChild(firstDiv);
    firstDiv.id = `todoHolder`
    mainDiv.appendChild(firstDiv);
    firstDiv.textContent = firstValue;

    const secondDiv = document.createElement(`div`);
    mainDiv.appendChild(secondDiv);
    secondDiv.id = `dateHolder`;
    GetValidDate(secondDiv, date);

    const thirdDiv = document.createElement(`div`);
    mainDiv.appendChild(thirdDiv);
    thirdDiv.id = `cateHolder`;
    thirdDiv.textContent = category;

    const btn = document.createElement(`button`);
    mainDiv.appendChild(btn);
    btn.id = `delete`;
    btn.innerHTML = `<i class='fas fa-times'></i>`;
}

//Draws filtered input
function DrawList(filtered, inlist) {
    const newList = document.querySelector(`#${inlist}`);
    newList.innerHTML = ``;
    filtered.forEach(function(item) {
        DrawInputRow(item[0], item[1], item[2], `#${inlist}`);
    });
}

//Gets result from array based on input search value
function GetResult(arr, value) {
    return arr.filter(input => input.toString().toLowerCase().includes(value.toLowerCase()));
}

function GetListId(e, type = `id`) {
    if (type === `id`) {
        if (e.target.localName === `button`) {
            e = e.parentNode.parentElement.parentNode.id;
        } else if (e.target.localName === `input`) {
            e = e.target.parentElement.querySelector(`.inList`).id;
        } else if (e.target.localName === `radio`) {

        }
    } else {
        //here goes getArray in next update
    }
    return e
}

//Adds created list to dropdown
function InsertListToDrop() {
    const listDrop = document.querySelector(`#todoList`);
    const option = document.createElement(`option`);
    option.text = listName.value;
    option.value = listName.value;
    listDrop.appendChild(option);
}

//Delete item in board
function DeleteItem(e) {
    const targetItem = e.target.parentElement;
    if (targetItem.localName === `button`) {
        const inList = targetItem.parentNode.parentElement.parentNode.id;
        newInput0.splice(targetItem.parentElement.dataset.row, 1);
        DrawList(GetBoardArr(), inList);
        count = 0;
    }
}

let partSearch;
//Sorts result based on radio
function SortByRadios(radio) {
    const selected = radio.value;
    const currentID = GetListId(event);
    if (selected === `alla`) {
        DrawList(GetBoardArr(), currentID);
    } else {
        DrawList(GetResult(GetBoardArr(), selected), currentID)
    }
}

//Handles filter,  drawing list based on result from array
function SearchAndDrawResult(e, filter) {

    const searchValue = e.currentTarget.value;
    const currentID = GetListId(e);
    const currentArr = GetBoardArr();

    //Draws list based on result from array
    DrawList(GetResult(currentArr, searchValue), currentID);

    //Shows full list if filter input is empty
    if (filter.value.length === 0) {
        DrawList(currentArr, currentID);
    }
}


//This function will return correct array next update
function GetBoardArr() {
    return newInput0;
}
//Creates new board (default populates dummy data)
function CreateBoard(name) {

    const listArea = document.querySelector(`.list`);
    const ulEl = listArea.cloneNode(true);
    const rightArea = document.querySelector(`.rightArea`);
    let newFilter;
    let newRadios;
    let newList;
    let uls;

    rightArea.appendChild(ulEl);
    ulEl.id = name;
    rightArea.style.margin = `10px`;
    newList = document.querySelector(`#${name}`);
    const listH3 = newList.querySelector(`#${name} > h3`);
    newList.style.display = `block`;
    newList.classList.add(`fadeIn`);
    listH3.textContent = name;
    uls = newList.querySelector(`.inList`);
    uls.id = `inList_${name}`;
    uls.dataset.arr = `newInput${arrCount++}`
    newFilter = newList.querySelector(`#filter`);
    newRadios = newList.querySelectorAll(`input[type='radio']`);
    console.log(ulEl.id);
    ulEl.classList.add(`fadeIn`);

    if (name === `default`) {
        PopulateDummyData();
    } else {
        uls.innerHTML = ``;
    }

    //Filter listener
    newFilter.addEventListener(`input`, function(e) {
        SearchAndDrawResult(e, newFilter);
    });

    //Delete btn listener
    newList.addEventListener(`click`, function(e) {
        DeleteItem(e);
    });

    //Radio listener
    newRadios.forEach(nRadio => {
        nRadio.addEventListener(`change`, () => {
            SortByRadios(nRadio);
        });
    });
}

//Adds row to board
submit.addEventListener(`click`, () => {
    const selectedlist = document.querySelector(`#todoList`);
    const index = selectedlist.selectedIndex;

    //Pushindata to array, going to push to different arrays later on
    newInput0.push([todo.value, date.value, category.value]);

    if (todo.value.length > 0 && date.value.length > 0) {
        DrawInputRow(todo.value, date.value, category.value, `#inList_${selectedlist.value}`);
        document.querySelector(`#row`).value = ``;
    } else {
        alert(`Fyll i alla fält`);
    }
});

//Create new lists
createListBtn.addEventListener(`click`, () => {
    if (listName.value.length > 0) {
        CreateBoard(listName.value)
        InsertListToDrop();
        listName.value = ``;
    } else {
        alert(`Fyll i listnamn`);
    }
})