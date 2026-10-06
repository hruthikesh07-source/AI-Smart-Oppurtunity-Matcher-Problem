from typing import List, Dict, Any, Tuple

# Related branches map for partial credit
RELATED_BRANCHES: Dict[str, List[str]] = {
    "CSE": ["IT", "AIML", "Data Science", "Software Engineering"],
    "IT": ["CSE", "AIML", "Data Science"],
    "AIML": ["CSE", "IT", "Data Science"],
    "Data Science": ["CSE", "IT", "AIML"],
    "ECE": ["EEE", "CSE", "IT"],
    "EEE": ["ECE"],
    "Mechanical": ["Civil", "Automobile", "Production"],
    "Civil": ["Mechanical"]
}

def calculate_skill_match(student_skills: List[str], required_skills: List[str], preferred_skills: List[str]) -> Tuple[float, List[str], List[str]]:
    """
    Calculate skill match percentage (0 - 100), along with matched and missing skills.
    Required skills carry 85% of the skill weight, preferred skills carry 15% bonus.
    """
    student_set = {s.strip().lower() for s in student_skills if s.strip()}
    req_set = {s.strip().lower() for s in required_skills if s.strip()}
    pref_set = {s.strip().lower() for s in preferred_skills if s.strip()}

    matched_skills = []
    missing_skills = []

    # Map back to original casing
    all_opp_skills_map = {}
    for s in required_skills + preferred_skills:
        clean = s.strip()
        if clean:
            all_opp_skills_map[clean.lower()] = clean

    for lower_skill, orig_skill in all_opp_skills_map.items():
        if lower_skill in student_set:
            matched_skills.append(orig_skill)
        else:
            missing_skills.append(orig_skill)

    # If no skills are required or preferred, default to 100%
    if not req_set and not pref_set:
        return 100.0, matched_skills, missing_skills

    req_score = 100.0
    if req_set:
        req_matched = len(req_set.intersection(student_set))
        req_score = (req_matched / len(req_set)) * 100.0

    pref_score = 100.0
    if pref_set:
        pref_matched = len(pref_set.intersection(student_set))
        pref_score = (pref_matched / len(pref_set)) * 100.0

    if req_set and pref_set:
        total_skill_score = (0.85 * req_score) + (0.15 * pref_score)
    elif req_set:
        total_skill_score = req_score
    else:
        total_skill_score = pref_score

    return round(total_skill_score, 1), matched_skills, missing_skills


def calculate_interest_match(student_interests: List[str], student_prefs: List[str], opportunity_type: str, opp_title: str, opp_desc: str) -> Tuple[float, List[str]]:
    """
    Calculate interest match percentage (0 - 100) and matched interest tags.
    """
    if not student_interests and not student_prefs:
        return 80.0, []

    combined_text = f"{opp_title} {opportunity_type} {opp_desc}".lower()
    matched_interests = []

    # Check opportunity type preference match
    type_matched = False
    if student_prefs:
        for pref in student_prefs:
            if pref.lower() in opportunity_type.lower() or opportunity_type.lower() in pref.lower():
                type_matched = True
                break

    # Check interest tags match
    interest_count = 0
    for interest in student_interests:
        clean_interest = interest.strip().lower()
        if clean_interest and (clean_interest in combined_text or any(token in combined_text for token in clean_interest.split())):
            interest_count += 1
            matched_interests.append(interest)

    if student_interests:
        interest_ratio = min(1.0, interest_count / max(1, len(student_interests) * 0.4))
    else:
        interest_ratio = 0.7

    score = interest_ratio * 70.0 + (30.0 if type_matched else 15.0)
    return min(100.0, max(50.0, round(score, 1))), matched_interests


def calculate_branch_match(student_branch: str, eligible_branches: List[str]) -> Tuple[float, bool]:
    """
    Calculate branch match percentage (0 - 100).
    Direct match or "All" -> 100%
    Related branch -> 60%
    Otherwise -> 20%
    """
    if not eligible_branches or "all" in [b.lower() for b in eligible_branches]:
        return 100.0, True

    student_branch_clean = student_branch.strip().upper()
    eligible_upper = [b.strip().upper() for b in eligible_branches]

    if student_branch_clean in eligible_upper:
        return 100.0, True

    # Check related branches
    related = RELATED_BRANCHES.get(student_branch_clean, [])
    for rel in related:
        if rel.upper() in eligible_upper:
            return 60.0, False

    return 20.0, False


def calculate_experience_match(student_experience: str, opp_experience_required: str) -> float:
    """
    Calculate experience match percentage (0 - 100).
    Levels: Beginner (1), Intermediate (2), Advanced (3).
    """
    levels = {"none": 1, "beginner": 1, "intermediate": 2, "advanced": 3}
    student_lvl = levels.get(student_experience.strip().lower(), 2)
    opp_lvl = levels.get(opp_experience_required.strip().lower(), 1)

    if student_lvl >= opp_lvl:
        return 100.0
    elif opp_lvl - student_lvl == 1:
        return 70.0
    else:
        return 40.0


def calculate_eligibility_match(student_year: int, min_year: int, max_year: int) -> float:
    """
    Calculate year eligibility match percentage (0 - 100).
    """
    if min_year <= student_year <= max_year:
        return 100.0
    diff = min(abs(student_year - min_year), abs(student_year - max_year))
    if diff == 1:
        return 50.0
    return 20.0


def calculate_weighted_score(
    skill_score: float,
    interest_score: float,
    branch_score: float,
    experience_score: float,
    eligibility_score: float,
    nlp_similarity: float
) -> Dict[str, float]:
    """
    Combines weighted rule-based score (Section 10 weights):
    - Skill Match: 40%
    - Interest Match: 25%
    - Branch Match: 15%
    - Experience Match: 10%
    - Eligibility Match: 10%
    
    Blends with NLP Cosine Similarity (Section 11):
    Final Score = (0.85 * Weighted Rule Score) + (0.15 * NLP Similarity * 100)
    """
    rule_score = (
        0.40 * skill_score +
        0.25 * interest_score +
        0.15 * branch_score +
        0.10 * experience_score +
        0.10 * eligibility_score
    )

    # Hybrid blending with NLP
    nlp_scaled = nlp_similarity * 100.0
    final_score = round(0.85 * rule_score + 0.15 * nlp_scaled, 1)
    final_score = max(0.0, min(100.0, final_score))

    return {
        "final_score": final_score,
        "rule_score": round(rule_score, 1),
        "skill_score": round(skill_score, 1),
        "interest_score": round(interest_score, 1),
        "branch_score": round(branch_score, 1),
        "experience_score": round(experience_score, 1),
        "eligibility_score": round(eligibility_score, 1),
        "nlp_score": round(nlp_scaled, 1)
    }
