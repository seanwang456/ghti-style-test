const assert = require("node:assert/strict");

const { computeResult, getFirstMissingQuestion, QUESTIONS, TYPES } = require("../scoring.js");

function answersWith(letter) {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, letter]));
}

const allA = computeResult(answersWith("A"));
assert.equal(allA.typeCode, "SADP");
assert.deepEqual(allA.axis.map((item) => item.positivePercent), [100, 100, 100, 100]);
assert.equal(allA.needTag, "稳定");
assert.equal(allA.decisionTag, "架构型");
assert.equal(allA.type.name, TYPES.SADP.name);

const allD = computeResult(answersWith("D"));
assert.equal(allD.typeCode, "FRCI");
assert.deepEqual(allD.axis.map((item) => item.positivePercent), [25, 0, 0, 0]);
assert.equal(allD.needTag, "自主");
assert.equal(allD.decisionTag, "状态型");

const mostlyC = computeResult(answersWith("C"));
assert.equal(mostlyC.typeCode, "SRDP");
assert.equal(mostlyC.needTag, "平衡");
assert.equal(mostlyC.decisionTag, "平衡型");

for (const [typeCode, type] of Object.entries(TYPES)) {
  assert.match(type.image, new RegExp(`${typeCode}_.+\\.png$`));
}

const partialAnswers = { 1: "A", 2: "B", 4: "D" };
assert.equal(getFirstMissingQuestion(partialAnswers, 1, 5), 3);
assert.equal(getFirstMissingQuestion(answersWith("A"), 1, 60), null);

console.log("scoring tests passed");
