"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const shared_types_1 = require("@wasl/shared-types");
const index_js_1 = require("../src/index.js");
(0, node_test_1.describe)('Deterministic Compatibility Engine', () => {
    const candidateA = {
        id: '11111111-1111-1111-1111-111111111111',
        gender: shared_types_1.GenderType.MALE,
        dateOfBirth: '1996-05-15', // ~30 years old
        heightCm: 178,
        maritalStatus: shared_types_1.MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Lahore',
        currentCountry: 'Pakistan',
        educationLevel: "Master's",
        occupationTitle: 'Software Engineer',
        monthlyIncomeBracket: shared_types_1.FinancialBracketType.TIER_3,
        religiousPractice: shared_types_1.ReligiousPracticeLevel.MODERATE,
        sect: shared_types_1.SectType.SUNNI_HANAFI,
        familyStructureCurrent: shared_types_1.FamilyStructureType.JOINT,
        familyStructurePreference: shared_types_1.FamilyStructureType.JOINT,
        relocationFlexibility: shared_types_1.RelocationFlexibilityType.GLOBAL_FLEXIBLE,
        careerPreference: 'Supports spouse working',
        hobbies: ['Reading', 'Hiking', 'Tech']
    };
    const candidateB = {
        id: '22222222-2222-2222-2222-222222222222',
        gender: shared_types_1.GenderType.FEMALE,
        dateOfBirth: '1998-08-20', // ~28 years old
        heightCm: 165,
        maritalStatus: shared_types_1.MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Islamabad',
        currentCountry: 'Pakistan',
        educationLevel: "Master's",
        occupationTitle: 'Data Analyst',
        monthlyIncomeBracket: shared_types_1.FinancialBracketType.TIER_3,
        religiousPractice: shared_types_1.ReligiousPracticeLevel.MODERATE,
        sect: shared_types_1.SectType.SUNNI_HANAFI,
        familyStructureCurrent: shared_types_1.FamilyStructureType.JOINT,
        familyStructurePreference: shared_types_1.FamilyStructureType.JOINT,
        relocationFlexibility: shared_types_1.RelocationFlexibilityType.ANYWHERE_IN_PAKISTAN,
        careerPreference: 'Wants to continue career',
        hobbies: ['Reading', 'Travel', 'Photography']
    };
    (0, node_test_1.it)('calculates deterministic compatibility matching expected dimensions', () => {
        const result = (0, index_js_1.calculateDeterministicCompatibility)(candidateA, candidateB);
        node_assert_1.default.ok(result.overallScore >= 80 && result.overallScore <= 100, `Expected score in 80-100, got ${result.overallScore}`);
        node_assert_1.default.strictEqual(result.dimensionScores.family, 20, 'Family score should be 20 for joint-joint match');
        node_assert_1.default.strictEqual(result.dimensionScores.career, 20, 'Career score should be 20 for supportive-wants to work match');
        node_assert_1.default.strictEqual(result.dimensionScores.education, 15, "Education score should be 15 for Master's-Master's match");
        node_assert_1.default.strictEqual(result.dimensionScores.religion, 15, 'Religion score should be 15 for Moderate-Moderate match');
        node_assert_1.default.ok(result.alignments.length >= 3, 'Should generate key alignment points');
        node_assert_1.default.ok(result.discussionPoints.length >= 1, 'Should generate discussion points for different cities');
    });
    (0, node_test_1.it)('correctly passes hard filters when criteria are satisfied', () => {
        const criteria = {
            minAge: 24,
            maxAge: 32,
            minHeightCm: 160,
            maxHeightCm: 180,
            allowedMaritalStatuses: [shared_types_1.MaritalStatusType.NEVER_MARRIED],
            allowedSects: [shared_types_1.SectType.SUNNI_HANAFI],
            allowedReligiousLevels: [shared_types_1.ReligiousPracticeLevel.MODERATE, shared_types_1.ReligiousPracticeLevel.PRACTICING],
            dealBreakers: []
        };
        const filterResult = (0, index_js_1.passesHardFilters)(candidateB, criteria);
        node_assert_1.default.strictEqual(filterResult.passed, true);
        node_assert_1.default.strictEqual(filterResult.failureReasons.length, 0);
    });
    (0, node_test_1.it)('correctly rejects candidates violating hard filters', () => {
        const strictCriteria = {
            minAge: 32, // Candidate B is ~28
            maxAge: 40,
            minHeightCm: 170, // Candidate B is 165cm
            maxHeightCm: 190,
            allowedMaritalStatuses: [shared_types_1.MaritalStatusType.DIVORCED], // Candidate B is NEVER_MARRIED
            dealBreakers: []
        };
        const filterResult = (0, index_js_1.passesHardFilters)(candidateB, strictCriteria);
        node_assert_1.default.strictEqual(filterResult.passed, false);
        node_assert_1.default.ok(filterResult.failureReasons.length >= 3, 'Should identify multiple filter violations');
    });
});
//# sourceMappingURL=scoring.test.js.map