const addBtn = document.querySelector(".add-wrap");
const toDoList = document.querySelector(".todo-list");
const toDoInput = document.querySelector(".todo-input");
const removeAllBtn = document.querySelector(".remove-all");
const toDoCount = document.querySelector(".todo-count");

const TODOS_KEY = "toDos";

let toDos = [];

// 로컬 스토리지에 배열 저장
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// 할 일 목록에 새로운 항목 추가
function paintToDo(newToDoObj) {
  const toDoItem = document.createElement("li");
  toDoItem.id = newToDoObj.id;
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
  toDoText.innerText = newToDoObj.text;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-item");
  removeBtn.innerText = "✖";
  removeBtn.addEventListener("click", removeToDo);

  toDoItem.appendChild(checkbox);
  toDoItem.appendChild(toDoText);
  toDoItem.appendChild(removeBtn);

  if (newToDoObj.isCompleted) {
    toDoItem.classList.add("checked");
  }

  toDoList.appendChild(toDoItem);

  countLeftToDos();
}

// 체크박스 클릭 시 스타일 적용
function handleCheckbox(event) {
  const checkboxImg = event.target;
  const checkbox = checkboxImg.parentElement;
  const toDoItem = checkbox.parentElement;

  if (toDoItem.classList.contains("checked")) {
    toDoItem.classList.remove("checked");
    updateCompleted(toDoItem);
  } else {
    toDoItem.classList.add("checked");
    updateCompleted(toDoItem);
  }
}

// 항목 옆의 ✖ 버튼 클릭 시 목록에서 해당 항목 삭제
function removeToDo(event) {
  const toDoItem = event.target.parentElement;

  toDoItem.remove();

  // 해당 id를 가진 항목을 제외하고 배열 및 로컬 스토리지에 다시 저장
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(toDoItem.id));
  saveToDos();

  countLeftToDos();
}

// 전체삭제 버튼 클릭 시 모든 항목 삭제
function removeAll() {
  while (toDoList.hasChildNodes()) {
    toDoList.removeChild(toDoList.firstChild);
  }

  toDos = [];
  saveToDos();

  countLeftToDos();
}

// 추가 버튼 클릭 시
function handleAddToDo(event) {
  event.preventDefault();

  const newToDo = toDoInput.value;
  toDoInput.value = "";

  const newToDoObj = {
    text: newToDo,
    id: Date.now(),
    isCompleted: false,
  };

  toDos.push(newToDoObj);

  paintToDo(newToDoObj);
  saveToDos();
}

// 투두 항목의 완료 여부 업데이트
function updateCompleted(event) {
  toDos = toDos.map((todo) => {
    if (todo.id === parseInt(event.id)) {
      return { ...todo, isCompleted: !todo.isCompleted };
    } else {
      return todo;
    }
  });
  saveToDos();

  countLeftToDos();
}

// 남은 할 일 항목 개수 카운트
function countLeftToDos() {
  let countToDos = 0;
  toDos.forEach((todo) => {
    if (!todo.isCompleted) {
      countToDos++;
    }
  });

  toDoCount.innerText = `${countToDos} ToDos`;
}

addBtn.addEventListener("click", handleAddToDo);
removeAllBtn.addEventListener("click", removeAll);

// 새로고침 후에도 항목 유지하기 위함
const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}
