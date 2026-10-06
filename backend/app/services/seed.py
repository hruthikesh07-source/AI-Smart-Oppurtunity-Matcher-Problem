import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import StudentProfile, Skill, Project, student_skills
from app.models.opportunity import Opportunity
from app.models.application import SavedOpportunity, Application
from app.services.auth import get_password_hash
from app.ai.matcher import OpportunityMatcher

DEFAULT_SKILLS = [
    "Python", "Java", "C", "C++", "JavaScript", "React", "HTML", "CSS",
    "SQL", "Machine Learning", "Data Science", "Cloud Computing",
    "Cybersecurity", "Git", "Django", "FastAPI", "Docker", "Kubernetes",
    "TensorFlow", "Deep Learning", "PyTorch", "Flutter", "Node.js",
    "AWS", "Data Analytics", "UI/UX Design", "IoT", "Blockchain"
]

SAMPLE_OPPORTUNITIES = [
    {
        "title": "AI Innovation Hackathon 2026",
        "organization": "National AI Research Center & TechCorp",
        "type": "Hackathon",
        "description": "Build next-generation generative AI and computer vision solutions tackling sustainable development goals. Mentorship provided by industry AI leads.",
        "required_skills": ["Python", "Machine Learning"],
        "preferred_skills": ["TensorFlow", "Deep Learning", "React"],
        "eligible_branches": ["CSE", "IT", "AIML", "Data Science", "ECE"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Bengaluru (Hybrid)",
        "mode": "Hybrid",
        "deadline": (datetime.utcnow() + timedelta(days=25)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/ai-hackathon",
        "is_demo": True
    },
    {
        "title": "Python Developer Internship",
        "organization": "Cognitive Cloud Solutions",
        "type": "Internship",
        "description": "Join our backend platform engineering squad developing scalable microservices, RESTful APIs, and database caching architectures with Python and Django.",
        "required_skills": ["Python", "SQL", "Git"],
        "preferred_skills": ["Django", "FastAPI", "Docker"],
        "eligible_branches": ["CSE", "IT", "AIML", "ECE", "EEE"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Hyderabad (Remote)",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=14)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/python-internship",
        "is_demo": True
    },
    {
        "title": "Full-Stack Web Development Internship",
        "organization": "Nexus Labs Technologies",
        "type": "Internship",
        "description": "Develop dynamic, mobile-responsive web interfaces with React, TypeScript, and modern state architectures. Collaborate directly with senior engineers.",
        "required_skills": ["React", "JavaScript", "HTML", "CSS"],
        "preferred_skills": ["Node.js", "Git", "SQL"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Pune",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=18)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/web-dev-intern",
        "is_demo": True
    },
    {
        "title": "Hands-On Machine Learning Workshop",
        "organization": "IEEE Computer Society Student Branch",
        "type": "Workshop",
        "description": "Comprehensive 3-day deep dive covering data preprocessing, model selection, hyperparameter tuning, neural networks, and model deployment pipelines.",
        "required_skills": ["Python"],
        "preferred_skills": ["Machine Learning", "Data Science"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Online via Zoom",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/ml-workshop",
        "is_demo": True
    },
    {
        "title": "National Data Science Competition",
        "organization": "Analytics India Consortium",
        "type": "Competition",
        "description": "Predictive analytics championship analyzing multimodal healthcare and economic trends. Cash prizes worth 200,000 INR and direct interview fast-tracks.",
        "required_skills": ["Python", "Data Science", "SQL"],
        "preferred_skills": ["Machine Learning", "Data Analytics"],
        "eligible_branches": ["CSE", "IT", "AIML", "Data Science", "ECE", "EEE"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "National Online Platform",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/data-science-cup",
        "is_demo": True
    },
    {
        "title": "Cybersecurity DefCon Hackathon",
        "organization": "CyberShield Defense Institute",
        "type": "Hackathon",
        "description": "Capture the Flag (CTF) and secure coding challenges covering web vulnerabilities (OWASP Top 10), reverse engineering, network security, and cryptography.",
        "required_skills": ["Cybersecurity", "Python"],
        "preferred_skills": ["C", "C++", "Git"],
        "eligible_branches": ["CSE", "IT", "ECE"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Delhi NCR (In-Person)",
        "mode": "Offline",
        "deadline": (datetime.utcnow() + timedelta(days=21)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/cyber-hackathon",
        "is_demo": True
    },
    {
        "title": "Cloud Computing & AWS Architecture Workshop",
        "organization": "Cloud Builders Guild",
        "type": "Workshop",
        "description": "Master AWS foundational services including EC2, S3, Lambda, VPC, RDS, and automated CI/CD pipeline deployments with infrastructure-as-code.",
        "required_skills": ["Cloud Computing"],
        "preferred_skills": ["AWS", "Docker", "Git"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Virtual Auditorium",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=12)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/cloud-workshop",
        "is_demo": True
    },
    {
        "title": "Enterprise Java Developer Internship",
        "organization": "Global FinTech Systems",
        "type": "Internship",
        "description": "Design transaction processing microservices using Java Spring Boot, Hibernate, Apache Kafka, and relational SQL clustering.",
        "required_skills": ["Java", "SQL"],
        "preferred_skills": ["Git", "Docker"],
        "eligible_branches": ["CSE", "IT", "ECE"],
        "minimum_year": 3,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Mumbai",
        "mode": "Hybrid",
        "deadline": (datetime.utcnow() + timedelta(days=15)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/java-internship",
        "is_demo": True
    },
    {
        "title": "DesignSprint UI/UX Design Challenge",
        "organization": "Product Crafters Global",
        "type": "Competition",
        "description": "Design wireframes, high-fidelity prototypes, and user experience flows for an accessibility-first educational platform.",
        "required_skills": ["UI/UX Design", "HTML", "CSS"],
        "preferred_skills": ["React"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Online",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=28)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/uiux-challenge",
        "is_demo": True
    },
    {
        "title": "Smart IoT & Embedded Innovation Challenge",
        "organization": "Hardware Hub & IoT Alliance",
        "type": "Competition",
        "description": "Build IoT hardware prototypes integrating sensors, microcontrollers (ESP32/Raspberry Pi), cloud telemetry, and edge analytics.",
        "required_skills": ["IoT", "C", "C++"],
        "preferred_skills": ["Python", "Cloud Computing"],
        "eligible_branches": ["ECE", "EEE", "CSE", "IT", "Mechanical"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Chennai Innovation Campus",
        "mode": "Offline",
        "deadline": (datetime.utcnow() + timedelta(days=35)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/iot-challenge",
        "is_demo": True
    },
    {
        "title": "Mastering SQL & Database Performance Workshop",
        "organization": "Data Engineering Academy",
        "type": "Workshop",
        "description": "Advanced query optimization, indexing strategies, normalization vs denormalization, execution plans, and transaction locking mechanisms.",
        "required_skills": ["SQL"],
        "preferred_skills": ["Python"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Live Interactive Stream",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=10)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/sql-workshop",
        "is_demo": True
    },
    {
        "title": "Global Open Source Coding Championship",
        "organization": "Open Dev Foundation",
        "type": "Competition",
        "description": "Contribute bug fixes, feature modules, and architectural enhancements to renowned global open source repositories.",
        "required_skills": ["Git"],
        "preferred_skills": ["Python", "JavaScript", "React", "C++"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Global / GitHub",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=40)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/opensource-comp",
        "is_demo": True
    },
    {
        "title": "Cross-Platform Mobile App Hackathon",
        "organization": "AppMasters International",
        "type": "Hackathon",
        "description": "Develop engaging, cross-platform Android & iOS apps solving civic utility or educational challenges in 36 hours.",
        "required_skills": ["JavaScript"],
        "preferred_skills": ["React", "Flutter"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Intermediate",
        "location": "Hyderabad Tech City",
        "mode": "Hybrid",
        "deadline": (datetime.utcnow() + timedelta(days=19)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/mobile-hackathon",
        "is_demo": True
    },
    {
        "title": "Data Analytics & Business Intelligence Internship",
        "organization": "Starlight Analytics Group",
        "type": "Internship",
        "description": "Derive actionable executive insights, clean exploratory datasets, and construct automated real-time KPI dashboards.",
        "required_skills": ["Data Analytics", "SQL"],
        "preferred_skills": ["Python", "Data Science"],
        "eligible_branches": ["CSE", "IT", "AIML", "Data Science", "ECE", "Other"],
        "minimum_year": 2,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Bengaluru",
        "mode": "Hybrid",
        "deadline": (datetime.utcnow() + timedelta(days=16)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/data-analytics-intern",
        "is_demo": True
    },
    {
        "title": "Professional Git & GitHub Collaborative Workflow",
        "organization": "Software Craftsmen Alliance",
        "type": "Certification",
        "description": "Earn a verified certification validating mastery over git branching models, pull request reviews, rebase workflows, and GitHub Actions CI pipelines.",
        "required_skills": ["Git"],
        "preferred_skills": ["HTML", "JavaScript"],
        "eligible_branches": ["All"],
        "minimum_year": 1,
        "maximum_year": 4,
        "experience_required": "Beginner",
        "location": "Self-Paced Online",
        "mode": "Online",
        "deadline": (datetime.utcnow() + timedelta(days=60)).strftime("%Y-%m-%d"),
        "apply_url": "https://example.com/apply/git-certification",
        "is_demo": True
    }
]

def seed_database(db: Session):
    """Seed default skills, sample opportunities, demo student, and demo admin."""
    # 1. Seed Skills
    skill_objects = {}
    for s_name in DEFAULT_SKILLS:
        existing = db.query(Skill).filter(Skill.name == s_name).first()
        if not existing:
            skill = Skill(name=s_name)
            db.add(skill)
            db.flush()
            skill_objects[s_name] = skill
        else:
            skill_objects[s_name] = existing

    # 2. Seed Demo Admin User
    admin_user = db.query(User).filter(User.email == "admin@demo.com").first()
    if not admin_user:
        admin_user = User(
            name="Admin Officer",
            email="admin@demo.com",
            password_hash=get_password_hash("Admin@123"),
            role="admin"
        )
        db.add(admin_user)
        db.flush()

    # 3. Seed Demo Student User & Profile
    student_user = db.query(User).filter(User.email == "student@demo.com").first()
    if not student_user:
        student_user = User(
            name="Rahul Sharma",
            email="student@demo.com",
            password_hash=get_password_hash("Student@123"),
            role="student"
        )
        db.add(student_user)
        db.flush()

        # Create Profile
        student_profile = StudentProfile(
            user_id=student_user.id,
            college="National Institute of Technology",
            branch="CSE",
            year=3,
            experience_level="Intermediate",
            work_experience="Completed 2-month summer internship working with Python scripting and database maintenance.",
            interests=json.dumps(["Artificial Intelligence", "Web Development", "Data Science"]),
            career_preferences=json.dumps(["Internship", "Hackathon", "Competition"])
        )
        db.add(student_profile)
        db.flush()

        # Add Skills to Student
        student_skill_names = ["Python", "SQL", "React", "Machine Learning", "Git", "JavaScript", "Django"]
        for s_name in student_skill_names:
            if s_name in skill_objects:
                student_profile.skills.append(skill_objects[s_name])

        # Add Projects to Student
        p1 = Project(
            student_id=student_profile.id,
            title="AI Smart Health Diagnostic Assistant",
            description="Machine learning classifier built using Python, Scikit-learn, and React dashboard to predict disease likelihood from medical markers.",
            technologies="Python, Scikit-learn, React, SQL"
        )
        p2 = Project(
            student_id=student_profile.id,
            title="Campus Event Management Portal",
            description="Responsive web application with student registration, schedule tracking, and automated email reminders.",
            technologies="JavaScript, React, Django, Git"
        )
        db.add_all([p1, p2])
        db.flush()

    # 4. Seed Opportunities
    opp_count = db.query(Opportunity).count()
    if opp_count == 0:
        for opp_data in SAMPLE_OPPORTUNITIES:
            opp = Opportunity(
                title=opp_data["title"],
                organization=opp_data["organization"],
                type=opp_data["type"],
                description=opp_data["description"],
                required_skills=json.dumps(opp_data["required_skills"]),
                preferred_skills=json.dumps(opp_data["preferred_skills"]),
                eligible_branches=json.dumps(opp_data["eligible_branches"]),
                minimum_year=opp_data["minimum_year"],
                maximum_year=opp_data["maximum_year"],
                experience_required=opp_data["experience_required"],
                location=opp_data["location"],
                mode=opp_data["mode"],
                deadline=opp_data["deadline"],
                apply_url=opp_data["apply_url"],
                is_demo=opp_data["is_demo"]
            )
            db.add(opp)
        db.flush()

    # 5. Seed some sample bookmark & application for demo student
    demo_prof = db.query(StudentProfile).join(User).filter(User.email == "student@demo.com").first()
    if demo_prof:
        first_opp = db.query(Opportunity).first()
        second_opp = db.query(Opportunity).offset(1).first()

        if first_opp and not db.query(SavedOpportunity).filter(SavedOpportunity.student_id == demo_prof.id).first():
            db.add(SavedOpportunity(student_id=demo_prof.id, opportunity_id=first_opp.id))

        if second_opp and not db.query(Application).filter(Application.student_id == demo_prof.id).first():
            db.add(Application(
                student_id=demo_prof.id,
                opportunity_id=second_opp.id,
                status="Applied",
                notes="Submitted resume and GitHub profile portfolio on official portal."
            ))

    db.commit()
