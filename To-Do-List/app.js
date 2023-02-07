const addBtn = document.querySelector(".add-wrap");
const toDoList = document.querySelector(".todo-list");
const toDoInput = document.querySelector(".todo-input");

const toDos = [];

function getToDos() {
  return JSON.parse(JSON.stringify(localStorage.getItem("toDo")));
}

// 로컬 스토리지에 항목 저장
function saveToDo(newToDo) {
  localStorage.setItem("toDos", newToDo);
}

// 할 일 목록에 새로운 항목 추가
function paintToDo(newToDo) {
  const toDoItem = document.createElement("li");
  toDoItem.classList.add("todo-item");

  const checkbox = document.createElement("div");
  checkbox.classList.add("checkbox");

  const checkboxImg = document.createElement("img");
  checkboxImg.src = "./images/checkbox-btn.png";
  checkbox.addEventListener("click", handleCheckbox);

  const checkboxText = document.createElement("div");
  checkboxText.innerText = "✔";
  checkboxText.classList.add("checkbox-text");

  checkbox.appendChild(checkboxImg);
  checkbox.appendChild(checkboxText);

  const toDoText = document.createElement("div");
  toDoText.classList.add("todo-text");
  toDoText.innerText = newToDo;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-item");
  removeBtn.innerText = "✖";
  removeBtn.addEventListener("click", removeToDo);

  toDoItem.appendChild(checkbox);
  toDoItem.appendChild(toDoText);
  toDoItem.appendChild(removeBtn);

  toDoList.appendChild(toDoItem);
}

// 체크박스 클릭 시 스타일 적용
function handleCheckbox(event) {
  const checkboxImg = event.target;
  const checkbox = checkboxImg.parentElement;
  const toDoItem = checkbox.parentElement;

  if (toDoItem.classList.contains("checked")) {
    toDoItem.classList.remove("checked");
  } else {
    toDoItem.classList.add("checked");
  }
}

// 항목 옆의 ✖ 버튼 클릭 시 목록에서 해당 항목 삭제
function removeToDo(event) {
  const toDoItem = event.target.parentElement;
  toDoList.removeChild(toDoItem);
}

// 추가 버튼 클릭 시
function handleAddToDo(event) {
  event.preventDefault();

  const newToDo = toDoInput.value;
  toDoInput.value = "";

  paintToDo(newToDo);

  toDos.push(newToDo);
  localStorage.setItem("toDo", toDos);
}

addBtn.addEventListener("click", handleAddToDo);
