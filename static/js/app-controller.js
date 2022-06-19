// constants
const DONE_TYPING_INTERVAL = 500;
const DELAY_HALF_SECOND = 500;
const DELAY_TWO_SECONDS = 500;
const ZERO = 0;
const ONE = 1;
const FIRST_ITEM = 0;
const SECOND_ITEM = 1;
const NONE = -1;

const ID_BTN_UPDATE = '#btn-update';
const ID_BACK_UPDATE = '#back-update';
const ID_SEARCH_NAM = '#search-nam';
const ID_SEARCH_UPD = '#search-upd';
const ID_SEARCH_DEL = '#search-del';
const ID_CLOSE_ADD = '#close-add';
const ID_FORM_ADD = '#formAdd';
const ID_STUDENTS = '#students';
const ID_STUDENTS_DELETE = '#students-del';
const ID_FORM_UPDATE = '#form-update';
const ID_CAROUSEL_UPDATE = '#carousel-update';
const ID_NEXT_UPDATE = '#next-update';
const ID_UPD_REGISTRATION = '#upd-registration';
const ID_UPD_NAME = '#upd-name';
const ID_UPD_EMAIL = '#upd-email';
const ID_UPD_DBIRTH = '#upd-dBirth';
const ID_UPD_HOMETOWN = '#upd-hometown';
const ID_UPD_SCORE = '#upd-score';
const ID_SEARCH_REG = '#search-reg';
const ID_SEARCH_SCO = '#search-sco';
const ID_CLOSE_DELETE = '#close-delete';
const ID_FORM_DELETE = '#form-delete';

const CLASS_LIST_GROUP_ITEM = '.list-group-item';
const CLASS_LIST_GROUP_UPDATE = 'list-group-update';
const CLASS_LIST_GROUP_DELETE = 'list-group-delete';
const CLASS_LIST_ITEM_LI_UPDATE = 'list-group-item list-group-update li-';
const CLASS_LIST_ITEM_LI_DELETE = 'list-group-item list-group-delete li-';
const CLASS_ITEM_ACTIVE_UPDATE = 'item-active-update';
const CLASS_ITEM_ACTIVE_DELETE = 'item-active-del';
const CLASS_ACTIVE = 'active';
const CLASS_LI_PREFIX = 'li-';
const CLASS_ACTIVE_SEARCH = 'active-search';

const ACTION_CLICK = 'click';
const ACTION_KEYUP = 'keyup';

const TAG_NAME_LI = 'li';

const API_STUDENTS = '/students';
const API_GET_ALL_STUDENTS = API_STUDENTS + '?limit=10&offset=0';
const API_GET_ALL_CRITERIA_PREFIX = API_STUDENTS + '?criteria=';
const API_GET_ALL_CRITERIA_POSTFIX = '&limit=10&offset=0';

const CAROUSEL_NEXT = 'next';
const CAROUSEL_PREV = 'prev';

const CRITERIA_NAME = 'name';
const CRITERIA_REGISTRATION = 'registration';
const CRITERIA_SCORE = 'score';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

const HTTP_CREATED = 201;
const HTTP_OK = 200;

const DATA_TYPE_JSON = 'json';
const APPLICATION_JSON = "application/json";

const SEPARATOR = ' - ';
const SEPARATOR_NO_SPACES = '-';
const DOT = '.';
const SLASH = '/';
const EMPTY = '';

// globals
let count;
let listStudent;
let currentSelected;
let typingTimer;
let searchCriteria;

//TODO call populate all when open modal for update/delete
//TODO correct DB query for search
//TODO correct search when empty or space provided (should return all)
//TODO implement extra search with d3js

function initDataDefault() {
    count = ZERO;
    listStudent = [];
    currentSelected = NONE;
    typingTimer = ZERO;
    searchCriteria = CRITERIA_NAME;
}

function toggleFalse(classId) {
    $(classId).toggle(false);
}

function removeAllElementListForUpdateDelete() {
    $(CLASS_LIST_GROUP_ITEM).remove();
}

