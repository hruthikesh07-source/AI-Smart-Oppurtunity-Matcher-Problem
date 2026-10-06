from typing import List, Dict, Any

def generate_ai_explanation(
    opportunity_title: str,
    opportunity_type: str,
    matched_skills: List[str],
    missing_skills: List[str],
    matched_interests: List[str],
    student_branch: str,
    is_branch_eligible: bool,
    student_year: int,
    min_year: int,
    max_year: int,
    student_experience: str,
    project_matches: List[str]
) -> List[str]:
    """
    Generate transparent, data-driven explanation bullet points based on actual profile data.
    """
    reasons = []

    # 1. Skill Reason
    if matched_skills:
        skill_sample = ", ".join(matched_skills[:3])
        if len(matched_skills) > 3:
            skill_sample += f" (+{len(matched_skills) - 3} more)"
        reasons.append(f"You have key skills required: {skill_sample}.")
    elif missing_skills:
        reasons.append(f"Opportunity requires skills like {', '.join(missing_skills[:2])}, great for learning growth.")

    # 2. Interest Reason
    if matched_interests:
        reasons.append(f"Aligns with your interest in {', '.join(matched_interests[:2])}.")
    else:
        reasons.append(f"Matches your target opportunity category: {opportunity_type}.")

    # 3. Branch Reason
    if is_branch_eligible:
        reasons.append(f"Your branch ({student_branch}) is eligible.")
    else:
        reasons.append(f"Open to multidisciplinary applicants with your background.")

    # 4. Year/Eligibility Reason
    if min_year <= student_year <= max_year:
        reasons.append(f"Your current academic standing (Year {student_year}) meets the requirements.")

    # 5. Project Relevancy Reason
    if project_matches:
        reasons.append(f"Your project portfolio contains relevant tech: {', '.join(project_matches[:2])}.")
    elif student_experience:
        reasons.append(f"Your {student_experience.lower()} experience level matches role expectations.")

    return reasons
