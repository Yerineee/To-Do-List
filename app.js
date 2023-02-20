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
const SHOWTYPE_KEY = "showType";
const COMPLETION_KEY = "completion";

let toDos = [];
let currentShowType = "all";
let completionStatus = "false";

// 로컬 스토리지에 배열 저장
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// 로컬 스토리지에 화면에 표시할 항목 유형 저장
function saveShowType() {
  localStorage.setItem(SHOWTYPE_KEY, currentShowType);
}

// 로컬 스토리지에 전체 항목 체크 여부 저장
function saveCompletion() {
  localStorage.setItem(COMPLETION_KEY, completionStatus);
}

// 화면에 표시할 항목 유형 저장 ('all' | 'todos' | 'completed')
function setShowType(showType) {
  currentShowType = showType;

  saveShowType(currentShowType);
}

// 할 일 목록에 새로운 항목 추가
function paintToDo(toDoObj) {
  const toDoItem = document.createElement("li");
  toDoItem.id = toDoObj.id;
  toDoItem.classList.add("todo-item");

  const checkbox = document.createElement("button");
  checkbox.innerText = "✔";
  checkbox.classList.add("checkbox");

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

// 항목 표시 유형에 따라 항목들 화면에 다시 표시
function repaintToDos(toDoItems) {
  removeToDoItems();

  if (currentShowType === "all") {
    toDoItems.forEach(paintToDo);
  } else if (currentShowType === "todos") {
    const leftToDos = filterToDos(false);
    leftToDos.forEach(paintToDo);
  } else {
    const completedToDos = filterToDos(true);
    completedToDos.forEach(paintToDo);
  }
}

// 완료 또는 미완료된 항목들만 반환
function filterToDos(isCompleted) {
  return toDos.filter((todo) => todo.isCompleted === isCompleted);
}

// 체크박스 클릭 시 스타일 적용
function handleCheckbox(event) {
  const checkbox = event.target;
  const toDoItem = checkbox.parentElement;

  // 체크박스 체크되어 있는 경우 체크 해제
  if (toDoItem.classList.contains("checked")) {
    toDoItem.classList.remove("checked");
    updateCompleted(toDoItem);

    if (completeAllBtn.classList.contains("selected")) {
      completeAllBtn.classList.remove("selected");
    }
  }
  // 체크박스 체크되지 않은 경우 체크
  else {
    toDoItem.classList.add("checked");
    updateCompleted(toDoItem);
  }

  if (currentShowType !== "all") {
    repaintToDos(toDos);
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

// 상단의 ✔ 버튼 클릭 시 체크되어있으면 해제, 해제되어있으면 체크
function handleCompleteAll() {
  if (completeAllBtn.classList.contains("selected")) {
    completionStatus = "false";
    saveCompletion();

    completeAllBtn.classList.remove("selected");

    undoCompletedToDos();
  } else {
    completionStatus = "true";
    saveCompletion();

    completeAllBtn.classList.add("selected");

    completeAllToDos();
  }
}

// 모든 항목 완료 체크
function completeAllToDos() {
  toDos = toDos.map((todo) => ({ ...todo, isCompleted: true }));
  saveToDos();

  repaintToDos(toDos);
  countLeftToDos();
}

// 모든 항목 완료 체크 해제
function undoCompletedToDos() {
  toDos = toDos.map((todo) => ({ ...todo, isCompleted: false }));
  saveToDos();

  repaintToDos(toDos);
  countLeftToDos();
}

// 남은 할 일 항목 개수 카운트
function countLeftToDos() {
  let countToDos = 0;
  const leftToDos = filterToDos(false);
  leftToDos.forEach(() => {
    countToDos++;
  });

  toDoCount.innerText = `${countToDos} ToDos`;
}

// 하단의 선택된 버튼에 클래스 추가해서 스타일 적용
function setSeletedBtn(selectedBtn) {
  const currentSelectedBtn = document.querySelector(`#show-${currentShowType}`);
  currentSelectedBtn.classList.remove("selected");

  selectedBtn.classList.add("selected");
}

// 하단의 전체 버튼 클릭 시 전체 항목 표시
function showAllToDos() {
  setSeletedBtn(showAllBtn);
  setShowType("all");

  repaintToDos(toDos);
}

// 하단의 할 일 버튼 클릭 시 남은 할 일 항목만 표시
function showLeftToDos() {
  setSeletedBtn(showTodosBtn);
  setShowType("todos");

  repaintToDos(toDos);
}

// 하단의 완료 버튼 클릭 시 완료된 항목만 표시
function showCompletedToDos() {
  setSeletedBtn(showCompletedBtn);
  setShowType("completed");

  repaintToDos(toDos);
}

addBtn.addEventListener("click", handleAddToDo);
removeAllBtn.addEventListener("click", removeAllToDos);
completeAllBtn.addEventListener("click", handleCompleteAll);
showAllBtn.addEventListener("click", showAllToDos);
showTodosBtn.addEventListener("click", showLeftToDos);
showCompletedBtn.addEventListener("click", showCompletedToDos);

// 새로고침 후에도 항목 유지하기 위함
const savedToDos = localStorage.getItem(TODOS_KEY);
const savedShowType = localStorage.getItem(SHOWTYPE_KEY);
const savedCompletion = localStorage.getItem(COMPLETION_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
}

if (savedShowType !== null) {
  currentShowType = savedShowType;

  const selectedBtn = document.querySelector(`#show-${currentShowType}`);
  selectedBtn.classList.add("selected");

  repaintToDos(toDos);
}

if (savedCompletion !== null) {
  completionStatus = savedCompletion;

  if (completionStatus === "true") {
    completeAllBtn.classList.add("selected");
  }
}
