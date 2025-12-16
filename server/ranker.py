from models import EnrichedLead, CompanyMetadata, PersonMetadata

def calculate_score(lead: EnrichedLead) -> EnrichedLead:
    score = 0
    reasons = []

    # 1. Role Fit (Title) - Max 30
    title_lower = lead.person.title.lower()
    high_value_keywords = ["director", "head", "vp", "chief"]
    relevant_keywords = ["toxicology", "safety", "hepatic", "3d", "preclinical", "liver"]
    
    is_high_level = any(k in title_lower for k in high_value_keywords)
    is_relevant = any(k in title_lower for k in relevant_keywords)

    if is_high_level and is_relevant:
        score += 30
        reasons.append("High Value Role (+30)")
    elif is_relevant: # Lower level but relevant
        score += 15
        reasons.append("Relevant Role (+15)")
    
    # 2. Company Intent - Max 20
    if lead.company_meta.funding_stage in ["Series A", "Series B"]:
        score += 20
        reasons.append("High Growth Funding (+20)")
    elif lead.company_meta.funding_stage in ["Series C", "IPO"]:
        score += 10 # More established, maybe harder to sell new tech? Or maybe 10 is fair.
        reasons.append("Established Funding (+10)")

    # 3. Technographic - Max 15
    if lead.company_meta.uses_tech:
        score += 15
        reasons.append("Uses Similar Tech (+15)")
    elif lead.company_meta.open_to_nams:
        score += 10
        reasons.append("Open to NAMs (+10)")

    # 4. Location Hub - Max 10
    if lead.company_meta.is_hub:
        score += 10
        reasons.append("In Biotech Hub (+10)")

    # 5. Scientific Intent - Max 40 (Very High!)
    if lead.person_meta.has_recent_paper:
        score += 40
        reasons.append("Recent IDILI/3D Paper (+40)")

    # Cap at 100
    lead.score = min(score, 100)
    lead.rank_reasons = reasons
    return lead
