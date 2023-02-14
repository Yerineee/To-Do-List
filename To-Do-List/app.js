const addBtn = document.querySelector(".add-button");
const toDoList = document.querySelector(".todo-list");
const toDoInput = document.querySelector(".todo-input");
const removeAllBtn = document.querySelector(".remove-all");
const toDoCount = document.querySelector(".todo-count");
const showAllBtn = document.querySelector("#show-all");
const showTodosBtn = document.querySelector("#show-todos");
const showCompletedBtn = document.querySelector("#show-completed");
const completeAllBtn = document.querySelector(".complete-all");

const TODOS_KEY = "toDos";

let toDos = [];
let currentShowType = "all";

// 화면에 표시할 항목 유형 저장 ('all' | 'todo' | 'complete')
function setShowType(showType) {
  currentShowType = showType;
}

// 로컬 스토리지에 배열 저장
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// 할 일 목록에 새로운 항목 추가
function paintToDo(toDoObj) {
  const toDoItem = document.createElement("li");
  toDoItem.id = toDoObj.id;
  toDoItem.classList.add("todo-item");

  const checkbox = document.createElement("button");
  checkbox.classList.add("checkbox");

  const checkboxText = document.createElement("div");
  checkboxText.innerText = "✔";
  checkboxText.classList.add("checkbox-text");

  checkbox.appendChild(checkboxText);
  checkbox.addEventListener("click", handleCheckbox);

  const toDoText = document.createElement("div");
  toDoText.classList.add("todo-text");
  toDoText.innerText = toDoObj.text;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-item");
  removeBtn.innerText = "✖";
  removeBtn.addEventListener("click", removeToDo);

  toDoItem.appendChild(checkbox);
  toDoItem.appendChild(toDoText);
  toDoItem.appendChild(removeBtn);

  if (toDoObj.isCompleted) {
    toDoItem.classList.add("checked");
  }

  toDoList.appendChild(toDoItem);

  countLeftToDos();
}

// 항목들 화면에 다시 표시
function repaintToDos(toDoItems) {
  removeToDoItems();
  toDoItems.forEach(paintToDo);
}

// 체크박스 클릭 시 스타일 적용
function handleCheckbox(event) {
  const checkbox = event.target;
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

// 화면에서 모든 항목 삭제
function removeToDoItems() {
  while (toDoList.hasChildNodes()) {
    toDoList.removeChild(toDoList.firstChild);
  }
}

// 전체삭제 버튼 클릭 시 모든 항목 삭제 (로컬 스토리지에서도 삭제)
function removeAllToDos() {
  removeToDoItems();

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

// 상단의 ✔ 버튼 클릭 시 모든 항목 완료 체크
function completeAllToDos() {
  toDos = toDos.map((todo) => ({ ...todo, isCompleted: true }));
  saveToDos();

  currentShowType === "todo" ? removeToDoItems() : repaintToDos(toDos);
  countLeftToDos();
}

// 남은 할 일 항목 개수 카운트
function countLeftToDos() {
  let countToDos = 0;
  toDos
    .filter((todo) => !todo.isCompleted)
    .forEach(() => {
      countToDos++;
    });

  toDoCount.innerText = `${countToDos} ToDos`;
}

// 하단의 전체 버튼 클릭 시 전체 항목 표시
function showAllToDos() {
  setShowType("all");

  repaintToDos(toDos);
}

// 하단의 할 일 버튼 클릭 시 남은 할 일 항목만 표시
function showLeftToDos() {
  setShowType("todo");

  const leftToDos = toDos.filter((todo) => !todo.isCompleted);
  repaintToDos(leftToDos);
}

// 하단의 완료 버튼 클릭 시 완료된 항목만 표시
function showCompletedToDos() {
  setShowType("complete");

  const completedToDos = toDos.filter((todo) => todo.isCompleted);
  repaintToDos(completedToDos);
}

addBtn.addEventListener("click", handleAddToDo);
removeAllBtn.addEventListener("click", removeAllToDos);
completeAllBtn.addEventListener("click", completeAllToDos);
showAllBtn.addEventListener("click", showAllToDos);
showTodosBtn.addEventListener("click", showLeftToDos);
showCompletedBtn.addEventListener("click", showCompletedToDos);

// 새로고침 후에도 항목 유지하기 위함
const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}
