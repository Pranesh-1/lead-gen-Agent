import random
from faker import Faker
from models import EnrichedLead, Person, CompanyMetadata, PersonMetadata
from ranker import calculate_score

fake = Faker()

# Data Pools for realistic generation
TITLES = [
    "Director of Toxicology", "Head of Preclinical Safety", "VP Safety Assessment",
    "Senior Scientist, Liver Toxicity", "Principal Investigator", "Research Scientist II",
    "Toxicologist", "Chief Scientific Officer", "Head of Discovery", "Junior Researcher"
]

COMPANIES = [
    {"name": "Pfizer", "loc": "New York, NY", "stage": "IPO", "is_hub": True},
    {"name": "Moderna", "loc": "Cambridge, MA", "stage": "IPO", "is_hub": True},
    {"name": "BioTech One", "loc": "San Francisco, CA", "stage": "Series B", "is_hub": True},
    {"name": "NanoCure", "loc": "Austin, TX", "stage": "Series A", "is_hub": False},
    {"name": "LiverChip Inc", "loc": "Boston, MA", "stage": "Series B", "is_hub": True},
    {"name": "SafeMeds", "loc": "Basel, Switzerland", "stage": "Series C", "is_hub": True},
    {"name": "Global Pharma", "loc": "London, UK", "stage": "IPO", "is_hub": True},
    {"name": "SmallStart", "loc": "Remote", "stage": "Seed", "is_hub": False},
]

PAPER_TITLES = [
    "Drug-Induced Liver Injury in 3D Models",
    "Novel Hepatic Spheroids for Toxicity Screening",
    "Organ-on-Chip Approaches for Safety Assessment",
    "Mechanisms of DILI in Human Hepatocytes",
    None, None, None, None, None, None # Bias towards no paper
]

LOCATIONS = ["Cambridge, MA", "San Francisco, CA", "Boston, MA", "Basel", "Remote", "London", "Austin, TX", "San Diego, CA"]

def generate_demo_leads(count: int = 50) -> list[EnrichedLead]:
    leads = []
    
    # 1. Generate Random Profiles
    for _ in range(count):
        company_data = random.choice(COMPANIES)
        title = random.choice(TITLES)
        person_loc = random.choice(LOCATIONS)
        
        # Logic to match person location to company sometimes
        if random.random() > 0.6:
            person_loc = company_data["loc"]

        person = Person(
            id=fake.uuid4(),
            name=fake.name(),
            title=title,
            company=company_data["name"],
            location_person=person_loc,
            location_company=company_data["loc"],
            email=fake.email(), 
            phone=fake.phone_number(),
            linkedin_url=f"https://linkedin.com/in/{fake.slug()}"
        )

        # Company Metadata
        comp_meta = CompanyMetadata(
            name=company_data["name"],
            funding_stage=company_data["stage"],
            uses_tech=random.choice([True, False]),
            open_to_nams=random.choice([True, False]),
            is_hub=company_data["is_hub"]
        )

        # Person Metadata (Scientific Intent)
        # Bias: Directors/Heads more likely to have paper? Or maybe Scientists?
        paper = random.choice(PAPER_TITLES)
        
        # Make "Perfect Lead" scenario possible (Director + Series B + Paper)
        if "Director" in title and company_data["stage"] == "Series B" and random.random() > 0.7:
             paper = "Advanced 3D Liver Toxicity Screen"

        person_meta = PersonMetadata(
            has_recent_paper=bool(paper),
            paper_title=paper,
            years_experience=random.randint(2, 25)
        )

        lead = EnrichedLead(
            person=person,
            company_meta=comp_meta,
            person_meta=person_meta
        )
        
        # Calculate Score
        lead = calculate_score(lead)
        leads.append(lead)
    
    # 2. Add specific 'Golden Example' from prompt if not randomly generated
    # "Director of Safety Assessment at a Series B biotech in Cambridge, MA who just published on liver toxicity" -> 95/100
    golden_person = Person(
        id="golden-1",
        name="Dr. Sarah Chen",
        title="Director of Safety Assessment",
        company="Hepatix Bio",
        location_person="Cambridge, MA",
        location_company="Cambridge, MA",
        email="s.chen@hepatix.bio",
        phone="+1-555-0199"
    )
    golden_comp = CompanyMetadata(name="Hepatix Bio", funding_stage="Series B", is_hub=True, uses_tech=True)
    golden_meta = PersonMetadata(has_recent_paper=True, paper_title="Predictive DILI Models", years_experience=15)
    golden_lead = EnrichedLead(person=golden_person, company_meta=golden_comp, person_meta=golden_meta)
    golden_lead = calculate_score(golden_lead)
    leads.append(golden_lead)

    # Sort by score descending
    leads.sort(key=lambda x: x.score, reverse=True)
    
    return leads