function setupSearch(classNm, funcCallback) {
    return () => {
        clearTimeout(typingTimer);
        if ($(classNm).val()) {
            typingTimer = setTimeout(doneTyping, DONE_TYPING_INTERVAL);
        } else {
            funcCallback(listStudent);
        }
    }
}

function setupSearchOnKeyup(classNm, funcCallback) {
    $(classNm).on(ACTION_KEYUP, setupSearch(classNm, funcCallback));
}

function init() {
    initDataDefault();
    removeAllElementListForUpdateDelete();
    toggleFalse(ID_BTN_UPDATE);
    toggleFalse(ID_BACK_UPDATE);
    $(ID_SEARCH_NAM).trigger(ACTION_CLICK);
    setupSearchOnKeyup(ID_SEARCH_UPD, updateList);
    setupSearchOnKeyup(ID_SEARCH_DEL, updateList);
    get_default_students(API_GET_ALL_STUDENTS);
}

window.onload = init;

function get_default_students(value) {
    $.ajax({
        type: HTTP_GET,
        url: value,
        complete: async data => {
            listStudent = data.responseJSON;
            updateList();
            updateListDelete();
        },
        dataType: DATA_TYPE_JSON,
        contentType: APPLICATION_JSON
    });
}

function updateCurrentSelected(classes) {
    classes.forEach(
        item => {
            if (item.startsWith(CLASS_LI_PREFIX)) {
                currentSelected = item.split(SEPARATOR_NO_SPACES)[SECOND_ITEM];
            }
        }
    );
}

function updateListItemOnClick(activeClassNm, elemClassNm, index) {
    return () => {
        removeItemActive(activeClassNm);
        const classes = document.getElementsByClassName(elemClassNm)[index].classList;
        classes.add(activeClassNm, CLASS_ACTIVE);
        updateCurrentSelected(classes);
    }
}

function updateListCommon(groupClassName, itemClassName, active, idStudents) {
    if (listStudent) {
        $(DOT + groupClassName).remove();
        listStudent.forEach((student, i) => {
            const item = document.createElement(TAG_NAME_LI);
            const text = document.createTextNode(student.name + SEPARATOR + student.email + SEPARATOR + student.score);
            item.appendChild(text);
            item.className = itemClassName + i;
            item.type = EMPTY;
            item.onclick = updateListItemOnClick(active, groupClassName, i);
            $(idStudents).append(item);
        });
    }
}

function updateList() {
    updateListCommon(CLASS_LIST_GROUP_UPDATE, CLASS_LIST_ITEM_LI_UPDATE, CLASS_ITEM_ACTIVE_UPDATE, ID_STUDENTS);
}

function updateListDelete() {
    updateListCommon(CLASS_LIST_GROUP_DELETE, CLASS_LIST_ITEM_LI_DELETE, CLASS_ITEM_ACTIVE_DELETE, ID_STUDENTS_DELETE);
}

function removeItemActive(classN) {
    document.getElementsByClassName(classN)[FIRST_ITEM]?.classList.remove(classN, CLASS_ACTIVE);
}

function doneTyping() {
    get_default_students(API_GET_ALL_CRITERIA_PREFIX + $(ID_SEARCH_UPD).val() + API_GET_ALL_CRITERIA_POSTFIX);
}

function createRawStudentJson(classNm) {
    return $(classNm).serializeArray().reduce(function (map, obj) {
        map[obj.name] = obj.value;
        return map;
    }, {});
}

function submitAddForm() {
    const dataRequest = JSON.stringify(createRawStudentJson(ID_FORM_ADD))
    $.ajax({
        type: HTTP_POST,
        url: API_STUDENTS,
        data: dataRequest,
        complete: data => {
            if (data.status === HTTP_CREATED) {
                $(ID_CLOSE_ADD).trigger(ACTION_CLICK);
                $(ID_FORM_ADD)[FIRST_ITEM].reset();
            }
        },
        dataType: DATA_TYPE_JSON,
        contentType: APPLICATION_JSON
    });
}

