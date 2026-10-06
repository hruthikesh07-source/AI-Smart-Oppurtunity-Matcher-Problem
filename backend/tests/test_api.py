import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_student_login():
    response = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_demo_admin_login():
    response = client.post("/api/auth/login", json={
        "email": "admin@demo.com",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_get_opportunities_public():
    response = client.get("/api/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 15
    # First item has required fields
    first = data[0]
    assert "title" in first
    assert "organization" in first
    assert "type" in first

def test_student_recommendations_and_gap():
    # Login as demo student
    login_res = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch recommendations
    rec_res = client.get("/api/recommendations", headers=headers)
    assert rec_res.status_code == 200
    recs = rec_res.json()
    assert len(recs) > 0
    # Ranked by match_score descending
    scores = [r["match_score"] for r in recs]
    assert scores == sorted(scores, reverse=True)

    # Fetch skill gap
    gap_res = client.get("/api/recommendations/skill-gap", headers=headers)
    assert gap_res.status_code == 200
    gap = gap_res.json()
    assert "skills_have" in gap
    assert "skills_to_improve" in gap
