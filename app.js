let formButton = document.querySelector("form button");
let section = document.querySelector("section");

loadData();

formButton.addEventListener("click", (e) => {
  //stop form submitted
  e.preventDefault();
  let form = e.target.parentElement;
  //get form value
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDay = form.children[2].value;

  if (todoText === "") {
    alert("Please Enter some text.");
    return;
  }

  //print value
  let addDiv = document.createElement("div");
  addDiv.classList.add("add_Div");
  let toText = document.createElement("p");
  toText.classList.add("add_toText");
  toText.innerText = todoText;
  let toTextDate = document.createElement("p");
  toTextDate.classList.add("add_toTextDate");
  toTextDate.innerText = todoMonth + "/" + todoDay;
  addDiv.appendChild(toText);
  addDiv.appendChild(toTextDate);

  addDiv.style.animation = "scaleUp 0.5s forwards";

  section.appendChild(addDiv);

  //create complete button

  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeCheck(completeButton);

  //trash button

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

  deleteFunction(trashButton);

  addDiv.appendChild(completeButton);
  addDiv.appendChild(trashButton);

  section.appendChild(addDiv);

  form.children[0].value = "";

  // create an object
  let localStorageObject = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDay: todoDay,
  };
  storeData(localStorageObject);
});

function completeCheck(completeButton) {
  completeButton.addEventListener("click", (e) => {
    let completeDone = e.target.parentElement;
    completeDone.classList.toggle("done");
  });
}

function deleteFunction(trashButton) {
  trashButton.addEventListener("click", (e) => {
    let deleteItem = e.target.parentElement;
    deleteItem.style.animation = "scaleDown 0.3s forwards";
    deleteItem.addEventListener("animationend", () => {
      //remove from localStorage
      let text = deleteItem.children[0].innerText;
      let localStorageList = localStorage.getItem("list");
      let localStorageArray = JSON.parse(localStorageList);
      localStorageArray.forEach((e, index) => {
        if (text == e.todoText) {
          localStorageArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(localStorageArray));
        }
      });

      deleteItem.remove();
    });
  });
}
function storeData(localStorageObject) {
  //store data into an array of object
  if (localStorage.getItem("list") == null) {
    localStorage.setItem("list", JSON.stringify([localStorageObject]));
  } else {
    let localStorageList = localStorage.getItem("list");
    localStorageArray = JSON.parse(localStorageList);
    localStorageArray.push(localStorageObject);
    localStorage.setItem("list", JSON.stringify(localStorageArray));
  }
}

function loadData() {
  let localStorageList = localStorage.getItem("list");
  if (localStorageList !== null) {
    let localStorageArray = JSON.parse(localStorageList);
    localStorageArray.forEach((element) => {
      let addDiv = document.createElement("div");
      addDiv.classList.add("add_Div");
      let toText = document.createElement("p");
      toText.classList.add("add_toText");
      toText.innerText = element.todoText;
      let toTextDate = document.createElement("p");
      toTextDate.classList.add("add_toTextDate");
      toTextDate.innerText = element.todoMonth + "/" + element.todoDay;
      addDiv.appendChild(toText);
      addDiv.appendChild(toTextDate);

      //create complete button

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeCheck(completeButton);

      //trash button

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

      deleteFunction(trashButton);

      addDiv.appendChild(completeButton);
      addDiv.appendChild(trashButton);

      section.appendChild(addDiv);
    });
  }
}

function megreSort(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDay) > Number(arr2[j].todoDay)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr2[i]);
        i++;
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function merge(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    mid = Math.floor(arr.length / 2);
    left = arr.slice(0, mid);
    right = arr.slice(mid, arr.length);
    return megreSort(merge(left), merge(right));
  }
}

// sort by time

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  let sortedData = merge(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedData));

  //remove Data
  len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }
  // //load Data
  loadData();
});
