class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.buildTree(arr, 0, 0, this.n - 1);
  }
  buildTree(arr, treeIndex, start, end) {
    if (start === end) {
      this.tree[treeIndex] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.buildTree(arr, 2 * treeIndex + 1, start, mid);
      this.buildTree(arr, 2 * treeIndex + 2, mid + 1, end);
      this.tree[treeIndex] =
        this.tree[2 * treeIndex + 1] + this.tree[2 * treeIndex + 2];
    }
  }
  queryRangeSum(treeIndex, start, end, left, right) {
    if (start > right || end < left) {
      return 0;
    }
    if (start >= left && end <= right) {
      return this.tree[treeIndex];
    }
    const mid = Math.floor((start + end) / 2);
    const p1 = this.queryRangeSum(2 * treeIndex + 1, start, mid, left, right);
    const p2 = this.queryRangeSum(2 * treeIndex + 2, mid + 1, end, left, right);
    return p1 + p2;
  }
}

let studentData = [
  { id: 1, name: "John Doe", grade: 85 },
  { id: 2, name: "Jane Smith", grade: 92 },
  { id: 3, name: "Michael Johnson", grade: 78 },
  { id: 4, name: "Emily Davis", grade: 90 },
  { id: 5, name: "David Wilson", grade: 82 },
];

const studentTable = document.getElementById("student-data");
let segmentTree = new SegmentTree(studentData.map((student) => student.grade));

function renderStudentTable() {
  studentTable.innerHTML = "";
  studentData.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.grade}</td>
        <td>
        <button onclick="editStudent(${student.id})">Edit</button>
        <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
    `;
    studentTable.appendChild(row);
  });
}
renderStudentTable();

function addStudent() {
  const studentName = document.getElementById("student-name").value;
  const studentGrade = parseInt(document.getElementById("student-grade").value);
  if (studentName && !isNaN(studentGrade)) {
    const newStudent = {
      id: studentData.length + 1,
      name: studentName,
      grade: studentGrade,
    };
    studentData.push(newStudent);
    renderStudentTable();
    segmentTree = new SegmentTree(studentData.map((student) => student.grade));
    document.getElementById("student-name").value = "";
    document.getElementById("student-grade").value = "";
  }
}

function editStudent(id) {
  const student = studentData.find((student) => student.id === id);
  if (student) {
    const newName = prompt("Enter new name:", student.name);
    const newGrade = prompt("Enter new grade:", student.grade);
    if (newName !== null && newGrade !== null) {
      student.name = newName;
      student.grade = parseInt(newGrade);
      renderStudentTable();
      segmentTree = new SegmentTree(
        studentData.map((student) => student.grade)
      );
    }
  }
}

function deleteStudent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?"
  );
  if (confirmDelete) {
    studentData = studentData.filter((student) => student.id !== id);
    renderStudentTable();
    segmentTree = new SegmentTree(studentData.map((student) => student.grade));
  }
}

function queryRangeSum() {
  const startIndex = document.getElementById("start-index").value;
  const endIndex = document.getElementById("end-index").value;
  const rangeSum = segmentTree.queryRangeSum(
    0,
    0,
    studentData.length - 1,
    startIndex,
    endIndex
  );
  document.getElementById(
    "range-sum-result"
  ).textContent = `The sum of grades from index ${startIndex} to ${endIndex} is: ${rangeSum}`;
}
