import json
from typing import List, Dict, Any
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

class OpportunityMatcher:
    """
    Recommendation Engine Orchestrator.
    Combines rule-based multi-criteria weighting with NLP TF-IDF cosine similarity.
    Designed modularly to allow future LLM API integration.
    """

    @staticmethod
    def match_student_with_opportunity(
        student_profile: Dict[str, Any],
        opportunity: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluate single student profile against a single opportunity.
        """
        student_skills = student_profile.get("skills", [])
        student_interests = student_profile.get("interests", [])
        student_branch = student_profile.get("branch", "Other")
        student_year = student_profile.get("year", 3)
        student_exp = student_profile.get("experience_level", "Intermediate")
        student_prefs = student_profile.get("career_preferences", [])
        projects = student_profile.get("projects", [])

        # Parse opportunity fields if stored as JSON strings
        req_skills = opportunity.get("required_skills", [])
        if isinstance(req_skills, str):
            try:
                req_skills = json.loads(req_skills)
            except Exception:
                req_skills = [s.strip() for s in req_skills.split(",") if s.strip()]

        pref_skills = opportunity.get("preferred_skills", [])
        if isinstance(pref_skills, str):
            try:
                pref_skills = json.loads(pref_skills)
            except Exception:
                pref_skills = [s.strip() for s in pref_skills.split(",") if s.strip()]

        eligible_branches = opportunity.get("eligible_branches", ["All"])
        if isinstance(eligible_branches, str):
            try:
                eligible_branches = json.loads(eligible_branches)
            except Exception:
                eligible_branches = [b.strip() for b in eligible_branches.split(",") if b.strip()]

        min_year = opportunity.get("minimum_year", 1)
        max_year = opportunity.get("maximum_year", 4)
        opp_exp = opportunity.get("experience_required", "Beginner")
        opp_type = opportunity.get("type", "Internship")
        opp_title = opportunity.get("title", "")
        opp_desc = opportunity.get("description", "")

        # 1. Skill Match (40%)
        skill_score, matched_skills, missing_skills = calculate_skill_match(
            student_skills, req_skills, pref_skills
        )

        # 2. Interest Match (25%)
        interest_score, matched_interests = calculate_interest_match(
            student_interests, student_prefs, opp_type, opp_title, opp_desc
        )

        # 3. Branch Match (15%)
        branch_score, is_branch_eligible = calculate_branch_match(
            student_branch, eligible_branches
        )

        # 4. Experience Match (10%)
        experience_score = calculate_experience_match(student_exp, opp_exp)

        # 5. Eligibility Match (10%)
        eligibility_score = calculate_eligibility_match(student_year, min_year, max_year)

        # 6. NLP TF-IDF Cosine Similarity
        # Build student text
        project_texts = []
        project_techs = []
        for p in projects:
            p_title = p.get("title", "") if isinstance(p, dict) else getattr(p, "title", "")
            p_desc = p.get("description", "") if isinstance(p, dict) else getattr(p, "description", "")
            p_tech = p.get("technologies", "") if isinstance(p, dict) else getattr(p, "technologies", "")
            project_texts.append(f"{p_title} {p_desc} {p_tech}")
            if p_tech:
                project_techs.extend([t.strip() for t in p_tech.split(",") if t.strip()])

        student_doc = f"{' '.join(student_skills)} {' '.join(student_interests)} {student_exp} {' '.join(project_texts)} {student_branch}"
        opp_doc = f"{opp_title} {opp_desc} {' '.join(req_skills)} {' '.join(pref_skills)} {opp_type} {' '.join(eligible_branches)}"

        nlp_similarity = compute_nlp_similarity(student_doc, opp_doc)

        # 7. Final Weighted Calculation
        score_breakdown = calculate_weighted_score(
            skill_score=skill_score,
            interest_score=interest_score,
            branch_score=branch_score,
            experience_score=experience_score,
            eligibility_score=eligibility_score,
            nlp_similarity=nlp_similarity
        )

        # 8. Project Matches with Opportunity
        project_matches = []
        opp_all_skills_lower = {s.lower() for s in req_skills + pref_skills}
        for tech in project_techs:
            if tech.lower() in opp_all_skills_lower:
                project_matches.append(tech)

        # 9. Explanation
        reasons = generate_ai_explanation(
            opportunity_title=opp_title,
            opportunity_type=opp_type,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_interests=matched_interests,
            student_branch=student_branch,
            is_branch_eligible=is_branch_eligible,
            student_year=student_year,
            min_year=min_year,
            max_year=max_year,
            student_experience=student_exp,
            project_matches=list(set(project_matches))
        )

        return {
            "opportunity_id": opportunity.get("id"),
            "opportunity": opportunity,
            "match_score": score_breakdown["final_score"],
            "score_breakdown": score_breakdown,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "explanation": reasons
        }

    @classmethod
    def match_all(
        cls,
        student_profile: Dict[str, Any],
        opportunities: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Rank all opportunities for a student profile from highest to lowest match score.
        """
        results = []
        for opp in opportunities:
            res = cls.match_student_with_opportunity(student_profile, opp)
            results.append(res)

        # Sort highest match score first
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

    @classmethod
    def analyze_skill_gap(
        cls,
        student_skills: List[str],
        recommendations: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Perform Skill Gap Analysis (Section 17):
        - Skills You Have
        - In-Demand Skills To Improve
        - Recommended learning paths & impact
        """
        student_skills_clean = [s.strip() for s in student_skills if s.strip()]
        missing_skill_counts: Dict[str, int] = {}
        missing_skill_opps: Dict[str, List[str]] = {}

        # Scan top 15 recommendations
        top_recs = recommendations[:15]
        for rec in top_recs:
            opp_title = rec.get("opportunity", {}).get("title", "Opportunity")
            for skill in rec.get("missing_skills", []):
                clean_skill = skill.strip()
                if not clean_skill:
                    continue
                missing_skill_counts[clean_skill] = missing_skill_counts.get(clean_skill, 0) + 1
                if clean_skill not in missing_skill_opps:
                    missing_skill_opps[clean_skill] = []
                missing_skill_opps[clean_skill].append(opp_title)

        # Sort skills to improve by market demand
        sorted_gaps = sorted(missing_skill_counts.items(), key=lambda x: x[1], reverse=True)

        skills_to_improve = []
        for skill, count in sorted_gaps:
            skills_to_improve.append({
                "skill": skill,
                "demand_count": count,
                "impact_statement": f"Learning {skill} may increase your eligibility for {count} recommended opportunity{'ies' if count > 1 else ''}.",
                "related_opportunities": missing_skill_opps[skill][:3]
            })

        return {
            "skills_have": student_skills_clean,
            "skills_to_improve": skills_to_improve,
            "total_gap_count": len(skills_to_improve),
            "top_recommendation": skills_to_improve[0]["impact_statement"] if skills_to_improve else "Your skill profile is exceptionally well-aligned with current opportunities!"
        }
