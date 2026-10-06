import pytest
from app.ai.similarity import compute_nlp_similarity
from app.ai.scoring import (
    calculate_skill_match,
    calculate_interest_match,
    calculate_branch_match,
    calculate_experience_match,
    calculate_eligibility_match,
    calculate_weighted_score
)
from app.ai.explanation import generate_ai_explanation
from app.ai.matcher import OpportunityMatcher

def test_skill_match_perfect():
    student_skills = ["Python", "SQL", "React"]
    req_skills = ["Python", "SQL"]
    pref_skills = ["React"]

    score, matched, missing = calculate_skill_match(student_skills, req_skills, pref_skills)
    assert score == 100.0
    assert len(matched) == 3
    assert len(missing) == 0

def test_skill_match_partial():
    student_skills = ["Python"]
    req_skills = ["Python", "SQL"]
    pref_skills = ["React"]

    score, matched, missing = calculate_skill_match(student_skills, req_skills, pref_skills)
    assert 0 < score < 100.0
    assert "Python" in matched
    assert "SQL" in missing
    assert "React" in missing

def test_branch_match():
    # Direct match
    score1, eligible1 = calculate_branch_match("CSE", ["CSE", "IT"])
    assert score1 == 100.0
    assert eligible1 is True

    # "All" branches
    score2, eligible2 = calculate_branch_match("Mechanical", ["All"])
    assert score2 == 100.0
    assert eligible2 is True

    # Related branch
    score3, eligible3 = calculate_branch_match("CSE", ["IT"])
    assert score3 == 60.0

def test_experience_and_eligibility():
    exp_score = calculate_experience_match("Intermediate", "Beginner")
    assert exp_score == 100.0

    elig_score = calculate_eligibility_match(student_year=3, min_year=2, max_year=4)
    assert elig_score == 100.0

    elig_off = calculate_eligibility_match(student_year=1, min_year=2, max_year=4)
    assert elig_off == 50.0

def test_nlp_similarity():
    student_text = "Python machine learning scikit-learn neural networks data science"
    opp_text = "AI Hackathon: Build machine learning models with Python and data analysis"
    sim = compute_nlp_similarity(student_text, opp_text)
    assert 0.0 < sim <= 1.0

def test_weighted_scoring_range():
    res = calculate_weighted_score(
        skill_score=90.0,
        interest_score=85.0,
        branch_score=100.0,
        experience_score=100.0,
        eligibility_score=100.0,
        nlp_similarity=0.75
    )
    assert 0.0 <= res["final_score"] <= 100.0
    assert res["final_score"] > 80.0

def test_opportunity_matcher_full():
    student = {
        "skills": ["Python", "Machine Learning", "SQL", "React", "TensorFlow"],
        "interests": ["Artificial Intelligence", "Data Science"],
        "branch": "CSE",
        "year": 3,
        "experience_level": "Intermediate",
        "career_preferences": ["Hackathon", "Internship"],
        "projects": [
            {"title": "AI Assistant", "description": "Cutting edge machine learning NLP project in Python and TensorFlow", "technologies": "Python, Machine Learning, TensorFlow"}
        ]
    }

    opp = {
        "id": 1,
        "title": "AI Innovation Hackathon",
        "organization": "TechCorp",
        "type": "Hackathon",
        "description": "Develop cutting-edge Artificial Intelligence and Machine learning algorithms with Python and deep neural networks.",
        "required_skills": ["Python", "Machine Learning"],
        "preferred_skills": ["TensorFlow"],
        "eligible_branches": ["CSE", "IT"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Online",
        "mode": "Online"
    }

    result = OpportunityMatcher.match_student_with_opportunity(student, opp)
    assert result["match_score"] >= 80.0
    assert "Python" in result["matched_skills"]
    assert "TensorFlow" in result["matched_skills"]
    assert len(result["explanation"]) >= 3

def test_skill_gap_analysis():
    student_skills = ["Python", "SQL"]
    mock_recs = [
        {
            "opportunity": {"title": "AI Hackathon"},
            "missing_skills": ["TensorFlow", "Deep Learning"]
        },
        {
            "opportunity": {"title": "Data Science Cup"},
            "missing_skills": ["TensorFlow", "Pandas"]
        }
    ]

    gap = OpportunityMatcher.analyze_skill_gap(student_skills, mock_recs)
    assert gap["skills_have"] == ["Python", "SQL"]
    assert len(gap["skills_to_improve"]) > 0
    # TensorFlow should be top demand (appears in 2 opportunities)
    assert gap["skills_to_improve"][0]["skill"] == "TensorFlow"
    assert gap["skills_to_improve"][0]["demand_count"] == 2
