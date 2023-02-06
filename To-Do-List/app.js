const addBtn = document.querySelector(".add-wrap");
const toDoList = document.querySelector(".todo-list");
const toDoInput = document.querySelector(".todo-input");

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
  checkboxImg.src = "./images/checkbox-btn-unchecked.png";
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

// 체크박스 클릭했을 때 스타일 적용
function handleCheckbox(event) {
  const checkboxImg = event.target;
  const checkbox = checkboxImg.parentElement;
  const toDoItem = checkbox.parentElement;

  if (toDoItem.classList.contains("checked")) {
    checkboxImg.src = "./images/checkbox-btn-unchecked.png";

    toDoItem.classList.remove("checked");
  } else {
    checkboxImg.src = "./images/checkbox-btn-checked.png";

    toDoItem.classList.add("checked");
  }
}

// 항목 옆의 ✖ 버튼 누르면 목록에서 해당 항목 삭제
function removeToDo(event) {
  const toDoItem = event.target.parentElement;
  toDoList.removeChild(toDoItem);
}

// 추가 버튼 눌렀을 때
function handleAddToDo(event) {
  event.preventDefault();

  const newToDo = toDoInput.value;
  toDoInput.value = "";

  paintToDo(newToDo);
}

addBtn.addEventListener("click", handleAddToDo);