function submitUpdate() {
    const dataRequest = JSON.stringify(createRawStudentJson(ID_FORM_UPDATE))
    if(listStudent.length > ZERO && currentSelected >= ZERO) {
        $.ajax({
            type: HTTP_PUT,
            url: API_STUDENTS + SLASH + listStudent[currentSelected].registration,
            data: dataRequest,
            complete: async data => {
                if (data.status === HTTP_OK) {
                    $(ID_CLOSE_ADD).trigger(ACTION_CLICK);
                    $(ID_FORM_UPDATE)[FIRST_ITEM].reset();
                }
            },
            dataType: DATA_TYPE_JSON,
            contentType: APPLICATION_JSON
        });
    }
    setTimeout(() => {
        get_default_students(API_GET_ALL_STUDENTS);
    },DELAY_TWO_SECONDS);
}

function toggleUpdateControls(activateNext) {
    const carouselCommand = activateNext ? CAROUSEL_PREV : CAROUSEL_NEXT;
    $(ID_CAROUSEL_UPDATE).carousel(carouselCommand);
    $(ID_NEXT_UPDATE).toggle(activateNext);
    $(ID_BTN_UPDATE).toggle(!activateNext);
    $(ID_BACK_UPDATE).toggle(!activateNext);
}

function backForm() {
    if (count === ONE) {
        count--;
        toggleUpdateControls(true);
    }
}

function nextForm() {
    if (count === ZERO) {
        count++;
        toggleUpdateControls(false);
        populateUpdateForm();
    }
}

function getCurrentStudent() {
     let student = undefined;
     if(currentSelected >= ZERO) {
         return listStudent[currentSelected];
     }
     return student;
}

function populateUpdateForm() {
    let student = getCurrentStudent()
    if(student) {
        $(ID_UPD_REGISTRATION).val(student.registration);
        $(ID_UPD_NAME).val(student.name);
        $(ID_UPD_EMAIL).val(student.email);
        $(ID_UPD_DBIRTH).val(student.dBirth);
        $(ID_UPD_HOMETOWN).val(student.hometown);
        $(ID_UPD_SCORE).val(student.score);
    }
}

function onCloseUpdate() {
    setTimeout(() => {
        backForm();
        $(ID_FORM_UPDATE)[FIRST_ITEM].reset();
        $(CLASS_LIST_GROUP_ITEM).remove();
        currentSelected = -1;
        removeItemActive(CLASS_ITEM_ACTIVE_UPDATE);
        removeItemActive(CLASS_ITEM_ACTIVE_DELETE);
        listStudent = [];
        get_default_students(API_GET_ALL_STUDENTS);
        updateList();
        updateListDelete();
    }, DELAY_HALF_SECOND);
}

function searchName() {
    $(ID_SEARCH_NAM).addClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_REG).removeClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_SCO).removeClass(CLASS_ACTIVE_SEARCH);
    searchCriteria = CRITERIA_NAME;
}

function searchRegistration() {
    $(ID_SEARCH_NAM).removeClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_REG).addClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_SCO).removeClass(CLASS_ACTIVE_SEARCH);
    searchCriteria = CRITERIA_REGISTRATION;
}

function searchScore() {
    $(ID_SEARCH_NAM).removeClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_REG).removeClass(CLASS_ACTIVE_SEARCH);
    $(ID_SEARCH_SCO).addClass(CLASS_ACTIVE_SEARCH);
    searchCriteria = CRITERIA_SCORE;
}

function submitDeleteForm() {
    if(listStudent.length > ZERO && currentSelected >= ZERO) {
        $.ajax({
            type: HTTP_DELETE,
            url: API_STUDENTS + SLASH + listStudent[currentSelected].registration,
            complete: async data => {
                if (data.status === HTTP_OK) {
                    $(ID_CLOSE_DELETE).trigger(ACTION_CLICK);
                    $(ID_FORM_DELETE)[FIRST_ITEM].reset();
                }
            },
            dataType: DATA_TYPE_JSON,
            contentType: APPLICATION_JSON
        });
    }
    setTimeout(() => {
        get_default_students(API_GET_ALL_STUDENTS);
    },DELAY_TWO_SECONDS);
}